const fs = require('fs');
const path = require('path');
const { normalizePhone } = require('../utils/helper');

class Database {
    constructor() {
        // Définir le répertoire de données
        this.dataDir = path.join(process.cwd(), 'data');
        
        // Chemins des fichiers JSON
        this.messagesFile = path.join(this.dataDir, 'messages.json');
        this.conversationsFile = path.join(this.dataDir, 'conversations.json');
        this.moodHistoryFile = path.join(this.dataDir, 'mood_history.json');
        this.usersFile = path.join(this.dataDir, 'users.json');
        this.settingsFile = path.join(this.dataDir, 'settings.json');
        
        // Structures de données en mémoire
        this.messages = [];
        this.conversations = [];
        this.moodHistory = [];
        this.users = [];
        this.settings = {};
        
        this.init();
    }

    async init() {
        try {
            // Créer le répertoire data s'il n'existe pas
            if (!fs.existsSync(this.dataDir)) {
                fs.mkdirSync(this.dataDir, { recursive: true });
            }
            
            // Initialiser les fichiers JSON
            this.initializeFiles();
            
            // Charger les données depuis les fichiers
            await this.loadData();
            
            // Initialiser les paramètres par défaut
            this.initializeDefaultSettings();
            
            // Initialiser l'utilisateur créateur
            this.initializeCreatorUser();
            
            console.log('✅ Base de données JSON initialisée - db.js:46');
        } catch (error) {
            console.error('❌ Erreur initialisation DB: - db.js:48', error);
        }
    }

    async connect() {
        try {
            console.log('✅ Connecté à la base de données JSON - db.js:54');
        } catch (error) {
            console.error('❌ Erreur connexion DB: - db.js:56', error);
            throw error;
        }
    }

    initializeFiles() {
        const files = [
            { file: this.messagesFile, defaultValue: [] },
            { file: this.conversationsFile, defaultValue: [] },
            { file: this.moodHistoryFile, defaultValue: [] },
            { file: this.usersFile, defaultValue: [] },
            { file: this.settingsFile, defaultValue: {} }
        ];

        for (const { file, defaultValue } of files) {
            if (!fs.existsSync(file)) {
                fs.writeFileSync(file, JSON.stringify(defaultValue, null, 2), 'utf-8');
            }
        }
    }

    async loadData() {
        try {
            this.messages = JSON.parse(fs.readFileSync(this.messagesFile, 'utf-8'));
            this.conversations = JSON.parse(fs.readFileSync(this.conversationsFile, 'utf-8'));
            this.moodHistory = JSON.parse(fs.readFileSync(this.moodHistoryFile, 'utf-8'));
            this.users = JSON.parse(fs.readFileSync(this.usersFile, 'utf-8'));
            this.settings = JSON.parse(fs.readFileSync(this.settingsFile, 'utf-8'));
        } catch (error) {
            console.error('❌ Erreur chargement données: - db.js:85', error);
            this.messages = [];
            this.conversations = [];
            this.moodHistory = [];
            this.users = [];
            this.settings = {};
        }
    }

    saveToFile(fileName, data) {
        try {
            fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error) {
            console.error(`❌ Erreur sauvegarde ${fileName}: - db.js:98`, error);
        }
    }

    initializeDefaultSettings() {
        const defaultSettings = {
            bot_name: {
                value: 'Miyabi',
                type: 'string',
                description: 'Nom du bot'
            },
            mood_change_interval_min: {
                value: '300000',
                type: 'number',
                description: 'Intervalle minimum de changement d\'humeur (ms)'
            },
            mood_change_interval_max: {
                value: '900000',
                type: 'number',
                description: 'Intervalle maximum de changement d\'humeur (ms)'
            },
            max_context_messages: {
                value: '5',
                type: 'number',
                description: 'Nombre maximum de messages pour le contexte'
            },
            response_timeout: {
                value: '30000',
                type: 'number',
                description: 'Timeout pour les réponses (ms)'
            }
        };

        // Fusionner avec les paramètres existants
        this.settings = { ...defaultSettings, ...this.settings };
        this.saveToFile(this.settingsFile, this.settings);
    }

