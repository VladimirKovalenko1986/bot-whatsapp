const allChatsId = async (client) => {
  try {
    const chats = await client.getChats(); // Отримуємо всі чати
    console.log('Доступні чати:');
    chats.forEach((chat) => {
      console.log(
        `Назва: ${chat.name || chat.id.user}, ID: ${chat.id._serialized}`,
      );
    });
  } catch (error) {
    console.error('Помилка при отриманні чатів:', error);
  }
};

// Використовуємо отриманий ID групи
// const groupChatId = '120363371182644863@g.us'; Чат Warrior ID
// const groupChatId = '120363132078186204@g.us'; Чат Автомобільна служба ID

module.exports = allChatsId;
