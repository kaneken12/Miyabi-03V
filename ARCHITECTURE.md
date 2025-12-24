# 🏗️ Architecture du Projet - Miyabi v2.0

```
miyabi-whatsapp-bot/
│
├── 📁 src/                          # Code source principal
│   ├── 📁 ai/
│   │   └── geminiClient.js         # Interface Google Gemini
│   │
│   ├── 📁 bot/
│   │   ├── miyabibot.js            # Classe principale du bot
│   │   ├── messageHandler.js       # Gestion des messages
│   │   └── moodSystem.js           # Système d'humeurs
│   │
│   ├── 📁 config/
│   │   └── index.js                # Configuration (JSON based)
│   │
│   ├── 📁 database/                # ⭐ BASE DE DONNÉES JSON
│   │   ├── db.js                   # Classe Database (JSON FS)
│   │   └── model.js                # Modèles de données
│   │
│   └── 📁 utils/
│       ├── helpers.js              # Fonctions utilitaires
│       └── stickers.js             # Gestion des stickers
│
├── 📁 data/                        # 💾 BASE DE DONNÉES (Fichiers JSON)
│   ├── messages.json               # 💬 Historique messages
│   ├── conversations.json          # 🗨️ Données conversations
│   ├── mood_history.json           # 😊 Historique humeurs
│   ├── users.json                  # 👥 Données utilisateurs
│   └── settings.json               # ⚙️ Paramètres bot
│
├── 📁 scripts/
│   └── setup.js                    # Script configuration
│
├── 📁 stickers/
│   └── main/                       # Stickers émotionnels
│
├── 📁 auth_info_baileys/           # 🔐 Session WhatsApp
│
├── 🐳 Fichiers Docker
│   ├── dockerfile                  # Image Docker
│   └── docker-compose.yml          # Orchestration
│
├── 📄 Fichiers Configuration
│   ├── .env                        # Variables d'environnement
│   ├── .env.example                # Template .env
│   ├── .gitignore                  # Fichiers ignorés
│   ├── package.json                # Dépendances Node
│   └── README.md                   # Documentation principal
│
├── 📚 Documentation (Nouveau v2.0)
│   ├── DATABASE.md                 # ⭐ Docs base de données JSON
│   ├── QUICKSTART.md               # ⭐ Installation rapide
│   ├── MIGRATION.md                # ⭐ Migration PostgreSQL
│   ├── CHANGELOG.md                # ⭐ Historique
│   ├── MODIFICATIONS_SUMMARY.md    # ⭐ Résumé technique
│   └── RESUME_CORRECTIONS.md       # ⭐ Résumé français
│
└── 🧪 Tests
    └── test-db.js                  # ⭐ Tests automatisés DB
```

---

## 🔄 Flux d'Application

```
┌─────────────────────────────────────────────────────────────┐
│                    WhatsApp Utilisateur                      │
└────────────────────┬────────────────────────────────────────┘
                     │ Message entrant
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                index.js (Point d'entrée)                    │
│  • Connexion WhatsApp (Baileys)                            │
│  • Initialisation Database                                  │
│  • Initialisation Bot Miyabi                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              MiyabiBot.handleMessage()                       │
│  • Extrait le texte du message                             │
│  • Sauvegarde en Database                                  │
│  • Appelle messageHandler                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│           MessageHandler.handleMessage()                     │
│  • Traitement spécifique du message                        │
│  • Décision de répondre ou non                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│        MiyabiBot.generateAndSendResponse()                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 1. Récupère contexte conversation (Database)       │    │
│  │ 2. Obtient humeur actuelle (MoodSystem)            │    │
│  │ 3. Analyse déclencheurs d'humeur                   │    │
│  │ 4. Génère réponse (GeminiClient)                   │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ↓                         ↓
┌──────────────────────┐  ┌─────────────────┐
│  Récupère Sticker    │  │ Sauvegarde      │
│  correspondant à      │  │ Réponse dans    │
│  l'humeur            │  │ Database        │
│  (StickerManager)    │  │                 │
└──────────┬───────────┘  └────────┬────────┘
           │                       │
           └───────────┬───────────┘
                       ↓
        ┌──────────────────────────────┐
        │  Envoie via WhatsApp:        │
        │  1. Sticker émotionnel       │
        │  2. Réponse textuelle        │
        └──────────┬───────────────────┘
                   │
                   ↓
        ┌──────────────────────────────┐
        │   Utilisateur reçoit         │
        │   réponse personalisée 🎉    │
        └──────────────────────────────┘
```

---

## 💾 Architecture Base de Données

### Avant (v1.0 - PostgreSQL)
```
┌─────────────────┐
│   Application   │
└────────┬────────┘
         │ SQL Queries
         ↓
┌────────────────────────────┐
│  PostgreSQL Connection     │
│  (Pool de connexions)      │
└────────┬───────────────────┘
         │
         ↓
┌────────────────────────────┐
│   PostgreSQL Server        │
│   (processus séparé)       │
└────────┬───────────────────┘
         │
         ↓
┌────────────────────────────┐
│   Disque (Fichiers DB)     │
└────────────────────────────┘
```

