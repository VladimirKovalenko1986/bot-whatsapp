const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js'); // Використовуємо LocalAuth для збереження сесії
const QRCode = require('qrcode');
const morningMessage = require('../message/mornigMessage.js');
const lunchMessage = require('../message/lunchMessage.js');

let currentQrCode = null;

const startBot = (app) => {
  const client = new Client({
    authStrategy: new LocalAuth(), // Використовуємо LocalAuth для збереження сесії
  });

  client.on('qr', (qr) => {
    console.log('QR Code received:', qr);
    qrcode.generate(qr, { small: true }); // Генерація QR-коду для сканування, якщо сесія ще не збережена

    currentQrCode = qr; // Зберігаємо отриманий QR-код
  });

  client.on('ready', async () => {
    console.log('Bot is ready!');

    // Побачити всі чати і їх імя
    // try {
    //   const chats = await client.getChats(); // Отримуємо всі чати
    //   console.log('Доступні чати:');
    //   chats.forEach((chat) => {
    //     console.log(
    //       `Назва: ${chat.name || chat.id.user}, ID: ${chat.id._serialized}`,
    //     );
    //   });
    // } catch (error) {
    //   console.error('Помилка при отриманні чатів:', error);
    // }

    // Використовуємо отриманий ID групи
    // const groupChatId = '120363371182644863@g.us'; Чат Warrior ID

    const groupChatId = '120363132078186204@g.us';

    morningMessage(client, groupChatId);
    lunchMessage(client, groupChatId);
  });

  client.on('auth_failure', (error) => {
    console.error('Error on authentication', error);
  });

  client.on('disconnected', (reason) => {
    console.log('Client is disconnected::', reason);
  });

  client.initialize(); // Ініціалізація клієнта

  // Створюємо маршрут для доступу до QR-коду
  app.get('/qr', (req, res) => {
    if (currentQrCode) {
      QRCode.toDataURL(currentQrCode, (err, url) => {
        if (err) {
          res.send('Error generation QR-code');
        } else {
          res.send(`<img src="${url}" alt="QR-код для WhatsApp" />`);
        }
      });
    } else {
      res.status(404).send('QR code is not received');
    }
  });
};

module.exports = startBot;
