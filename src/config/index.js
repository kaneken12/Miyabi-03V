const Database = require('../database/db');

class Config {
    constructor() {
        this.settings = new Map();
        this.db = null;
    }

    async initialize() {
        this.db = new Database();
        await this.db.connect();
        await this.loadSettings();
    }

    async loadSettings() {
        try {
            // Charger tous les paramètres depuis la base de données JSON
            const allSettings = await this.db.settings;
            
            for (const [key, setting] of Object.entries(allSettings)) {
                let value;
                const settingType = setting.type || 'string';
                
                switch (settingType) {
                    case 'number':
                        value = Number(setting.value);
                        break;
                    case 'boolean':
                        value = setting.value === 'true';
                        break;
                    case 'json':
                        value = JSON.parse(setting.value);
                        break;
                    default:
                        value = setting.value;
                }
                this.settings.set(key, value);
            }
            
            console.log(`✅ ${this.settings.size} paramètres chargés`);
        } catch (error) {
            console.error('❌ Erreur chargement paramètres:', error);
        }
    }

    get(key, defaultValue = null) {
        return this.settings.get(key) || defaultValue;
    }

    set(key, value) {
        this.settings.set(key, value);
        // Optionnel: sauvegarder en base de données
        if (this.db) {
            this.db.updateSetting(key, String(value));
        }
    }

    getBotName() {
        return this.get('bot_name', 'Miyabi');
    }

    getMoodChangeInterval() {
        const min = this.get('mood_change_interval_min', 300000);
        const max = this.get('mood_change_interval_max', 900000);
        return { min, max };
    }

    getMaxContextMessages() {
        return this.get('max_context_messages', 5);
    }

    getResponseTimeout() {
        return this.get('response_timeout', 30000);
    }
}

// Instance singleton
const config = new Config();

module.exports = config;