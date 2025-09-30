const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('Запуск бота...');

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: 'auth_data'
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('QR-код получен, отсканируйте его:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Клиент готов и подключен!');
});

client.on('message', message => {
    // Шаг 1: Логируем абсолютно все сообщения, которые видит бот
    console.log(`[${message.from}]: ${message.body}`);

    // Шаг 2: Проверяем условие
    if (message.body.trim().toLowerCase() === '!пинг') {
        console.log('Команда "!пинг" обнаружена, отправляю ответ...');
        message.reply('понг');
    }
});

client.initialize();

process.on('SIGINT', async () => {
  console.log('Получена команда на завершение. Закрываю сессию...');
  await client.destroy();
  console.log('Сессия закрыта.');
  process.exit(0);
});