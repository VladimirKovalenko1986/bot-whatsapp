const { Client, LocalAuth } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const qrcode = require('qrcode-terminal');
const morningMessage = require('../message/mornigMessage.js');
const lunchMessage = require('../message/lunchMessage.js');
// const allChatsId = require('../utils/allIChatsId.js');

let currentQrCode = null;
let qrGenerated = false; // Прапорець для контролю QR-коду
let isInitialized = false; // Прапорець для контролю ініціалізації клієнта
const groupChatId = '120363132078186204@g.us';

const startBot = (app) => {
  const client = new Client({
    authStrategy: new LocalAuth(), // Використовуємо LocalAuth для збереження сесії
  });

  // Подія: QR-код
  client.on('qr', (qr) => {
    if (!qrGenerated) {
      console.log('QR Code received:', qr);
      qrcode.generate(qr, { small: true });
      currentQrCode = qr; // Зберігаємо QR-код
      qrGenerated = true; // QR-код згенеровано, більше не генеруємо
    }
  });

  // Подія: Готовність бота
  client.on('ready', () => {
    console.log('Bot is ready!');
    currentQrCode = null; // Очищаємо QR-код, бо він більше не потрібен
    qrGenerated = false; // Готові до повторної генерації при потребі
    // allChatsId(client);
    morningMessage(client, groupChatId);
    lunchMessage(client, groupChatId);
  });

  // Подія: Помилка авторизації
  client.on('auth_failure', (error) => {
    console.error('Authentication failed:', error);
    qrGenerated = false; // Дозволяємо повторну генерацію QR-коду
  });

  // Подія: Відключення клієнта
  client.on('disconnected', (reason) => {
    console.log('client disconnected:', reason);
    isInitialized = false; // Дозволяємо повторну ініціалізацію
  });

  // Ініціалізація клієнта
  if (!isInitialized) {
    client.initialize();
    isInitialized = true; // Помічаємо, що бот вже ініціалізовано
  }

  // Маршрут для доступу до QR-коду
  app.get('/qr', (req, res) => {
    if (currentQrCode) {
      QRCode.toDataURL(currentQrCode, (err, url) => {
        if (err) {
          res.send('Error while generating QR code');
        } else {
          res.send(`<img src="${url}" alt="QR-code from WhatsApp" />`);
        }
      });
    } else {
      res.status(404).send('QR code is not needed and the session is active');
    }
  });
};

module.exports = startBot;