### Après (v2.0 - JSON File System)
```
┌─────────────────────┐
│   Application       │
│  (Node.js Process)  │
└────────┬────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│   Database (JSON File System)       │
│  ┌─────────────────────────────┐   │
│  │ Cache en Mémoire (RAM)      │   │
│  │ • messages[]                │   │
│  │ • conversations[]           │   │
│  │ • mood_history[]            │   │
│  │ • users[]                   │   │
│  │ • settings{}                │   │
│  └────────┬────────────────────┘   │
│           │ saveToFile()            │
│           ↓                         │
│  ┌─────────────────────────────┐   │
│  │ Fichiers JSON sur Disque    │   │
│  │ • data/messages.json        │   │
│  │ • data/conversations.json   │   │
│  │ • data/mood_history.json    │   │
│  │ • data/users.json           │   │
│  │ • data/settings.json        │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 🔌 Dépendances Principales

```
miyabi-whatsapp-bot (v2.0)
│
├── @whiskeysockets/baileys@^6.5.0
│   └── Connexion WhatsApp (API officielle Baileys)
│
├── @google/generative-ai@^0.21.0
│   └── API Google Gemini (IA Générative)
│
├── dotenv@^16.3.1
│   └── Gestion des variables d'environnement
│
├── qrcode-terminal@^0.12.0
│   └── Génération QR code pour terminal
│
├── axios@^1.5.0
│   └── Requêtes HTTP
│
├── express@^4.18.2
│   └── Framework web (futur)
│
└── pino@^8.15.0
    └── Logging performant

❌ SUPPRIMÉ: pg@^8.11.3 (PostgreSQL)
```

---

## ⚙️ Classes Principales

### Database
```javascript
class Database {
  // Fichiers JSON
  messagesFile
  conversationsFile
  moodHistoryFile
  usersFile
  settingsFile
  
  // Cache mémoire
  messages = []
  conversations = []
  moodHistory = []
  users = []
  settings = {}
  
  // Méthodes
  saveMessage()
  getConversationContext()
  updateUserStats()
  saveMoodChange()
  getStats()
  // ... 15+ méthodes
}
```

### MiyabiBot
```javascript
class MiyabiBot {
  db                // Instance Database
  gemini            // GeminiClient
  moodSystem        // MoodSystem
  stickerManager    // StickerManager
  messageHandler    // MessageHandler
  
  handleMessage()          // Point d'entrée
  generateAndSendResponse() // Génère la réponse
}
```

### MoodSystem
```javascript
class MoodSystem {
  moods = [
    { name: 'happy', triggers: [...] },
    { name: 'sad', triggers: [...] },
    { name: 'angry', triggers: [...] },
    { name: 'excited', triggers: [...] },
    { name: 'tired', triggers: [...] },
    { name: 'neutral', triggers: [...] }
  ]
  
  getCurrentMood()
  startMoodUpdates()
  analyzeMessageForMoodTrigger()
}
```

---

## 📡 Flux de Données

### Sauvegarde Message
```
Message WhatsApp
    ↓
miyabibot.handleMessage()
    ↓
db.saveMessage()
    ↓
this.messages.push() [RAM]
    ↓
saveToFile() [Disque]
    ↓
db.updateConversation()
db.updateUserStats()
```

### Génération Réponse
```
Contexte [Database]
Humeur [MoodSystem]
    ↓
GeminiClient.generateResponse()
    ↓
Réponse IA
    ↓
StickerManager.getStickerForMood()
    ↓
Sticker + Texte
    ↓
sock.sendMessage() [WhatsApp]
```

---

## 🚀 Performance

### Complexité Temps
| Opération | PostgreSQL | JSON | Notes |
|-----------|-----------|------|-------|
| Sauvegarde | O(1) | O(n) | n = taille fichier |
| Lecture | O(1) | O(n) | Cache améliore |
| Recherche | O(log n) | O(n) | Index vs linéaire |

### Utilisation Mémoire
| Composant | Mémoire | Notes |
|-----------|---------|-------|
| Messages (1K) | ~1 MB | ~1KB par message |
| Conversations (100) | ~10 KB | Métadonnées |
| Utilisateurs (100) | ~20 KB | Info utilisateur |
| Settings | ~1 KB | Configuration |

---

## 🔐 Sécurité

### Données Sensibles
- 📁 `auth_info_baileys/` - Session WhatsApp (ignored)
- 🔑 `.env` - Clés API (ignored)
- 📊 `data/` - Messages privés (backup)

### Recommandations
- ✅ Sauvegarde régulière de `data/`
- ✅ Permissions de fichiers restrictives
- ✅ Pas de commit de `.env`
- ✅ Chiffrement pour données sensibles (optionnel)

---

## 📈 Scalabilité Future

### Limitations Actuelles
- ❌ Pas de multi-instance
- ❌ Performance < 1M messages
- ❌ Pas de requêtes complexes

### Améliorations Possibles
1. **Compression** - Gzip des fichiers JSON
2. **Archivage** - Archiver anciens messages
3. **Sharding** - Splitter données par mois
4. **Cache Redis** - Layer de cache optionnel
5. **Base Hybride** - JSON + SQLite pour perf

---

**Architecture Final:** ✅ Simple, Fiable, Maintainable

