const axios = require("axios");
const pages = 10;
const apiUrl = "https://command-store.onrender.com/api/items";

function fancyFont(text) {
  const map = {
    a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ғ", g: "ɢ", h: "ʜ",
    i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ",
    q: "ǫ", r: "ʀ", s: "ꜱ", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x",
    y: "ʏ", z: "ᴢ",
    A: "ᴀ", B: "ʙ", C: "ᴄ", D: "ᴅ", E: "ᴇ", F: "ғ", G: "ɢ", H: "ʜ",
    I: "ɪ", J: "ᴊ", K: "ᴋ", L: "ʟ", M: "ᴍ", N: "ɴ", O: "ᴏ", P: "ᴘ",
    Q: "ǫ", R: "ʀ", S: "ꜱ", T: "ᴛ", U: "ᴜ", V: "ᴠ", W: "ᴡ", X: "x",
    Y: "ʏ", Z: "ᴢ"
  };
  return text.split("").map(ch => map[ch] || ch).join("");
}

module.exports = {
  config: {
    name: "cmdstore",
    aliases: ["cs", "cmds"],
    author: "Rasin",
    role: 0,
    version: "2.0",
    description: { en: "command store" },
    countDown: 3,
    category: "goatbot",
    guide: { en: "{pn}cs [page number | keyword]" }
  },

  onStart: async function ({ api, event, args }) {
    const query = args.join(" ").trim().toLowerCase();
    let page = 1;

    try {
      const res = await axios.get(apiUrl);
      const allCmds = res.data.cmd_store;

      let filtered = allCmds;

      if (query) {
        if (!isNaN(query)) {
          page = parseInt(query);
        } else {
          filtered = allCmds.filter(cmd =>
            cmd.name.toLowerCase().includes(query)
          );
          if (filtered.length === 0) {
            return api.sendMessage(
              fancyFont(`No commands found matching "${query}"`),
              event.threadID,
              event.messageID
            );
          }
        }
      }

      const totalPages = Math.ceil(filtered.length / pages);
      if (page < 1 || page > totalPages) {
        return api.sendMessage(
          fancyFont(`Invalid page. Use a number between 1 and ${totalPages}`),
          event.threadID,
          event.messageID
        );
      }

      const start = (page - 1) * pages;
      const end = start + pages;
      const pageItems = filtered.slice(start, end);

      let msg = `${fancyFont("Command Store")} [Page ${page}/${totalPages}]\n${fancyFont(`Total: ${filtered.length} commands`)}\n\n`;

      pageItems.forEach((cmd, index) => {
        const num = start + index + 1;
        msg += `${num}. Nᴀᴍᴇ: ${fancyFont(cmd.name)}\n${fancyFont("Author:")} ${cmd.author}\n${fancyFont("Description:")} ${fancyFont(cmd.description || "No description")}\n${fancyFont("Type:")} ${cmd.type}\n\n`;
      });

      const emojis = ["👀🎀", "🥹🎀", "😘🎀"];
      msg += `${emojis[Math.floor(Math.random() * emojis.length)]} Rᴇᴘʟʏ Wɪᴛʜ A Nᴜᴍʙᴇʀ Tᴏ Gᴇᴛ Cᴏᴍᴍᴀɴᴅ Lɪɴᴋ`;

      api.sendMessage(msg, event.threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "cmdstore",
          type: "reply",
          author: event.senderID,
          cmds: filtered,
          page
        });
      }, event.messageID);

    } catch (e) {
      console.log(e);
      api.sendMessage(fancyFont("Failed to fetch commands."), event.threadID, event.messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    if (event.senderID !== Reply.author)
      return api.sendMessage(fancyFont("You are not allowed to reply to this message."), event.threadID, event.messageID);

    const num = parseInt(event.body);
    const startIndex = (Reply.page - 1) * pages;
    const endIndex = startIndex + pages;

    if (isNaN(num) || num < startIndex + 1 || num > Math.min(endIndex, Reply.cmds.length)) {
      return api.sendMessage(fancyFont(`Please reply with a number between ${startIndex + 1} and ${Math.min(endIndex, Reply.cmds.length)}`), event.threadID, event.messageID);
    }

    const selected = Reply.cmds[num - 1];
    api.unsendMessage(Reply.messageID);

    const emojis = ["👀🎀", "🥹🎀", "😘🎀"];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    const msg = `${fancyFont("Command:")} ${selected.name}\n${fancyFont("Author:")} ${selected.author}\n${fancyFont("Link:")} ${selected.link}\n\n${emoji}`;
    api.sendMessage(msg, event.threadID, event.messageID);
  }
};
