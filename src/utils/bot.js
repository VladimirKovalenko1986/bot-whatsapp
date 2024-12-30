const { Client, LocalAuth } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const qrcode = require('qrcode-terminal');
const scheduleMessages = require('../message/scheduleMessages.js');
const loadMessageConfig = require('../message/loadMessageConfig.js');
const processMessageQueue = require('../message/processMessageQueue');
const express = require('express');
const restartBot = require('./restartBot.js');
// const messageConfig = require('../message/messageConfig.js');
// const allChatsId = require('../utils/allIChatsId.js');

const app = express();
let currentQrCode = null;
let qrGenerated = false; // Прапорець для контролю QR-коду
let isInitialized = false; // Прапорець для контролю ініціалізації клієнта
let isConnected = true; // Початковий стан з'єднання
const messageQueue = []; // Черга повідомлень

const startBot = () => {
  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true, // Використовується "headless" режим (фоновий)
  },
  });

  // Обробка черги кожні 30 секунд
  setInterval(
    () => processMessageQueue(messageQueue, client, isConnected),
    30000,
  );

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
    isConnected = true; // Бот готовий, з'єднання встановлено
    processMessageQueue(messageQueue, client, isConnected);
    const messageConfig = loadMessageConfig();
    scheduleMessages(client, messageConfig, isConnected, messageQueue);
  });

  // Подія: Помилка авторизації
  client.on('auth_failure', (error) => {
    console.error('Authentication failed:', error);
    qrGenerated = false; // Дозволяємо повторну генерацію QR-коду
    restartBot(app);
  });

  // Подія: Відключення клієнта
  client.on('disconnected', (reason) => {
    console.log('Client disconnected:', reason);
    isConnected = false; // З'єднання втрачено
    isInitialized = false; // Дозволяємо повторну ініціалізацію
    setTimeout(() => {
      console.log('Reinitializing client...');
      restartBot(app);
    }, 5000); // Затримка перед перезапуском
  });

  client.on('error', (error) => {
    console.error('Client encountered an error:', error);
    if (error.message.includes('Session closed')) {
      restartBot(app); // Перезапуск
    }
  });

  // Обробка сигналу завершення роботи
  process.on('SIGINT', async () => {
    console.log('Gracefully shutting down...');
    if (client) {
      try {
        await client.destroy();
        console.log('Client destroyed successfully');
      } catch (error) {
        console.error('Error during client destruction:', error);
      }
    }
    process.exit(0);
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
