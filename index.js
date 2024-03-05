const TelegramBot = require('node-telegram-bot-api'); // подключаем node-telegram-bot-api

const token = '6872106670:AAG3iWQf7OYx9P7YPAXiee9wCAuu6PBKyko'; // тут токен кторый мы получили от botFather

// включаем самого бота
const bot = new TelegramBot(token, {polling: true});

// количество контента
const memesAmount = 172;
const jokesAmount = 59;
const videoUrls = [
    'https://www.youtube.com/watch?v=qZwruifv9RU',
    'https://www.youtube.com/watch?v=WvNeXbE_Ltg',
    'https://www.youtube.com/watch?v=Tbeud0H_gGw',
    'https://www.youtube.com/watch?v=9YgVHnbGphA',
    'https://www.youtube.com/watch?v=lTkf_3z_JEs',
    'https://www.youtube.com/watch?v=IQh2xWf1gGw'
];
let urlsAmount = videoUrls.length; 

function randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

// клавиатура главное меню
const main_menu = [
    [
        {
          text: 'Enter the bank of memes', // текст на кнопке
          callback_data: 'meme' // данные для обработчика событий
        }
      ],
      [
       {
          text: 'Smth else?',
          callback_data: 'else'
       }   
      ]
];

//клавиатура дополнительного меню
const else_keyboard = [
    [
      {
        text: 'Joke', // текст на кнопке
        callback_data: 'joke' // данные для обработчика событий
      }
    ],
    [
        {
          text: 'Funny video', // текст на кнопке
         // url: videoUrls[randomInteger(0, urlsAmount - 1)] //внешняя ссылка
         callback_data: 'video' // данные для обработчика событий
        }
    ],
    [
     {
        text: 'Exit',
        callback_data: 'exit'
     }   
    ]
];

//клавиатура раздела Мемы
const meme_keyboard = [
    [
      {
        text: 'One more meme, please', // текст на кнопке
        callback_data: 'meme' // данные для обработчика событий
      }
    ],
    [
     {
        text: 'Exit',
        callback_data: 'exit'
     }   
    ]
  ];

// обработчик событий по любому входящему сообщению
bot.on('message', (msg) => {
  const chatId = msg.chat.id; //получаем идентификатор диалога, чтобы отвечать именно тому пользователю, который нам что-то прислал
  // отправляем стартовое сообщение
  bot.sendMessage(chatId, 'Welcome, dude. Push the button', { 
     // и вызываем главное меню
    reply_markup: {
            inline_keyboard: main_menu // п.с. это мы прикрутили клаву главного меню
        }
    });
});

// если вдруг ошибка, то мы увидим ее в консоли
bot.on("polling_error", (msg) => console.log(msg));

// обработчик событий нажатия на клавиатуру
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    //флаг выбора клавиатуры главного или дополнительного меню
    let flagKeyboard = 1; // 1 - meme_keyboard, 0 - else_keyboard

    let img = '';
    // если у нас запрос на картинку
    if (query.data === 'meme') { // если мемы
        flagKeyboard = 1;
        img = 'memes/m (' + randomInteger(1, memesAmount) + ').jpg';
    }

    if (query.data === 'joke') { // если анекдоты
        flagKeyboard = 0;
        img = 'anek/j (' + randomInteger(1, jokesAmount) + ').jpg';
    }
    // то выгружаем картинку 
    if (img) {
        bot.sendPhoto(chatId, img, { // и добавим клаву
            reply_markup: {
                inline_keyboard: flagKeyboard? meme_keyboard : else_keyboard
            }
        });
    } 
    // если запрос на видео, то дадим ссылку
    else if (query.data === 'video') { 
        bot.sendMessage(chatId, videoUrls[randomInteger(0, urlsAmount - 1)], { // и добавим клаву
        reply_markup: {
            inline_keyboard: else_keyboard
        }
    });
    }
    // если запрос на дополнительное меню
    else if (query.data === 'else') { 
        bot.sendMessage(chatId, 'What do you want?', { // то выкатываем его
        reply_markup: {
            inline_keyboard: else_keyboard
        }
    });
    }
    // если надо выйти, то переходим в главное меню
    else if (query.data === 'exit') { 
        bot.sendMessage(chatId, 'Welcome, dude. Push the button', { // клавиатура главного меню
        reply_markup: {
            inline_keyboard: main_menu
        }
    });
    }
    // иначе ошибка и принудительный переход в главное меню
    else {
        bot.sendMessage(chatId, 'Smth wrong, try again', { // клавиатура главного меню
            reply_markup: {
                inline_keyboard: main_menu
            }
        });
    }
  });