    initializeCreatorUser() {
        const creatorNumber = process.env.CREATOR_NUMBER;
        if (creatorNumber) {
            // Normaliser et vérifier si l'utilisateur créateur existe
            const normalizedCreator = normalizePhone(creatorNumber) || creatorNumber;
            const existingCreator = this.users.find(u => normalizePhone(u.phone_number) === normalizedCreator);

            if (!existingCreator) {
                this.users.push({
                    id: this.users.length + 1,
                    phone_number: normalizedCreator,
                    name: 'Créateur',
                    is_creator: true,
                    last_seen: new Date().toISOString(),
                    interaction_count: 0,
                    created_at: new Date().toISOString()
                });
                this.saveToFile(this.usersFile, this.users);
            } else if (!existingCreator.is_creator) {
                existingCreator.is_creator = true;
                this.saveToFile(this.usersFile, this.users);
            }
        }
    }

    async saveMessage(messageData) {
        try {
            // Vérifier si le message existe déjà
            const existingMessage = this.messages.find(m => m.message_id === messageData.message_id);
            
            if (!existingMessage) {
                const newMessage = {
                    id: this.messages.length + 1,
                    message_id: messageData.message_id,
                    chat_id: messageData.chat_id,
                    sender: messageData.sender,
                    message: messageData.message,
                    is_group: messageData.is_group || false,
                    is_bot: messageData.is_bot || false,
                    timestamp: messageData.timestamp ? messageData.timestamp.toISOString() : new Date().toISOString(),
                    created_at: new Date().toISOString()
                };
                
                this.messages.push(newMessage);
                this.saveToFile(this.messagesFile, this.messages);
                
                // Mettre à jour la conversation
                await this.updateConversation(messageData.chat_id);
                
                // Mettre à jour les statistiques utilisateur
                await this.updateUserStats(messageData.sender);
                
                return newMessage;
            }
            
            return existingMessage;
        } catch (error) {
            console.error('❌ Erreur sauvegarde message: - db.js:193', error);
            return null;
        }
    }

    async updateConversation(chatId) {
        try {
            let conversation = this.conversations.find(c => c.chat_id === chatId);
            
            if (conversation) {
                conversation.last_activity = new Date().toISOString();
                conversation.message_count = (conversation.message_count || 0) + 1;
            } else {
                conversation = {
                    id: this.conversations.length + 1,
                    chat_id: chatId,
                    last_activity: new Date().toISOString(),
                    message_count: 1,
                    created_at: new Date().toISOString()
                };
                this.conversations.push(conversation);
            }
            
            this.saveToFile(this.conversationsFile, this.conversations);
            return conversation;
        } catch (error) {
            console.error('❌ Erreur mise à jour conversation: - db.js:219', error);
            return null;
        }
    }

    async updateUserStats(phoneNumber) {
        try {
            const normalized = normalizePhone(phoneNumber) || phoneNumber;
            let user = this.users.find(u => normalizePhone(u.phone_number) === normalized);
            
            if (user) {
                user.last_seen = new Date().toISOString();
                user.interaction_count = (user.interaction_count || 0) + 1;
            } else {
                user = {
                    id: this.users.length + 1,
                    phone_number: normalized,
                    name: phoneNumber,
                    is_creator: false,
                    last_seen: new Date().toISOString(),
                    interaction_count: 1,
                    created_at: new Date().toISOString()
                };
                this.users.push(user);
            }
            
            this.saveToFile(this.usersFile, this.users);
            return user;
        } catch (error) {
            console.error('❌ Erreur mise à jour stats utilisateur: - db.js:248', error);
            return null;
        }
    }

