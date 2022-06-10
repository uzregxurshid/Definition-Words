const { Scenes, Markup } = require("telegraf");
const { CHAT_ID, API_URL } = require("../config");
const { BaseScene } = Scenes;
const mainScene = new BaseScene("main");
const fs = require("fs");
const path = require("path");
const { default: axios } = require("axios");

mainScene.enter((ctx) => {
  ctx.reply('I help you to get definition of words.\n\n' +
    'Enter word to get definition.\n\n' +
    'You can also use /start to get back to this menu.\n\n' +
    'You can also use /help to get help.', Markup.keyboard([
      ['📖 Help', '📌 About']
    ]).oneTime().resize());

});


mainScene.hears(/^\/start$/i, (ctx) => {
  return ctx.scene.enter("main");
});


mainScene.hears(/^\/help$/i, (ctx) => {
  return ctx.reply('You can contact me by sending me a message.');
});


mainScene.on("message", (ctx) => {
  const user = ctx.message.from;
  ctx.telegram.getChatMember(CHAT_ID, user.id).then((res) => {
    console.log(res);
    if (res.status === "left") {
      ctx.replyWithPhoto({ source: fs.createReadStream(path.join(__dirname, "../assets/photo_2021-08-04_08-35-19.jpg")) },
        {
          caption: "For using this bot you need to subscribe to our channel.\n\n" +
            "After joining the channel, click on the button below to get access to th e bot.",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  url: 'https://t.me/div_blocks',
                  text: 'Join',
                  switch_inline_query_current_chat: 'Join',
                  switch_inline_query: 'Join'

                },
                {
                  text: '✅ Subscribed',
                  callback_data: 'subscribe'
                }
              ]
            ]

          },
        }
      );
    }
    else {
      const word = ctx.message.text;
      const url = `${API_URL}${word}`;

      var config = {
        method: 'get',
        url: url,
        headers: {}
      };

      axios(config)
        .then(function (response) {
          const data = response.data;
          data.forEach(e => {
            ctx.replyWithHTML(
              `Word: <b> ${e.word} </b>\n`+
              e.meanings.map(e => {
                return `Part of speech: <b> ${e.partOfSpeech}\n\n</b>` +
                  `Definitions: `
                  + e.definitions.map(e => {
                    return `<i> ${e.definition} </i>`
                  }
                  ).join(" ")+
                  `\nsynonyms: ` + e.synonyms.map(e => { return `<i> ${e} </i>` }).join(", ")+"\n"+
                  `antonyms: ` + e.antonyms.map(e => { return `<i> ${e} </i>` }).join(", ")+"\n"+
                  `examples:` + e.definitions.map(e => { return `<i> ${e.example} </i>` }).join(" ").split(" undefined ").join("")+"\n"
              }
              ).join("\n\n\n")
            );
          })

          data[0].phonetics.forEach(e => {
            if(e.audio.length > 0){
              ctx.replyWithAudio({url: e.audio}, {
                caption: e.audio.split("-")[e.audio.split("-").length - 1]
              });
            }
          });

              
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
  );

});
module.exports = mainScene;

