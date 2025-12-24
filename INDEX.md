# 📖 Index de Documentation - Miyabi v2.0

Bienvenue! Cette page centralise toute la documentation du projet.

---

## 🚀 Démarrage Rapide (5 minutes)

**Nouveau? Commence ici:**

1. **[RESUME_CORRECTIONS.md](./RESUME_CORRECTIONS.md)** - Résumé français de ce qui a été fait
2. **[QUICKSTART.md](./QUICKSTART.md)** - Installation en 5 minutes
3. **[.env.example](./.env.example)** - Template configuration

**Commandes essentielles:**
```bash
npm run setup    # Configuration
npm start        # Démarrer le bot
npm test         # Tester la DB (voir test-db.js)
```

---

## 📚 Documentation Complète

### 🎯 Vue Globale
| Document | Contenu | Public |
|----------|---------|--------|
| [RESUME_CORRECTIONS.md](./RESUME_CORRECTIONS.md) | Résumé en français 🇫🇷 | Tout le monde |
| [MODIFICATIONS_SUMMARY.md](./MODIFICATIONS_SUMMARY.md) | Résumé technique | Développeurs |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Architecture détaillée | Développeurs |
| [FILES_MANIFEST.md](./FILES_MANIFEST.md) | Liste des fichiers | Tout le monde |

### 💾 Base de Données (IMPORTANT)
| Document | Contenu | Pour Qui |
|----------|---------|----------|
| **[DATABASE.md](./DATABASE.md)** ⭐ | Structure + API JSON | Développeurs |
| **[MIGRATION.md](./MIGRATION.md)** | Migrer depuis PostgreSQL | PostgreSQL users |
| **[test-db.js](./test-db.js)** | Tests automatisés | DevOps |

### 🔧 Configuration & Installation
| Document | Contenu |
|----------|---------|
| [QUICKSTART.md](./QUICKSTART.md) | Installation rapide |
| [.env.example](./.env.example) | Variables d'env |
| [scripts/setup.js](./scripts/setup.js) | Script setup |

### 📝 Historique & Changements
| Document | Contenu |
|----------|---------|
| [CHANGELOG.md](./CHANGELOG.md) | Historique complet |
| [README.md](./README.md) | Documentation principale |

