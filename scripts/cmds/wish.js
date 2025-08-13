const { GoatWrapper } = require("fca-liane-utils");

module.exports = {
    config: {
      name: "wish",
      version: "1.0.0",
      role: 0,
      author: "Tasbiul Islam Rasin",
      description: "Send a birthday wish to someone",
      category: "Fun",
      countDown: 5,
      guide: {
        en: "{p}{n} @tagname",
      },
    },
  
    onStart: async function ({ api, event, args }) {
      const mention = Object.keys(event.mentions);
  
      if (mention.length === 0) {
        return api.sendMessage("You need to tag someone to wish!", event.threadID, event.messageID);
      }
  
      const taggedUser = event.mentions[mention[0]];
      api.sendMessage(
        `Dear [ ${taggedUser} ],

I hope this special day brings you all the joy and happiness in the world! 🎉🎂

On your birthday, I want to take a moment to remind you how much you mean to me. You've been such a wonderful friend, and I feel incredibly lucky to know you. Whether it’s your kind heart, your infectious laughter, or your unwavering support, you truly make the world a better place just by being yourself.

As you celebrate today, may you be surrounded by love, laughter, and all the things that bring you the greatest joy. Here's to many more years of happiness, growth, and success. May your dreams continue to flourish and may this year be your best one yet!

Wishing you a birthday filled with laughter, love, and unforgettable moments.

With all my love and warmest wishes,

Muhammad Riyad  💖`,
        event.threadID,
        event.messageID
      );
    },
  };

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
