# 🚀 Quick Start Guide - Miyabi WhatsApp Bot

## Installation Rapide (5 minutes)

### 1️⃣ Prérequis
- **Node.js 18+** → [Télécharger](https://nodejs.org/)
- **Clé API Google Gemini** → [Obtenir](https://ai.google.dev)
- **WhatsApp** sur votre téléphone

### 2️⃣ Clone le Projet
```bash
git clone https://github.com/votre-username/miyabi-whatsapp-bot.git
cd miyabi-whatsapp-bot
```

### 3️⃣ Configuration
```bash
npm run setup
```

Le script te demandera :
- 🔑 **Clé API Gemini** - De [ai.google.dev](https://ai.google.dev)
- 🤖 **Nom du bot** - (Miyabi par défaut)
- 👤 **Numéro WhatsApp créateur** - Avec le préfixe international (+237...)

### 4️⃣ Démarrage
```bash
npm start
```

### 5️⃣ Scan le QR Code
Un QR code apparaîtra dans le terminal. Scanne-le avec WhatsApp :
1. Ouvre WhatsApp sur ton téléphone
2. Clique **⋮ Paramètres → Appareils connectés**
3. Clique **Connecter un appareil**
4. Scanne le QR code du terminal

✨ **Miyabi est prêt !**

---

## 📊 Base de Données

**Plus de PostgreSQL requis !** 🎉

Les données sont sauvegardées automatiquement dans :
```
data/
├── messages.json
├── conversations.json
├── mood_history.json
├── users.json
└── settings.json
```

[Documentation complète →](./DATABASE.md)

---

## 🎯 Utilisation

### Envoyer un Message
Envoie simplement un message à Miyabi dans WhatsApp.

### Réception d'une Réponse
1. Miyabi génère une réponse IA (Gemini)
2. Envoie un sticker correspondant à son humeur 😊😢😡
3. Envoie la réponse textuelle

### Humeurs Disponibles
- 😊 **Happy** - Joyeuse et enthousiaste
- 😢 **Sad** - Mélancolique
- 😡 **Angry** - Frustrée
- 🤩 **Excited** - Hyperactive
- 😴 **Tired** - Endormie
- 😐 **Neutral** - Neutre

---

## 📱 Fonctionnalités

✅ IA Gemini responsive
✅ Système d'humeurs dynamique
✅ Stickers émotionnels
✅ Support des groupes (@Miyabi)
✅ Contexte de conversation
✅ Historique sauvegardé

---

## 🆘 Troubleshooting

### "QR Code n'apparaît pas"
```bash
# Assure-toi que le terminal supporte les codes QR
# Sinon, utilise -i pour un mode interactif
npm start -- -i
```

### "Erreur d'authentification"
- Rescan le QR code
- Supprime le dossier `auth_info_baileys/`
- Redémarrage : `npm start`

### "Clé API invalide"
- Vérifie ta clé Gemini dans `.env`
- Teste à [ai.google.dev](https://ai.google.dev)

### "Pas de réponse du bot"
- Vérifie les logs : `tail -f logs/bot.log`
- Redémarrage : `npm start`

---

## 🐳 Docker (Optionnel)

```bash
# Build
npm run docker:build

# Démarrage
npm run docker:up

# Arrêt
npm run docker:down
```

---

## 📚 Documentations

- [README Complet](./README.md)
- [Documentation DB](./DATABASE.md)
- [Changelog](./CHANGELOG.md)
- [Configuration](./env.example)

---

## 💬 Support

Des questions ? Créé une [issue sur GitHub](https://github.com/votre-username/miyabi-whatsapp-bot/issues)

---

**Bonne chance !** 🎀
