function extractMessageText(message) {
    if (!message.message) return null;

    const messageTypes = [
        'conversation',
        'extendedTextMessage',
        'imageMessage',
        'videoMessage',
        'documentMessage'
    ];

    for (const type of messageTypes) {
        if (message.message[type]) {
            return message.message[type].text || 
                   message.message[type].caption || 
                   message.message[type].conversation;
        }
    }

    return null;
}

function isGroupMessage(message) {
    return message.key.remoteJid.endsWith('@g.us');
}

function shouldRespond(messageText, botName, message, sock = null) {
    if (!messageText) return false;

    const lowerMessage = messageText.toLowerCase();
    const botNameLower = botName.toLowerCase();
    const isGroup = isGroupMessage(message);

    // Essayer d'obtenir le JID du bot depuis sock ou depuis le message (fallback)
    let botJid = null;
    try {
        if (sock && sock.user) {
            botJid = sock.user.id || sock.user.jid || sock.user;
        }
    } catch (e) {
        botJid = null;
    }

    // Répondre si mentionné via mentionedJid (JID exact)
    if (isGroup && message.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
        const mentioned = message.message.extendedTextMessage.contextInfo.mentionedJid;
        if (botJid && mentioned.includes(botJid)) return true;
    }

    // Répondre si taggé avec @nom dans le texte
    if (isGroup && lowerMessage.includes(`@${botNameLower}`)) {
        return true;
    }

    // Répondre si son nom est mentionné
    if (lowerMessage.includes(botNameLower)) {
        return true;
    }

    // Répondre toujours en message privé
    if (!isGroup) {
        return true;
    }

    return false;
}

function getSenderName(message) {
    if (message.pushName) {
        return message.pushName;
    }
    
    const sender = message.key.participant || message.key.remoteJid;
    return sender.split('@')[0];
}

function normalizePhone(input) {
    if (!input) return null;
    const raw = (typeof input === 'string' && input.includes('@')) ? input.split('@')[0] : input;
    const digits = String(raw).replace(/\D/g, '');
    return digits || null;
}

module.exports = {
    extractMessageText,
    isGroupMessage,
    shouldRespond,
    getSenderName,
    normalizePhone
};
