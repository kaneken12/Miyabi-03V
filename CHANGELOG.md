# 📝 Changelog - Miyabi WhatsApp Bot

## [2.0.0] - 2025-12-23

### 🔄 Changements Majeurs
- **Migration PostgreSQL → JSON** : Remplacement de la base de données PostgreSQL par un système de fichiers JSON
- Suppression de la dépendance `pg` (PostgreSQL)
- Simplification de la configuration - plus de serveur PostgreSQL requis

### ✨ Nouveautés
- 📁 Base de données JSON avec 5 fichiers (messages, conversations, mood_history, users, settings)
- 🚀 Déploiement plus rapide - pas de configuration serveur nécessaire
- 💾 Sauvegarde facilitée avec Git/contrôle de version

### 🔧 Modifications Techniques

#### Fichiers Modifiés
- `src/database/db.js` - Réwritten avec système JSON au lieu de queries PostgreSQL
- `package.json` - Suppression de `pg` des dépendances
- `src/config/index.js` - Adaptation pour charger les settings depuis JSON
- `.env.example` - Suppression des variables PostgreSQL
- `scripts/setup.js` - Simplification du processus d'installation
- `docker-compose.yml` - Suppression du service PostgreSQL
- `README.md` - Mise à jour de la documentation
- `.gitignore` - Ajout des dossiers `data/` et `logs/`

#### Nouveaux Fichiers
- `DATABASE.md` - Documentation complète de la base de données JSON

### 🗂️ Structure de Répertoire

```
data/
├── messages.json          # 💬 Historique des messages
├── conversations.json     # 🗨️ Données des conversations
├── mood_history.json      # 😊 Historique des humeurs
├── users.json            # 👥 Informations utilisateurs
└── settings.json         # ⚙️ Paramètres du bot
```

### 🎯 Avantages

✅ **Simplification** - Une seule dépendance supprimée
✅ **Portabilité** - Fonctionne n'importe où sans setup externe
✅ **Légerté** - Moins de ressources système requises
✅ **Transparence** - Données lisibles et éditables
✅ **Git-Friendly** - Sauvegarde intégrée au contrôle de version

### ⚠️ Limitations Connues

- Performance réduite pour très grandes bases (millions+ de messages)
- Pas de concurrence multi-processus (une seule instance à la fois)
- Pas de requêtes complexes comme avec SQL

### 🔄 Migration Recommandée

Si vous aviez une base PostgreSQL :
1. Exporter les données en JSON
2. Placer dans `data/`
3. Relancer le bot

### 📦 Dépendances

**Supprimées:**
- `pg` (^8.11.3)

**Inchangées:**
- `@whiskeysockets/baileys` - Connexion WhatsApp
- `@google/generative-ai` - IA Gemini
- `dotenv` - Configuration
- `qrcode-terminal` - QR Code WhatsApp
- `axios` - Requêtes HTTP
- `express` - Serveur Web (futur)
- `pino` - Logging

### 🧪 Tests Recommandés

```bash
# Installation
npm install

# Vérifier les fichiers de données
ls -la data/

# Démarrage
npm start
```

### 📚 Liens Utiles

- [Documentation Base de Données](./DATABASE.md)
- [README Principal](./README.md)
- [Configuration Exemple](./.env.example)

---

### Pour les Versions Antérieures

Voir les tags git pour l'historique complet.

**Version actuelle**: 2.0.0
**Date**: 23 Décembre 2025
