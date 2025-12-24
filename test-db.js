#!/usr/bin/env node

/**
 * Script de Test de la Base de Données JSON
 * Vérifie que toutes les fonctionnalités de la DB fonctionnent correctement
 */

const Database = require('./src/database/db');
const path = require('path');
const fs = require('fs');

async function runTests() {
    console.log('🧪 Tests de la Base de Données JSON\n');
    console.log('=' .repeat(50));

    const db = new Database();
    await db.connect();

    let passed = 0;
    let failed = 0;

    // Test 1: Vérifier que les fichiers existent
    console.log('\n✓ Test 1: Fichiers de données créés');
    const files = [
        db.messagesFile,
        db.conversationsFile,
        db.moodHistoryFile,
        db.usersFile,
        db.settingsFile
    ];

    for (const file of files) {
        if (fs.existsSync(file)) {
            console.log(`  ✅ ${path.basename(file)}`);
            passed++;
        } else {
            console.log(`  ❌ ${path.basename(file)}`);
            failed++;
        }
    }

    // Test 2: Sauvegarder un message
    console.log('\n✓ Test 2: Sauvegarde d\'un message');
    try {
        const result = await db.saveMessage({
            message_id: 'test_' + Date.now(),
            chat_id: '120363123456789@g.us',
            sender: '+237692798136',
            message: 'Message de test',
            is_group: true,
            timestamp: new Date()
        });
        if (result) {
            console.log('  ✅ Message sauvegardé');
            passed++;
        } else {
            console.log('  ❌ Erreur sauvegarde message');
            failed++;
        }
    } catch (error) {
        console.log('  ❌ Exception:', error.message);
        failed++;
    }

    // Test 3: Récupérer les statistiques
    console.log('\n✓ Test 3: Récupération des statistiques');
    try {
        const stats = await db.getStats();
        console.log(`  ✅ Stats: ${JSON.stringify(stats)}`);
        passed++;
    } catch (error) {
        console.log('  ❌ Exception:', error.message);
        failed++;
    }

    // Test 4: Sauvegarder un changement d'humeur
    console.log('\n✓ Test 4: Sauvegarde d\'un changement d\'humeur');
    try {
        const mood = await db.saveMoodChange('happy', 600000);
        if (mood) {
            console.log('  ✅ Humeur sauvegardée');
            passed++;
        } else {
            console.log('  ❌ Erreur sauvegarde humeur');
            failed++;
        }
    } catch (error) {
        console.log('  ❌ Exception:', error.message);
        failed++;
    }

    // Test 5: Récupérer le contexte de conversation
    console.log('\n✓ Test 5: Contexte de conversation');
    try {
        const context = await db.getConversationContext('120363123456789@g.us', 5);
        console.log(`  ✅ Contexte: ${context.length} messages`);
        passed++;
    } catch (error) {
        console.log('  ❌ Exception:', error.message);
        failed++;
    }

    // Test 6: Mettre à jour les statistiques utilisateur
    console.log('\n✓ Test 6: Mise à jour stats utilisateur');
    try {
        const user = await db.updateUserStats('+237692798136');
        if (user) {
            console.log('  ✅ Stats utilisateur mises à jour');
            passed++;
        } else {
            console.log('  ❌ Erreur mise à jour');
            failed++;
        }
    } catch (error) {
        console.log('  ❌ Exception:', error.message);
        failed++;
    }

    // Test 7: Récupérer un utilisateur
    console.log('\n✓ Test 7: Récupération utilisateur');
    try {
        const user = await db.getUser('+237692798136');
        if (user) {
            console.log(`  ✅ Utilisateur trouvé: ${user.phone_number}`);
            passed++;
        } else {
            console.log('  ❌ Utilisateur non trouvé');
            failed++;
        }
    } catch (error) {
        console.log('  ❌ Exception:', error.message);
        failed++;
    }

    // Test 8: Récupérer les top utilisateurs
    console.log('\n✓ Test 8: Top utilisateurs');
    try {
        const topUsers = await db.getTopUsers(5);
        console.log(`  ✅ Top utilisateurs: ${topUsers.length}`);
        passed++;
    } catch (error) {
        console.log('  ❌ Exception:', error.message);
        failed++;
    }

    // Test 9: Récupérer les conversations récentes
    console.log('\n✓ Test 9: Conversations récentes');
    try {
        const recentConversations = await db.getRecentConversations(5);
        console.log(`  ✅ Conversations: ${recentConversations.length}`);
        passed++;
    } catch (error) {
        console.log('  ❌ Exception:', error.message);
        failed++;
    }

    // Test 10: Récupérer et mettre à jour un setting
    console.log('\n✓ Test 10: Paramètres');
    try {
        const setting = await db.getSetting('bot_name');
        if (setting) {
            console.log(`  ✅ Paramètre trouvé: ${setting.setting_key} = ${setting.setting_value}`);
            passed++;
        } else {
            console.log('  ❌ Paramètre non trouvé');
            failed++;
        }
    } catch (error) {
        console.log('  ❌ Exception:', error.message);
        failed++;
    }

    // Résumé
    console.log('\n' + '='.repeat(50));
    console.log('\n📊 Résumé des Tests');
    console.log(`  ✅ Réussis: ${passed}`);
    console.log(`  ❌ Échoués: ${failed}`);
    console.log(`  📈 Taux de réussite: ${Math.round((passed / (passed + failed)) * 100)}%`);

    if (failed === 0) {
        console.log('\n🎉 Tous les tests sont passés!');
    } else {
        console.log('\n⚠️  Certains tests ont échoué. Vérifie les logs.');
    }

    // Déconnexion
    await db.disconnect();
    process.exit(failed === 0 ? 0 : 1);
}

runTests().catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
});
