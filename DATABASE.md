# 📊 Base de Données - Système JSON

## Architecture

Le bot Miyabi utilise désormais une **base de données basée sur des fichiers JSON** au lieu de PostgreSQL. Cette approche simplifie le déploiement et l'installation.

### Fichiers JSON

Les données sont sauvegardées dans le dossier `/data` avec les fichiers suivants :

```
data/
├── messages.json          # Historique de tous les messages
├── conversations.json     # Données des conversations actives
├── mood_history.json      # Historique des changements d'humeur
├── users.json            # Informations des utilisateurs
└── settings.json         # Paramètres du bot
```

## Structure des Données

### messages.json
```json
[
  {
    "id": 1,
    "message_id": "unique_id",
    "chat_id": "120363...",
    "sender": "+237...",
    "message": "Texte du message",
    "is_group": false,
    "is_bot": false,
    "timestamp": "2025-12-23T10:30:00.000Z",
    "created_at": "2025-12-23T10:30:00.000Z"
  }
]
```

### conversations.json
```json
[
  {
    "id": 1,
    "chat_id": "120363...",
    "last_activity": "2025-12-23T10:30:00.000Z",
    "message_count": 42,
    "created_at": "2025-12-23T10:30:00.000Z"
  }
]
```

### mood_history.json
```json
[
  {
    "id": 1,
    "mood_name": "happy",
    "duration": 600000,
    "timestamp": "2025-12-23T10:30:00.000Z"
  }
]
```

### users.json
```json
[
  {
    "id": 1,
    "phone_number": "+237...",
    "name": "Utilisateur",
    "is_creator": false,
    "last_seen": "2025-12-23T10:30:00.000Z",
    "interaction_count": 5,
    "created_at": "2025-12-23T10:30:00.000Z"
  }
]
```

### settings.json
```json
{
  "bot_name": {
    "value": "Miyabi",
    "type": "string",
    "description": "Nom du bot"
  },
  "mood_change_interval_min": {
    "value": "300000",
    "type": "number",
    "description": "Intervalle minimum de changement d'humeur (ms)"
  }
}
```

## Avantages de la DB JSON

✅ **Pas de serveur requis** - Fonctionnement autonome sans PostgreSQL
✅ **Facilité de sauvegarde** - Les fichiers JSON peuvent être sauvegardés avec git
✅ **Portable** - Fonctionne partout sans configuration externe
✅ **Léger** - Parfait pour des petites à moyennes charges
✅ **Facile à déboguer** - Lisible et éditable manuellement

## Limitations

⚠️ **Concurrence limitée** - Les opérations n'est pas thread-safe pour plusieurs instances
⚠️ **Performances** - Less rapide que PostgreSQL pour très grandes bases
⚠️ **Scalabilité** - Pas idéal pour des millions de messages

## Sauvegarde des Données

### Sauvegarde Manuelle
```bash
# Copier le dossier data
cp -r data/ data_backup/
```

### Sauvegarde Automatique (Git)
Les fichiers JSON dans `/data` sont sauvegardés comme n'importe quel autre fichier :
```bash
git add data/
git commit -m "Sauvegarde des données bot"
git push
```

## Migration depuis PostgreSQL

Si vous aviez une base PostgreSQL antérieurement :

1. **Exporter les données PostgreSQL** en JSON
2. **Placer les fichiers** dans le dossier `/data`
3. **Démarrer le bot** - Il utilisera les fichiers existants

## API Database

### Méthodes Principales

```javascript
const db = new Database();
await db.connect();

// Messages
await db.saveMessage(messageData);
const context = await db.getConversationContext(chatId, 5);

// Conversations
await db.updateConversation(chatId);
const recentConversations = await db.getRecentConversations(10);

// Statistiques
const stats = await db.getStats();
// Retourne: { totalMessages, totalConversations, totalUsers, botMessages }

// Humeurs
await db.saveMoodChange(moodName, duration);
const moodHistory = await db.getMoodHistory(10);

// Paramètres
await db.updateSetting('key', 'value');
const setting = await db.getSetting('key');

// Utilisateurs
await db.updateUserStats(phoneNumber);
const user = await db.getUser(phoneNumber);
const topUsers = await db.getTopUsers(10);

// Déconnexion
await db.disconnect();
```

## Maintenance

### Nettoyage des Vieux Messages
```bash
# Vous pouvez éditer manuellement data/messages.json
# ou créer un script pour archiver les anciens messages
```

### Vérification Intégrité
Les fichiers JSON sont validés au chargement. Si un fichier est corrompu, le bot créera un nouveau fichier par défaut.

---

**Dernière mise à jour**: Décembre 2025
