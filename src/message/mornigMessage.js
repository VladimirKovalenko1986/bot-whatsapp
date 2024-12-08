const schedule = require('node-schedule');

const morningMessage = (client, groupChatId) => {
  schedule.scheduleJob('40 09 * * 1-5', () => {
    console.log('Надсилаємо повідомлення групі:', groupChatId);

    client
      .sendMessage(
        groupChatId,
        'Доброго ранку! Просимо вас подати заявки, щоб ми мали можливість сформувати наряд. Дякуємо за ваше розуміння та співпрацю! 😊',
      )
      .then(() => {
        console.log('Повідомлення надіслано morningMessage');
      })
      .catch((error) => {
        console.error('Помилка при надсиланні повідомлення:', error);
      });
  });
};

module.exports = morningMessage;