    async getConversationContext(chatId, limit = 5) {
        try {
            const chatMessages = this.messages
                .filter(m => m.chat_id === chatId)
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                .slice(-limit);
            
            return chatMessages;
        } catch (error) {
            console.error('❌ Erreur récupération contexte conversation: - db.js:262', error);
            return [];
        }
    }

    async getStats() {
        try {
            const botMessages = this.messages.filter(m => m.is_bot === true).length;
            
            return {
                totalMessages: this.messages.length,
                totalConversations: this.conversations.length,
                totalUsers: this.users.length,
                botMessages: botMessages
            };
        } catch (error) {
            console.error('❌ Erreur récupération stats: - db.js:278', error);
            return { 
                totalMessages: 0, 
                totalConversations: 0, 
                totalUsers: 0, 
                botMessages: 0 
            };
        }
    }

    async saveMoodChange(moodName, duration) {
        try {
            const moodEntry = {
                id: this.moodHistory.length + 1,
                mood_name: moodName,
                duration: duration,
                timestamp: new Date().toISOString()
            };
            
            this.moodHistory.push(moodEntry);
            this.saveToFile(this.moodHistoryFile, this.moodHistory);
            
            return moodEntry;
        } catch (error) {
            console.error('❌ Erreur sauvegarde humeur: - db.js:302', error);
            return null;
        }
    }

    async getMoodHistory(limit = 10) {
        try {
            return this.moodHistory
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, limit);
        } catch (error) {
            console.error('❌ Erreur récupération historique humeurs: - db.js:313', error);
            return [];
        }
    }

    async getSetting(key) {
        try {
            const setting = this.settings[key];
            if (setting) {
                return {
                    setting_key: key,
                    setting_value: setting.value,
                    setting_type: setting.type,
                    description: setting.description
                };
            }
            return null;
        } catch (error) {
            console.error('❌ Erreur récupération setting: - db.js:331', error);
            return null;
        }
    }

    async updateSetting(key, value) {
        try {
            if (this.settings[key]) {
                this.settings[key].value = value;
                this.settings[key].updated_at = new Date().toISOString();
            }
            this.saveToFile(this.settingsFile, this.settings);
            return this.settings[key];
        } catch (error) {
            console.error('❌ Erreur mise à jour setting: - db.js:345', error);
            return null;
        }
    }

    async getUser(phoneNumber) {
        try {
            const normalized = normalizePhone(phoneNumber) || phoneNumber;
            return this.users.find(u => normalizePhone(u.phone_number) === normalized) || null;
        } catch (error) {
            console.error('❌ Erreur récupération utilisateur: - db.js:355', error);
            return null;
        }
    }

    async getTopUsers(limit = 10) {
        try {
            return this.users
                .sort((a, b) => (b.interaction_count || 0) - (a.interaction_count || 0))
                .slice(0, limit);
        } catch (error) {
            console.error('❌ Erreur récupération top utilisateurs: - db.js:366', error);
            return [];
        }
    }

    async getRecentConversations(limit = 10) {
        try {
            return this.conversations
                .sort((a, b) => new Date(b.last_activity) - new Date(a.last_activity))
                .slice(0, limit);
        } catch (error) {
            console.error('❌ Erreur récupération conversations récentes: - db.js:377', error);
            return [];
        }
    }

    async disconnect() {
        try {
            // Sauvegarder les données finales
            this.saveToFile(this.messagesFile, this.messages);
            this.saveToFile(this.conversationsFile, this.conversations);
            this.saveToFile(this.moodHistoryFile, this.moodHistory);
            this.saveToFile(this.usersFile, this.users);
            this.saveToFile(this.settingsFile, this.settings);
            
            console.log('✅ Déconnecté de la base de données JSON - db.js:391');
        } catch (error) {
            console.error('❌ Erreur déconnexion: - db.js:393', error);
        }
    }
}

module.exports = Database;