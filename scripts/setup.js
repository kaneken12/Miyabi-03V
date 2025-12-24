require('dotenv').config();
const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function setup() {
    console.log('🎀 Configuration de Miyabi WhatsApp Bot\n - setup.js:18');
    
    // Vérifier si .env existe
    if (!fs.existsSync('.env')) {
        console.log('📝 Création du fichier .env... - setup.js:22');
        fs.copyFileSync('.env.example', '.env');
    }

    // Demander les configurations
    const geminiKey = await question('🔑 Entrez votre clé API Gemini: ');
    const botName = await question('🤖 Nom du bot (Miyabi): ') || 'Miyabi';
    const creatorNumber = await question('👤 Numéro WhatsApp du créateur (+237...): ');

    // Mettre à jour le .env
    let envContent = fs.readFileSync('.env', 'utf8');
    envContent = envContent.replace('your_google_api_key_here', geminiKey);
    envContent = envContent.replace('Miyabi', botName);
    envContent = envContent.replace('+237692798136', creatorNumber);

    fs.writeFileSync('.env', envContent);

    console.log('\n✅ Configuration terminée! - setup.js:39');
    console.log('📝 Base de données: Fichiers JSON (créés automatiquement dans /data) - setup.js:40');
    console.log('📦 Installation des dépendances... - setup.js:41');

    try {
        execSync('npm install', { stdio: 'inherit' });
        console.log('🎉 Installation terminée! - setup.js:45');
        console.log('\n🚀 Pour démarrer le bot: - setup.js:46');
        console.log('npm start - setup.js:47');
    } catch (error) {
        console.error('❌ Erreur lors de l\'installation: - setup.js:49', error);
    }

    rl.close();
}

setup().catch(console.error);