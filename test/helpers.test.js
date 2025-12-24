const { normalizePhone, shouldRespond } = require('../src/utils/helper');

let failures = 0;
function ok(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg);
    failures++;
  } else {
    console.log('ok:', msg);
  }
}

console.log('Running helper tests...');

// normalizePhone tests
ok(normalizePhone('+237692798136') === '237692798136', 'normalizePhone removes + and keeps digits');
ok(normalizePhone('237692798136@s.whatsapp.net') === '237692798136', 'normalizePhone extracts digits from JID');
ok(normalizePhone('069-279-8136') === '0692798136', 'normalizePhone removes non-digits');
ok(normalizePhone(null) === null, 'normalizePhone returns null for null');

// shouldRespond tests
const botName = 'Miyabi';

// private message -> should respond
const privateMsg = { key: { remoteJid: '123456789@s.whatsapp.net' }, message: { conversation: 'Hello' } };
ok(shouldRespond('Hello', botName, privateMsg) === true, 'shouldRespond -> private message returns true');

// group mention via mentionedJid
const groupMentionMsg = {
  key: { remoteJid: '99999-111@g.us' },
  message: { extendedTextMessage: { text: 'Hi @Miyabi', contextInfo: { mentionedJid: ['bot@server'] } } }
};
const sock = { user: { id: 'bot@server' } };
ok(shouldRespond('Hi @Miyabi', botName, groupMentionMsg, sock) === true, 'shouldRespond -> group mentioned by JID returns true');

// textual mention
const groupTextMention = { key: { remoteJid: '99999-111@g.us' }, message: { conversation: 'hey miyabi are you there' } };
ok(shouldRespond('hey miyabi are you there', botName, groupTextMention) === true, 'shouldRespond -> textual mention returns true');

// group without mention
const groupNoMention = { key: { remoteJid: '99999-111@g.us' }, message: { conversation: 'hello everyone' } };
ok(shouldRespond('hello everyone', botName, groupNoMention) === false, 'shouldRespond -> group without mention returns false');

if (failures > 0) {
  console.error(`\n${failures} test(s) failed.`);
  process.exit(1);
} else {
  console.log('\nAll tests passed.');
  process.exit(0);
}
