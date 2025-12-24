# 📦 Guide de Migration - PostgreSQL vers JSON

Si tu avais précédemment une base de données PostgreSQL pour Miyabi, voici comment migrer tes données.

## Étape 1: Exporter les Données PostgreSQL

### Option A: Avec pgAdmin (Interface Graphique)
1. Ouvre pgAdmin
2. Connecte-toi à ta base `miyabi_bot`
3. Clique sur chaque table → **Export** → **JSON Format**
4. Sauvegarde les fichiers

### Option B: Avec PostgreSQL CLI (Terminal)

```bash
# Exporter messages
psql -U miyabi_user -d miyabi_bot -c "SELECT row_to_json(t) FROM messages t;" > messages.json

# Exporter conversations
psql -U miyabi_user -d miyabi_bot -c "SELECT row_to_json(t) FROM conversations t;" > conversations.json

# Exporter mood_history
psql -U miyabi_user -d miyabi_bot -c "SELECT row_to_json(t) FROM mood_history t;" > mood_history.json

# Exporter users
psql -U miyabi_user -d miyabi_bot -c "SELECT row_to_json(t) FROM users t;" > users.json

# Exporter bot_settings
psql -U miyabi_user -d miyabi_bot -c "SELECT row_to_json(t) FROM bot_settings t;" > settings_export.json
```

### Option C: Script d'Export Complet

Crée un fichier `export-db.js`:

```javascript
const { Pool } = require('pg');
const fs = require('fs');

async function exportDatabase() {
    const pool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'miyabi_bot',
        user: 'miyabi_user',
        password: 'votre_mot_de_passe'
    });

    try {
        const tables = ['messages', 'conversations', 'mood_history', 'users', 'bot_settings'];
        
        for (const table of tables) {
            const result = await pool.query(`SELECT * FROM ${table}`);
            const filename = table === 'bot_settings' ? 'settings.json' : `${table}.json`;
            
            fs.writeFileSync(
                `data/${filename}`,
                JSON.stringify(result.rows, null, 2),
                'utf-8'
            );
            
            console.log(`✅ ${filename} exporté (${result.rows.length} lignes)`);
        }

        // Transformer bot_settings en format approprié
        const settingsResult = await pool.query('SELECT * FROM bot_settings');
        const settingsObj = {};
        
        for (const setting of settingsResult.rows) {
            settingsObj[setting.setting_key] = {
                value: setting.setting_value,
                type: setting.setting_type,
                description: setting.description
            };
        }
        
        fs.writeFileSync(
            'data/settings.json',
            JSON.stringify(settingsObj, null, 2),
            'utf-8'
        );

        console.log('✅ Export complet terminé!');

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await pool.end();
    }
}

exportDatabase();
```

Exécute:
```bash
npm install pg
node export-db.js
```

## Étape 2: Adapter le Format des Données

Les fichiers JSON doivent avoir ce format:

### messages.json ✅
```json
[
  {
    "id": 1,
    "message_id": "...",
    "chat_id": "...",
    "sender": "...",
    "message": "...",
    "is_group": false,
    "is_bot": false,
    "timestamp": "2025-12-23T10:30:00.000Z",
    "created_at": "2025-12-23T10:30:00.000Z"
  }
]
```

### conversations.json ✅
```json
[
  {
    "id": 1,
    "chat_id": "...",
    "last_activity": "2025-12-23T10:30:00.000Z",
    "message_count": 42,
    "created_at": "2025-12-23T10:30:00.000Z"
  }
]
```

### mood_history.json ✅
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

### users.json ✅
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

### settings.json ✅
```json
{
  "bot_name": {
    "value": "Miyabi",
    "type": "string",
    "description": "Nom du bot"
  }
}
```

## Étape 3: Placer les Fichiers

1. Crée le dossier `data/` à la racine du projet:
```bash
mkdir data
```

2. Place les fichiers JSON dans `data/`:
```bash
mv messages.json data/
mv conversations.json data/
mv mood_history.json data/
mv users.json data/
mv settings.json data/
```

## Étape 4: Vérifier l'Installation

```bash
# Vérifie que les fichiers existent
ls -la data/

# Teste la base de données
node test-db.js
```

Si tout fonctionne, tu devrais voir:
```
✅ messages.json
✅ conversations.json
✅ mood_history.json
✅ users.json
✅ settings.json
```

## Étape 5: Supprimer PostgreSQL (Optionnel)

Si tu n'as plus besoin de PostgreSQL:

```bash
# Sur Windows
net stop postgresql-15

# Sur macOS avec Homebrew
brew services stop postgresql

# Sur Linux
sudo systemctl stop postgresql
```

Ou simplement le désactiver dans Docker Compose.

## Script de Migration Complète

Voici un script Python pour migrer complètement:

```python
#!/usr/bin/env python3
import psycopg2
import json
import os
from datetime import datetime

def migrate():
    conn = psycopg2.connect(
        host="localhost",
        database="miyabi_bot",
        user="miyabi_user",
        password="votre_mot_de_passe"
    )
    
    cursor = conn.cursor()
    os.makedirs("data", exist_ok=True)
    
    # Export messages
    cursor.execute("SELECT * FROM messages")
    messages = [dict(row) for row in cursor.fetchall()]
    with open("data/messages.json", "w") as f:
        json.dump(messages, f, indent=2, default=str)
    
    # Export conversations
    cursor.execute("SELECT * FROM conversations")
    conversations = [dict(row) for row in cursor.fetchall()]
    with open("data/conversations.json", "w") as f:
        json.dump(conversations, f, indent=2, default=str)
    
    # Export mood_history
    cursor.execute("SELECT * FROM mood_history")
    mood_history = [dict(row) for row in cursor.fetchall()]
    with open("data/mood_history.json", "w") as f:
        json.dump(mood_history, f, indent=2, default=str)
    
    # Export users
    cursor.execute("SELECT * FROM users")
    users = [dict(row) for row in cursor.fetchall()]
    with open("data/users.json", "w") as f:
        json.dump(users, f, indent=2, default=str)
    
    # Export settings
    cursor.execute("SELECT * FROM bot_settings")
    settings_rows = cursor.fetchall()
    settings = {}
    for row in settings_rows:
        settings[row[1]] = {
            "value": row[2],
            "type": row[3],
            "description": row[4]
        }
    with open("data/settings.json", "w") as f:
        json.dump(settings, f, indent=2)
    
    print("✅ Migration complète!")
    cursor.close()
    conn.close()

if __name__ == "__main__":
    migrate()
```

## Dépannage

### "Erreur: Colonne introuvable"
Vérifie que les noms de colonnes correspondent exactement.

### "Les données ne s'affichent pas"
Redémarre le bot:
```bash
npm start
```

### "Dates au format incorrect"
Utilise ce script pour reformater:
```javascript
const data = require('./data/messages.json');
const corrected = data.map(m => ({
    ...m,
    timestamp: new Date(m.timestamp).toISOString(),
    created_at: new Date(m.created_at).toISOString()
}));
fs.writeFileSync('./data/messages.json', JSON.stringify(corrected, null, 2));
```

---

**Besoin d'aide?** Crée une [issue GitHub](https://github.com/votre-username/miyabi-whatsapp-bot/issues)
