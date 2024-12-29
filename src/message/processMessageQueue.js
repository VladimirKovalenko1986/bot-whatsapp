const processMessageQueue = async (messageQueue, client, isConnected) => {
  console.log(
    `Processing message queue. Messages in queue: ${messageQueue.length}`,
  );

  while (messageQueue.length > 0) {
    if (!client || !isConnected || !client.info) {
      console.log('Client not ready. Queue processing is paused.');
      messageQueue.unshift({ groupChatId, message }); // Повертаємо повідомлення до черги
      return;
    }

    const { groupChatId, message } = messageQueue.shift(); // Беремо перше повідомлення з черги
    try {
      console.log(
        `Attempting to send message to group ${groupChatId}: ${message}`,
      );
      await client.sendMessage(groupChatId, message); // Надсилаємо повідомлення
      console.log(
        `Message sent successfully to group ${groupChatId}: ${message}`,
      );
    } catch (error) {
      console.error('Error while sending a queued message:', error);
      messageQueue.unshift({ groupChatId, message }); // Повертаємо повідомлення до черги
      console.log('Retrying message in 5 seconds...');
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Затримка перед повторною спробою
      break; // Завершуємо цикл, щоб уникнути створення багаторазових спроб одночасно
    }
  }

  console.log('Message queue processing completed.');
};

module.exports = processMessageQueue;