### 🧪 Tests & Validation
| Document | Contenu |
|----------|---------|
| [test-db.js](./test-db.js) | Script test BD (10 tests) |
| [QUICKSTART.md#Troubleshooting](./QUICKSTART.md) | Dépannage |

---

## 👤 Guide par Profil

### 👨‍💼 Propriétaire du Bot
**Chemin recommandé:**
1. [RESUME_CORRECTIONS.md](./RESUME_CORRECTIONS.md) - Comprendre les changements
2. [QUICKSTART.md](./QUICKSTART.md) - Installer et configurer
3. [DATABASE.md](./DATABASE.md) - Comprendre où sont les données

### 👨‍💻 Développeur Node.js
**Chemin recommandé:**
1. [ARCHITECTURE.md](./ARCHITECTURE.md) - Vue globale
2. [DATABASE.md](./DATABASE.md) - Structure et API
3. [src/database/db.js](./src/database/db.js) - Code source
4. [MODIFICATIONS_SUMMARY.md](./MODIFICATIONS_SUMMARY.md) - Changements détaillés

### 🔄 Migration PostgreSQL
**Chemin recommandé:**
1. [MIGRATION.md](./MIGRATION.md) - Guide complet
2. [DATABASE.md](./DATABASE.md) - Format destination
3. [test-db.js](./test-db.js) - Validation après migration

### 🐳 DevOps/Docker
**Chemin recommandé:**
1. [docker-compose.yml](./docker-compose.yml) - Configuration Docker
2. [.env.example](./.env.example) - Variables
3. [QUICKSTART.md#Docker](./QUICKSTART.md) - Docker optionnel
4. [test-db.js](./test-db.js) - Tests

### 🔧 Support Technique
**Chemin recommandé:**
1. [QUICKSTART.md#Troubleshooting](./QUICKSTART.md) - Problèmes courants
2. [MIGRATION.md#Dépannage](./MIGRATION.md) - Dépannage spécifique DB
3. [DATABASE.md](./DATABASE.md) - Structure données (debug)

---

## 📋 Arborescence Documentation

```
docs/
├── 🎀 RESUME_CORRECTIONS.md         (Résumé en français)
├── 🚀 QUICKSTART.md                 (Installation 5 min)
├── 📚 DATABASE.md                   (Base de données JSON)
├── 📦 MIGRATION.md                  (Migration PostgreSQL)
├── 🔄 CHANGELOG.md                  (Historique)
├── 🏗️ ARCHITECTURE.md                (Architecture détaillée)
├── 📋 MODIFICATIONS_SUMMARY.md       (Résumé technique)
├── 📑 FILES_MANIFEST.md             (Liste fichiers)
├── 📖 INDEX.md                      (Ce fichier)
└── 📝 README.md                     (Docs principales)
```

---

## 🔑 Concepts Clés

### Système d'Humeurs
Miyabi a 6 humeurs différentes qui changent dynamiquement :
- 😊 **Happy** - Joyeuse
- 😢 **Sad** - Triste
- 😡 **Angry** - Fâchée
- 🤩 **Excited** - Excitée
- 😴 **Tired** - Fatiguée
- 😐 **Neutral** - Neutre

Voir [src/bot/moodSystem.js](./src/bot/moodSystem.js)

### Base de Données JSON
Les données sont sauvegardées dans des fichiers JSON:
- `data/messages.json` - Tous les messages
- `data/conversations.json` - Métadonnées conversations
- `data/mood_history.json` - Historique humeurs
- `data/users.json` - Info utilisateurs
- `data/settings.json` - Paramètres bot

Voir [DATABASE.md](./DATABASE.md)

### Architecture Bot
```
WhatsApp → Baileys → Bot → Gemini (IA) → Réponse
                      ↓
                    Database (JSON)
```

Voir [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## ⚡ Actions Rapides

### Installation Complète
```bash
git clone <repo>
npm run setup      # Configuration interactive
npm start          # Démarrer le bot
```

### Tests
```bash
node test-db.js    # Tester la base de données
```

### Migration PostgreSQL
Voir [MIGRATION.md](./MIGRATION.md)

### Docker
```bash
npm run docker:build
npm run docker:up
npm run docker:down
```

---

## 📞 Support & Ressources

### Erreurs Communes
- [QUICKSTART.md - Troubleshooting](./QUICKSTART.md#-troubleshooting)
- [MIGRATION.md - Dépannage](./MIGRATION.md#dépannage)

### Questions Fréquentes
1. **Où sont mes données?** → `data/` (voir [DATABASE.md](./DATABASE.md))
2. **Comment migrer de PostgreSQL?** → [MIGRATION.md](./MIGRATION.md)
3. **Comment faire les tests?** → `node test-db.js`
4. **Comment déployer?** → [QUICKSTART.md](./QUICKSTART.md)

### Liens Externes
- 🤖 [Google Gemini API](https://ai.google.dev)
- 📱 [Baileys WhatsApp](https://github.com/whiskeysockets/Baileys)
- 🐳 [Docker](https://www.docker.com/)
- 📦 [Node.js](https://nodejs.org/)

---

## 📊 Vue d'Ensemble v2.0

### ✅ Changements Majeurs
- ✅ PostgreSQL → JSON File System
- ✅ Suppression dépendance `pg`
- ✅ Configuration simplifiée
- ✅ Documentation exhaustive
- ✅ Tests automatisés
- ✅ Scripts de migration

### 📈 Avantages
- Zéro configuration serveur
- Installation instantanée
- Portable partout
- Sauvegarde Git
- Maintenance zéro

### ⚠️ Limitations
- Performance < 1M messages
- Pas de multi-instance
- Pas de requêtes complexes

Voir [MODIFICATIONS_SUMMARY.md](./MODIFICATIONS_SUMMARY.md)

---

## 🎯 Prochaines Étapes

1. **Lire** → [RESUME_CORRECTIONS.md](./RESUME_CORRECTIONS.md)
2. **Installer** → [QUICKSTART.md](./QUICKSTART.md)
3. **Configurer** → `.env` via `npm run setup`
4. **Démarrer** → `npm start`
5. **Tester** → `node test-db.js`

---

## 📅 Versions

| Version | Date | Notes |
|---------|------|-------|
| **2.0.0** | 23 Déc 2025 | PostgreSQL → JSON |
| 1.0.0 | - | Version initiale PostgreSQL |

---

## 📄 Conventions

- 📚 **DATABASE.md** - Architecture/Structure
- 🚀 **QUICKSTART.md** - Installation rapide
- 📦 **MIGRATION.md** - Migration données
- 🔄 **CHANGELOG.md** - Historique
- 🏗️ **ARCHITECTURE.md** - Design détaillé
- 📋 **MODIFICATIONS_SUMMARY.md** - Changements techniques

---

**Dernière mise à jour:** 23 Décembre 2025
**Version Documentation:** 2.0.0
**Statut:** ✅ Complète

---

**Besoin d'aide?** Commence par le [QUICKSTART.md](./QUICKSTART.md) ou consulte le [TROUBLESHOOTING](./QUICKSTART.md#-troubleshooting).

