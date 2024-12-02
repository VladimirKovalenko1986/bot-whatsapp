const schedule = require('node-schedule');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js'); // Використовуємо LocalAuth для збереження сесії

const startBot = () => {
  const client = new Client({
    authStrategy: new LocalAuth(), // Використовуємо LocalAuth для збереження сесії
  });

  client.on('qr', (qr) => {
    console.log('QR Code received:', qr);
    qrcode.generate(qr, { small: true }); // Генерація QR-коду для сканування, якщо сесія ще не збережена
  });

  client.on('ready', () => {
    console.log('Бот готовий!');

    // Використовуємо отриманий ID групи
    const groupChatId = '120363371182644863@g.us'; // Вставте отриманий ID вашої групи

    // Запланувати надсилання повідомлення
    schedule.scheduleJob('05 23 * * 1-5', () => {
      console.log('Надсилаємо повідомлення групі:', groupChatId);
      // Щодня о 22:25
      client
        .sendMessage(groupChatId, 'Танюшка агов, на добраніч.')
        .then(() => {
          console.log('Повідомлення надіслано');
        })
        .catch((error) => {
          console.error('Помилка при надсиланні повідомлення:', error);
        });
    });
  });

  client.on('auth_failure', (error) => {
    console.error('Помилка автентифікації:', error);
  });

  client.on('disconnected', (reason) => {
    console.log('Клієнт відключений:', reason);
  });

  client.initialize(); // Ініціалізація клієнта
};

module.exports = startBot;
