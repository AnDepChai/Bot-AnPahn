const Discord = require("discord.js");
const axios = require("axios");
const express = require("express");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Partials,
} = require("discord.js");
const events = require("events");
events.EventEmitter.defaultMaxListeners = 15; // Số lượng listeners tối đa bạn muốn đặt, ví dụ là 15

// Xuất hàm
const { sendEmo } = require("./sendEmo");
const registerHelpCommand = require("./helpembed.js");
const handleCooldown = require("./cooldown");
const loadFileContents = require("./xacdinhtxt");
const { getRandomWaifuImage } = require("./anhwaifu");
const setBotStatus = require("./trangthaibot");

// xử lý nhạc
const {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  joinVoiceChannel,
} = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const { google } = require("googleapis");
const youtube = google.youtube("v3");
const youtubeSearch = require("youtube-search");
//___
var ActiveMessage = true;

const app = express();
//___
const client = new Discord.Client({
  intents: [
    "Guilds",
    "GuildMessages",
    "GuildMembers",
    "MessageContent",
    "GuildVoiceStates",
    "GuildPresences",
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});
registerHelpCommand(client);
setBotStatus(client);

//___
const folderPath = "text";
const fileContents = loadFileContents(folderPath);

//___id kênh sendemoji
const allowedChannel = ["",             
 "",
 "",
];
//___quyền id lệnh administrator
const allowedUserIds = ["",
 "",
];
//___id quyền lọc chửi thề và spam
const allowedUserIds2 = ["",
 "",
 "",
 "",
 "",
];

app.listen(3000, () => {
  console.log("An Pahn Online ✅");
  client.uptimeStart = Date.now();
});
app.get("/", (req, res) => {
  res.send("Bot By Pahn An - Version v2.7a");
});

client.on("messageCreate", (message) => {
  if (message.content === "ping") {
    message.channel.send("pong!");
  }
  sendEmo(message, allowedChannel);
  if (ActiveMessage) handleCooldown(message, fileContents);
});

//___
client.on("messageCreate", async (message) => {
  if (message.content === "!ping") {
    const apiLatency = Math.round(client.ws.ping);
    const botLatency = Date.now() - message.createdTimestamp;

    const embed = new EmbedBuilder()
      .setColor("00FF00")
      .setTitle("📶 ᴘɪɴɢ ʙᴏᴛ")
      .setDescription("pong!")
      .addFields(
        { name: "Độ ᴛʀễ ʙᴏᴛ:", value: `${botLatency} ᴍs` },
        { name: "Độ ᴛʀễ ᴀᴘɪ:", value: `${apiLatency} ᴍs` },
      )
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  }
});

//___
client.on("messageCreate", async (message) => {
  if (message.content === "!uptime") {
    if (!allowedUserIds.includes(message.author.id)) {
      const noPermissionEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("⚠️ ǫᴜʏềɴ ʜạɴ ᴋʜôɴɢ đủ ⚠️")
        .setDescription("❎ ʙạɴ ᴋʜôɴɢ ᴄó ǫᴜʏềɴ sử ᴅụɴɢ ʟệɴʜ ɴàʏ.");

      await message.channel.send({ embeds: [noPermissionEmbed] });
      return;
    }

    const now = Date.now();
    const uptime = now - client.uptimeStart;

    const days = Math.floor(uptime / (24 * 60 * 60 * 1000));
    const hours = Math.floor(
      (uptime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000),
    );
    const minutes = Math.floor((uptime % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((uptime % (60 * 1000)) / 1000);

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("⏱ ᴛʜờɪ ɢɪᴀɴ ʙᴏᴛ ʜᴏạᴛ độɴɢ!")
      .addFields(
        { name: "Ngày:", value: `${days}`, inline: true },
        { name: "Giờ:", value: `${hours}`, inline: true },
        { name: "Phút:", value: `${minutes}`, inline: true },
        { name: "Giây:", value: `${seconds}`, inline: true },
      )
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  }
});

//___
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.trim().split(/ +/);
  const command = content[0].toLowerCase();
  const args = content.slice(1);

  if (command === "!dungbot") {
    if (!allowedUserIds.includes(message.author.id)) {
      const noPermissionEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("⚠️ ǫᴜʏềɴ ʜạɴ ᴋʜôɴɢ đủ ⚠️")
        .setDescription("❎ ʙạɴ ᴋʜôɴɢ ᴄó ǫᴜʏềɴ sử ᴅụɴɢ ʟệɴʜ ɴàʏ.");

      await message.channel.send({ embeds: [noPermissionEmbed] });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("[ᴛʜôɴɢ ʙáᴏ ᴄậᴘ ɴʜậᴛ ʙᴏᴛ 🤖]")
      .setDescription(
        "• ʙᴏᴛ ʜɪệɴ ᴛạɪ đᴀɴɢ ᴅừɴɢ ʜᴏạᴛ độɴɢ 🔒 \n• ʙᴏᴛ sẽ ʜᴏạᴛ độɴɢ ʟạɪ sᴀᴜ ᴋʜɪ ǫᴜá ᴛʀìɴʜ ᴄậᴘ ɴʜậᴛ ʜᴏàɴ ᴛấᴛ 🔓"
      )
      .setColor("#ff0000")
      .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
      .setImage("https://share.creavite.co/667fa87da4acd93e52346f5a.gif")
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
    process.exit();
  }
});

//___
client.on("ready", () => {
  ActiveSlash();
});
function ActiveSlash() {
  try {
    var rest = new Discord.REST({ version: "10" }).setToken(process.env.token);
    const commands = [
      {
        name: "txt",
        description: "BẬT/TẮT TRẢ LỜI TIN NHẮN TXT",
        options: [],
      },
      {
        name: "help",
        description: "HIỆN TẤT CẢ CÁC LỆNH CÓ THỂ DÙNG ĐƯỢC.",
        options: [],
      },
    ];
    rest
      .put(Discord.Routes.applicationCommands(client.user.id), {
        body: commands,
      })
      .catch(console.error);

    client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "txt") {
    const userId = interaction.user.id;
    if (allowedUserIds.includes(userId)) {
      ActiveMessage = !ActiveMessage;
      await interaction.reply(
        `Trả Lời Tin Nhắn: ${ActiveMessage ? "Bật" : "Tắt"}`
      );
    } else {
      const noPermissionEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("⚠️ ǫᴜʏềɴ ʜạɴ ᴋʜôɴɢ đủ ⚠️")
        .setDescription("❎ ʙạɴ ᴋʜôɴɢ ᴄó ǫᴜʏềɴ sử ᴅụɴɢ ʟệɴʜ ɴàʏ.");

      await interaction.reply({ embeds: [noPermissionEmbed] });
      return;
    }
  }
});
  } catch (e) {
    console.log(e);
  }
}

//___
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("!avatar")) {
    let user;
    const args = message.content.split(" ");

    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
    } else if (args[1]) {
      const userId = args[1];
      user = await client.users.fetch(userId).catch(() => null);
    } else {
      await message.reply(
        "ʜãʏ ɴʜậᴘ 'ɪᴅ' ʜᴏặᴄ ''@ᴍᴇɴᴛɪᴏɴ' ɴɢườɪ ᴅùɴɢ để ʟấʏ ᴀᴠᴀᴛᴀʀ.",
      );
      return;
    }

    if (!user) {
      await message.reply("ᴋʜôɴɢ ᴛìᴍ ᴛʜấʏ ɴɢườɪ ʙạɴ ʏêᴜ ᴄầᴜ!");
      return;
    }

    let format = "png";
    let size = 1024;

    if (args[2]) {
      const validFormats = ["png", "jpg", "webp"];
      if (validFormats.includes(args[2].toLowerCase())) {
        format = args[2].toLowerCase();
      }
    }
    if (args[3]) {
      const validSizes = [128, 256, 512, 1024, 2048];
      if (validSizes.includes(parseInt(args[3]))) {
        size = parseInt(args[3]);
      }
    }

    const avatarURL = user.displayAvatarURL({ format, size });

    const embed = new EmbedBuilder()
      .setTitle(`ᴀᴠᴀᴛᴀʀ ᴄủᴀ: ${user.tag}`)
      .setDescription(`[ʟɪɴᴋ ᴀᴠᴀᴛᴀʀ:](${avatarURL})`)
      .setImage(avatarURL)
      .setColor("#2e3b46") //#00FF00
      .setFooter({
        text: `ʏêᴜ ᴄầᴜ ʙởɪ: ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  }
});

//___
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();
  if (content === "!anhwaifu" || content === "!riengwaifu") {
    await handleWaifuCommand(message, content);
  }
});

async function handleWaifuCommand(message, command) {
  const imageUrl = await getRandomWaifuImage();
  if (!imageUrl) {
    message.reply("Đã ʙị ʟỗɪ, ᴋʜôɴɢ ᴛʜể ʟấʏ ảɴʜ!");
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle("Ảɴʜ ᴡᴀɪғᴜ ɴɢẫᴜ ɴʜɪêɴ:")
    .setImage(imageUrl)
    .setColor("#FFC0CB")
    .setFooter({
      text: `ʏêᴜ ᴄầᴜ ʙởɪ: ${message.author.tag}`,
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp();

  if (command === "!anhwaifu") {
    await message.reply({ embeds: [embed] });
  } else if (command === "!riengwaifu") {
    try {
      await message.author.send({
        content: "Đâʏ ʟà ảɴʜ ɴɢẫᴜ ɴʜɪêɴ ʀɪêɴɢ ᴛư ᴄủᴀ ʙạɴ:",
        embeds: [embed],
      });

      const replyEmbed = new EmbedBuilder()
        .setDescription(
          "Ảɴʜ ɴɢẫᴜ ɴʜɪêɴ đã đượᴄ ɢửɪ đếɴ ᴛɪɴ ɴʜắɴ ʀɪêɴɢ ᴛư ᴄủᴀ ʙạɴ ʜãʏ ᴄʜᴇᴄᴋ ᴛɪɴ ɴʜắɴ ɴʜé.",
        )
        .setColor("#00ff00");

      await message.reply({ embeds: [replyEmbed] });
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn riêng tư:", error);

      message.reply(
        "ᴋʜôɴɢ ᴛʜể ɢửɪ ᴛɪɴ ɴʜắɴ ʀɪêɴɢ ᴛư. ᴠᴜɪ ʟòɴɢ ᴋɪểᴍ ᴛʀᴀ ᴄàɪ đặᴛ ǫᴜʏềɴ ʀɪêɴɢ ᴛư ᴄủᴀ ʙạɴ.",
      );
    }
  }
}

//___
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase().startsWith("!gay")) {
    let user = message.mentions.users.first() || message.author;
    let percentage = Math.floor(Math.random() * 101);

    const embed = new EmbedBuilder()
      .setTitle("The Gay Machine")
      .setDescription(`How gay is ${user}`)
      .addFields({ name: "Answer", value: `${percentage}% Gay!` })
      .setColor("#7289DA")
      .setThumbnail(user.displayAvatarURL({ dynamic: true }));

    message.channel.send({ embeds: [embed] });
  }

  if (message.content.toLowerCase().startsWith("!cute")) {
    let user = message.mentions.users.first() || message.author;
    let percentage = Math.floor(Math.random() * 101);

    const embed = new EmbedBuilder()
      .setTitle("The Cute Machine")
      .setDescription(`How cute is ${user}`)
      .addFields({ name: "Answer", value: `${percentage}% Cute!` })
      .setColor("#FF69B4")
      .setThumbnail(user.displayAvatarURL({ dynamic: true }));

    message.channel.send({ embeds: [embed] });
  }

  if (message.content.toLowerCase().startsWith("!handsome")) {
    let user = message.mentions.users.first() || message.author;
    let percentage = Math.floor(Math.random() * 101);

    const embed = new EmbedBuilder()
      .setTitle("The Handsome Machine")
      .setDescription(`How handsome is ${user}`)
      .addFields({ name: "Answer", value: `${percentage}% Handsome!` })
      .setColor("#7289DA")
      .setThumbnail(user.displayAvatarURL({ dynamic: true }));

    message.channel.send({ embeds: [embed] });
  }
});

//___
let channelAId = "";
let channelBId = "";
let recentMessages = {};
let messageCount = 0;

function createEmbed(
  authorTag,
  content,
  guildName,
  channelName,
  attachments,
  emoji,
  authorAvatarURL,
) {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: authorTag,
      iconURL: authorAvatarURL,
    })
    .setDescription(
      `📨 ᴛɪɴ ɴʜắɴ ᴄủᴀ ʙạɴ:\n${content}\n\n[Discord AnPahn!](https://discord.com/invite/8aSjybNe9E)`,
    )
    .setFooter({
      text: `© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧 | Đếᴍ ᴛɪɴ ɴʜắɴ: ${messageCount}`,
    })
    .setThumbnail(emoji)
    .setTimestamp()
    .setColor("#00FF00");

  attachments.forEach((attachment) => {
    if (attachment.type.startsWith("image")) {
      embed.setImage(attachment.url);
    } else if (attachment.type.startsWith("video")) {
      embed.addFields({ name: "📹 Video:", value: attachment.url });
    }
  });

  return embed;
}

async function forwardMessage(message, targetChannelId) {
  try {
    const targetChannel = await client.channels.fetch(targetChannelId);
    const guildName = message.guild.name;
    const channelName = message.channel.name;

    if (targetChannel) {
      const forwardedMessage = createEmbed(
        message.author.tag,
        message.content,
        guildName,
        channelName,
        message.attachments.map((attachment) => ({
          url: attachment.url,
          type: attachment.contentType,
        })),
        message.author.displayAvatarURL({ dynamic: true }),
      );

      if (!recentMessages[message.id]) {
        await targetChannel.send({ embeds: [forwardedMessage] });
        recentMessages[message.id] = true;
        messageCount++;
        setTimeout(() => {
          delete recentMessages[message.id];
        }, 30000);
      }
    }
  } catch (error) {
    console.error();
  }
}

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.channel.id === channelAId) {
    forwardMessage(message, channelBId);
  } else if (message.channel.id === channelBId) {
    forwardMessage(message, channelAId);
  }
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  const args = message.content.split(" ");

  if (args[0] === "!idA") {
    if (args[1]) {
      channelAId = args[1];
      message.reply(`Đã ᴛʜɪếᴛ ʟậᴘ ᴄʜᴀɴɴᴇʟ ᴀ ᴛʜàɴʜ ɪᴅ: ${channelAId}`);
    } else {
      message.reply("ᴠᴜɪ ʟòɴɢ ɴʜậᴘ ɪᴅ ᴋêɴʜ ʜợᴘ ʟệ ᴄʜᴏ ᴄʜᴀɴɴᴇʟ ᴀ.");
    }
    return;
  }

  if (args[0] === "!idB") {
    if (args[1]) {
      channelBId = args[1];
      message.reply(`Đã ᴛʜɪếᴛ ʟậᴘ ᴄʜᴀɴɴᴇʟ ʙ ᴛʜàɴʜ ɪᴅ: ${channelBId}`);
    } else {
      message.reply("ᴠᴜɪ ʟòɴɢ ɴʜậᴘ ɪᴅ ᴋêɴʜ ʜợᴘ ʟệ ᴄʜᴏ ᴄʜᴀɴɴᴇʟ ʙ.");
    }
    return;
  }

  if (args[0] === "!xoaid") {
    if (args[1] === "A") {
      channelAId = "";
      message.reply("Đã xᴏá ɪᴅ ᴄʜᴀɴɴᴇʟ ᴀ.");
    } else if (args[1] === "B") {
      channelBId = "";
      message.reply("Đã xᴏá ɪᴅ ᴄʜᴀɴɴᴇʟ ʙ.");
    } else {
      message.reply("ᴠᴜɪ ʟòɴɢ ɴʜậᴘ 'ᴀ' ʜᴏặᴄ 'ʙ' Để xᴏá ɪᴅ ᴋêɴʜ ᴛươɴɢ ứɴɢ!");
    }
    return;
  }
});

//___
const antiSpam = new Map();
const spamTracker = new Map();
const SPAM_THRESHOLD = 5;
const SPAM_DURATION = 10000;
const RESET_DURATION = 30000; // 30 giây
const PROFANITY = ["cl", "cc", "cặc", "đéo", "dume", "đụ má", "djt", "cailonma", "cái lồn", "lồn", "địt", "địt mẹ", "đjt", 
"motherfucker", "bitch", "shit", "asshole", "pussy", "whore", "slut", "dick", "cock", "nigger", "faggot", "chink", 
"kike", "spic", "wetback", "cunt", "twat", "bugger", "bollocks", "arse", "tosser", "wanker", "bastard", "bloody", 
"damn", "hell", "balls", "bullshit", "crap", "darn", "douche", "freak", "frick", "jerk", "prick", "suck", "turd", 
"blowjob", "handjob", "spank", "spunk", "poontang", "piss", "pussyhole", "fuckface", "shithead",
"mẹ kiếp", "đồ chó", "ngu", "chết tiệt", "thằng khốn", "đĩ", "bòi", "búa xua", "ba trợn", "dơ dáng", "đồ rác", 
"câm mồm", "khốn nạn", "con hoang", "con lợn", "mẹ mày", "thằng chó", "vãi đái", "vãi lồn", "đồ khốn nạn", 
"đồ lợn", "đồ phản bội", "đồ ngu", "mày điên à", "đồ đĩ", "đồ đĩ thõa", "mất dạy", "đồ chết tiệt",
]; // các từ cần lọc vào đây
const ALLOWED_WORDS = [
  "acc","access", "account", "accurate","hello", "accomplish", "according", "acknowledge", "acquire", "active", "activity", 
  "actually", "addition", "address", "adjust", "admit", "advance", "advantage", "advertise", "advice", "advise", "affect", 
  "afford", "after", "again", "against", "age", "agency", "agent", "ago", "agree", "agreement", "ahead", "air", "all", 
  "allow", "almost", "alone", "along", "already", "also", "although", "always", "amaze", "amazing", "among", "amount", 
  "analysis", "ancient", "and", "anger", "angle", "animal", "announce", "another", "answer", "anxiety", "any", "anybody", 
  "anymore", "anyone", "anything", "anyway", "apart", "apartment", "apologize", "apparent", "appeal", "appear", "appearance", 
  "apple", "application", "apply", "appoint", "appointment", "appreciate", "approach", "appropriate", "approval", "approve", 
  "approximate", "area", "argue", "argument", "arise", "arm", "around", "arrange", "arrangement", "arrest", "arrival", 
  "arrive", "art", "article", "artist", "as", "aside", "ask", "asleep", "aspect", "ass", "assemble", "assembly", "assess", 
  "assessment", "assign", "assignment", "assist", "assistance", "assistant", "associate", "association", "assume", 
  "assumption", "assure", "at", "athlete", "atmosphere", "attach", "attack", "attempt", "attend", "attention", "attitude", 
  "attorney", "attract", "attraction", "attractive", "attribute", "audience", "author", "authority", "available", 
  "average", "avoid", "award", "aware", "awareness", "away", "awful", "baby", "back", "background", "bad", "badly", 
  "bag", "balance", "ball", "ban", "band", "bank", "bar", "barely", "barrel", "base", "baseball", "basic", "basically", 
  "basis", "basket", "basketball", "bath", "bathroom", "battery", "battle", "be", "beach", "bean", "bear", "beat", "beautiful", 
  "beauty", "because", "become", "bed", "bedroom", "bee", "beef", "beer", "before", "began", "begin", "beginning", "behavior", 
  "behind", "being", "belief", "believe", "bell", "belong", "below", "belt", "bench", "bend", "benefit", "beside", "besides", 
  "best", "bet", "better", "between", "beyond", "bicycle", "big", "bike", "bill", "billion", "bind", "biological", "bird", 
  "birth", "birthday", "bit", "bite", "black", "blame", "blanket", "blind", "block", "blood", "blow", "blue", "board", 
  "boat", "body", "bomb", "bond", "bone", "book", "boom",]; // các từ ko đc lọc
/*
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (!antiSpam.has(message.author.id)) {
    antiSpam.set(message.author.id, []);
  }

  const userMessages = antiSpam.get(message.author.id);
  userMessages.push(Date.now());

  const timeFrame = userMessages.filter(
    (timestamp) => Date.now() - timestamp < SPAM_DURATION,
  );

  if (timeFrame.length > SPAM_THRESHOLD) {
    const spamEmbed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("[ᴄảɴʜ ʙáᴏ sᴘᴀᴍ]")
      .setDescription(
        `${message.author}, ʙạɴ đᴀɴɢ sᴘᴀᴍ, ᴠᴜɪ ʟòɴɢ ᴄʜᴀᴛ ᴄʜậᴍ ʟạɪ!`,
      )
      .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
      .setTimestamp();

    message.channel.send({ embeds: [spamEmbed] }).then((sentMessage) => {
      setTimeout(() => sentMessage.delete().catch(console.error), 2000);
    });
    message.delete().catch(console.error);
    antiSpam.set(message.author.id, timeFrame);
    return;
  }

  for (const word of PROFANITY) {
    if (
      message.content.toLowerCase().includes(word) &&
      !ALLOWED_WORDS.some((allowedWord) => message.content.toLowerCase().includes(allowedWord))
    ) {
      message.delete().catch(console.error);

      const profanityEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("[ᴄảɴʜ ʙáᴏ ɴɢôɴ ᴛừ]")
        .setDescription(
          `${message.author}, ʜãʏ ᴄʜú ý ɴɢôɴ ᴛừ, ʙìɴʜ ᴛĩɴʜ ɴàᴏ ʙạɴ ơɪ!`,
        )
        .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
        .setTimestamp();

      message.channel.send({ embeds: [profanityEmbed] }).then((sentMessage) => {
        setTimeout(() => sentMessage.delete().catch(console.error), 2000);
      });
      return;
    }
  }
});
*/



client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const userId = message.author.id;
  const isAllowedUser = allowedUserIds2.includes(userId);

  if (!antiSpam.has(userId)) {
    antiSpam.set(userId, []);
  }

  const userMessages = antiSpam.get(userId);
  userMessages.push(Date.now());

  const timeFrame = userMessages.filter(
    (timestamp) => Date.now() - timestamp < SPAM_DURATION,
  );

  if (timeFrame.length > SPAM_THRESHOLD && !isAllowedUser) {
    const spamEmbed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("[ᴄảɴʜ ʙáᴏ sᴘᴀᴍ]")
      .setDescription(
        `${message.author}, ʙạɴ đᴀɴɢ sᴘᴀᴍ, ᴠᴜɪ ʟòɴɢ ᴄʜᴀᴛ ᴄʜậᴍ ʟạɪ!`,
      )
      .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
      .setTimestamp();

    message.channel.send({ embeds: [spamEmbed] }).then((sentMessage) => {
      setTimeout(() => sentMessage.delete().catch(console.error), 2000);
    });
    message.delete().catch(console.error);

    antiSpam.set(userId, timeFrame);

    if (isAllowedUser) {
      spamTracker.set(userId, Date.now());
    }
    return;
  }

  for (const word of PROFANITY) {
    if (
      message.content.toLowerCase().includes(word) &&
      !ALLOWED_WORDS.some((allowedWord) => message.content.toLowerCase().includes(allowedWord)) &&
      !isAllowedUser
    ) {
      message.delete().catch(console.error);

      const profanityEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("[ᴄảɴʜ ʙáᴏ ɴɢôɴ ᴛừ]")
        .setDescription(
          `${message.author}, ʜãʏ ᴄʜú ý ɴɢôɴ ᴛừ, ʙìɴʜ ᴛĩɴʜ ɴàᴏ ʙạɴ ơɪ!`,
        )
        .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
        .setTimestamp();

      message.channel.send({ embeds: [profanityEmbed] }).then((sentMessage) => {
        setTimeout(() => sentMessage.delete().catch(console.error), 2000);
      });

      if (isAllowedUser) {
        spamTracker.set(userId, Date.now());
      }
      return;
    }
  }

  if (isAllowedUser && spamTracker.has(userId)) {
    const lastSpamTime = spamTracker.get(userId);
    if (Date.now() - lastSpamTime > RESET_DURATION) {
      antiSpam.set(userId, []);
      spamTracker.delete(userId);
    }
  }
});











//___
const youtubeApiKey = "API_YOUTUBE_DATA_V3";

const queue = [];
let connection = null;
let player = null;
let isPlaying = false;
let isLooping = false;
let idleTimeout = null;
let textChannel = null;
let userRequestedLeave = false;

async function searchYouTube(query) {
  const options = {
    maxResults: 5,
    key: youtubeApiKey,
  };

  const results = await youtubeSearch(query, options);
  return results.results;
}

async function playSpecificSong(youtubeUrl) {
  if (!connection) {
    const userVoiceChannel = textChannel.guild.members.me.voice.channel;
    if (userVoiceChannel) {
      connection = joinVoiceChannel({
        channelId: userVoiceChannel.id,
        guildId: userVoiceChannel.guild.id,
        adapterCreator: userVoiceChannel.guild.voiceAdapterCreator,
      });
    } else {
      console.error("Bot không ở trong voice channel nào.");
      return;
    }
  }

  const stream = ytdl(youtubeUrl, {
    filter: "audioonly",
    quality: "highestaudio",
    highWaterMark: 1 << 27, //25 mặc định
  });

  const resource = createAudioResource(stream);
  player = createAudioPlayer();
  connection.subscribe(player);
  player.play(resource);

  isPlaying = true;

  player.on(AudioPlayerStatus.Idle, async () => {
    isPlaying = false;
    if (isLooping) {
      queue.unshift(youtubeUrl);
    }

    const embed = new EmbedBuilder()
      .setDescription("🎵 ɴʜạᴄ đã ᴋếᴛ ᴛʜúᴄ!")
      .setColor("#ff0000");

    await textChannel.send({ embeds: [embed] });

    await playNextSong();
  });
}

// Hàm phát bài tiếp theo trong hàng đợi
async function playNextSong() {
  if (queue.length > 0) {
    const youtubeUrl = queue.shift();
    await playSpecificSong(youtubeUrl);
  } else {
    isPlaying = false;
    startIdleTimeout();
  }
}

/*
function startIdleTimeout() {
  if (idleTimeout) clearTimeout(idleTimeout);

  idleTimeout = setTimeout(async () => {
    if (!isPlaying && connection) {
      connection.disconnect();
      connection = null;
      queue.length = 0;
      if (textChannel) {
        const embed = new EmbedBuilder()
          .setDescription(
            "ʙᴏᴛ đã ᴛự độɴɢ ʀờɪ ᴋʜỏɪ ᴠᴏɪᴄᴇ ᴄʜᴀɴɴᴇʟ. \n \n- ᴅᴏ ᴋʜôɴɢ ᴘʜáᴛ ʙàɪ ɴʜạᴄ ɴàᴏ ᴛʀᴏɴɢ 𝟹 ᴘʜúᴛ. \n- ᴛʀáɴʜ ᴛʀᴇᴏ ʙᴏᴛ ɴêɴ <@958668688607838208> ʟàᴍ ɴʜư ᴛʜế ɴàʏ.",
          )
          .setColor("#ff0000");

        await textChannel.send({ embeds: [embed] });
      }
    }
  }, 180000); // 3 phút = 180000
}
*/

function startIdleTimeout() {
  if (idleTimeout) clearTimeout(idleTimeout);

  idleTimeout = setTimeout(async () => {
    if (!isPlaying && connection && !userRequestedLeave) {
      connection.disconnect();
      connection = null;
      queue.length = 0;
      if (textChannel) {
        const embed = new EmbedBuilder()
          .setDescription(
            "ʙᴏᴛ đã ᴛự độɴɢ ʀờɪ ᴋʜỏɪ ᴠᴏɪᴄᴇ ᴄʜᴀɴɴᴇʟ. \n \n- ᴅᴏ ᴋʜôɴɢ ᴘʜáᴛ ʙàɪ ɴʜạᴄ ɴàᴏ ᴛʀᴏɴɢ 𝟹 ᴘʜúᴛ. \n- ᴛʀáɴʜ ᴛʀᴇᴏ ʙᴏᴛ ɴêɴ <@958668688607838208> ʟàᴍ ɴʜư ᴛʜế ɴàʏ.",
          )
          .setColor("#ff0000");

        await textChannel.send({ embeds: [embed] });
      }
    }
    userRequestedLeave = false;
  }, 180000); // 3 phút = 180000 ms
}

async function handleUserLeaveRequest() {
  userRequestedLeave = true;
  if (connection) {
    connection.disconnect();
    connection = null;
    queue.length = 0;
  }
  if (idleTimeout) clearTimeout(idleTimeout);
  userRequestedLeave = false;
}

// hàm phát nhạc từ Youtube
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  lastBotMessage = message;

  const content = message.content.toLowerCase();

  const userVoiceChannel = message.member.voice.channel;
  if (!userVoiceChannel) return;

  textChannel = message.channel;

  if (
    content.startsWith("!joinv") ||
    content.startsWith("!jv") ||
    content.startsWith(`<@${client.user.id}> joinv`)
  ) {
    connection = joinVoiceChannel({
      channelId: userVoiceChannel.id,
      guildId: userVoiceChannel.guild.id,
      adapterCreator: userVoiceChannel.guild.voiceAdapterCreator,
    });

    // Phát âm thanh khi bot kết nối vào voice channel
    const joinSound = createAudioResource("girl-uwu.mp3");
    const joinPlayer = createAudioPlayer();
    connection.subscribe(joinPlayer);
    joinPlayer.play(joinSound);

    const embed = new EmbedBuilder()
      .setDescription(`ʙᴏᴛ đã ᴛʜᴀᴍ ɢɪᴀ ᴋêɴʜ: ${userVoiceChannel.name}`)
      .setColor("#00ff00");
    await message.channel.send({ embeds: [embed] });
    startIdleTimeout();
  }

  if (
    content.startsWith("!leavev") || content.startsWith("!lv") ||
content.startsWith(`<@${client.user.id}> leavev`)
  ) {
    if (connection) {
      connection.disconnect();
      connection = null;
      isPlaying = false;
      queue.length = 0;

      const embed = new EmbedBuilder()
        .setDescription(
          "ʙᴏᴛ đã ʀờɪ ᴠᴏɪᴄᴇ ᴄʜᴀɴɴᴇʟ. \n \n- ᴅùɴɢ ʟệɴʜ `/ʜᴇʟᴘ` để ʙɪếᴛ ᴛʜêᴍ.\n- ʙᴏᴛ đã ᴜɴʟᴏᴄᴋ ᴛấᴛ ᴄả ᴄʜứᴄ ɴăɴɢ ᴋʜôɴɢ ᴄầɴ `ᴘʀᴇᴍɪᴜᴍ`.",
        )
        .setColor("#ff0000")
        .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
        .setImage("https://share.creavite.co/664728aaaac1146a40c3c100.gif");

      await message.channel.send({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setDescription("ʙᴏᴛ ᴋʜôɴɢ ở ᴛʀᴏɴɢ ᴠᴏɪᴄᴇ ᴄʜᴀɴɴᴇʟ ɴàᴏ.")
        .setColor("#ff0000");

      await message.channel.send({ embeds: [embed] });
    }
    handleUserLeaveRequest(); //
  }

  if (content.startsWith("!playnhac") || content.startsWith("!play")) {
    const args = message.content.split(" ");
    const query = args.slice(1).join(" ");
    if (!query) {
      await message.channel.send(
        "ʜãʏ ɴʜậᴘ ᴍộᴛ <ʟɪɴᴋ> ʜᴏặᴄ <ᴛêɴ ʙàɪ ʜáᴛ> ʜợᴘ ʟệ.",
      );

      return;
    }

    const youtubeUrlPattern =
      /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+|https?:\/\/(?:www\.)?youtu\.be\/[\w-]+/;
    const isYoutubeUrl = youtubeUrlPattern.test(query);

    if (!connection) {
      connection = joinVoiceChannel({
        channelId: userVoiceChannel.id,
        guildId: userVoiceChannel.guild.id,
        adapterCreator: userVoiceChannel.guild.voiceAdapterCreator,
      });

      const embed = new EmbedBuilder()
        .setDescription(`ʙᴏᴛ đã ᴛʜᴀᴍ ɢɪᴀ ᴋêɴʜ: ${userVoiceChannel.name}`)
        .setColor("#00ff00");
      await message.channel.send({ embeds: [embed] });
      startIdleTimeout();
    }

    if (isYoutubeUrl) {
      queue.push(query);
      const videoInfo = await ytdl.getInfo(query);
      const videoTitle = videoInfo.videoDetails.title;

      const embed = new EmbedBuilder()
        .setDescription(
          `<:youtube:1243493337302962196> Đã ᴛʜêᴍ ɴʜạᴄ: ${videoTitle}`,
        )
        .setColor("#00ff00");
      await message.channel.send({ embeds: [embed] });

      if (!isPlaying) {
        await playNextSong();
      }
    } else {
      try {
        const results = await searchYouTube(query);

        const embed = new EmbedBuilder()
          .setTitle(`ᴅᴀɴʜ sáᴄʜ ᴋếᴛ ǫᴜả ᴛìᴍ ᴋɪếᴍ ᴄʜᴏ: "${query}"`)
          .setColor("#00ff00");

        results.forEach((result, index) => {
          embed.addFields({
            name: `${index + 1}. ${result.title}`,
            value: `ʟɪɴᴋ ɴʜạᴄ: ${result.link}`,         
          });
        });

        const actionRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("button1")
            .setLabel("1")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("button2")
            .setLabel("2")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("button3")
            .setLabel("3")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("button4")
            .setLabel("4")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("button5")
            .setLabel("5")
            .setStyle(ButtonStyle.Success),
        );

        const replyMessage = await message.channel.send({
          embeds: [embed],
          components: [actionRow],
          content:
            "ᴠᴜɪ ʟòɴɢ ᴄʜọɴ ʙàɪ ʜáᴛ ʙằɴɢ ᴄáᴄʜ ʙấᴍ ᴠàᴏ ɴúᴛ ᴛừ '𝟷' đếɴ '𝟻'!",
        });

        const timeout = setTimeout(async () => {
          if (replyMessage) {
            try {
              await replyMessage.delete();
            } catch (error) {
              if (error.code !== 10008) {
                console.error("Lỗi khi xóa tin nhắn:", error);
              }
            }
          }

          const embed = new EmbedBuilder()
            .setDescription(
              "⏱ Đã ʜếᴛ ᴛʜờɪ ɢɪᴀɴ ᴄʜọɴ ɴʜạᴄ. ᴠᴜɪ ʟòɴɢ ᴅùɴɢ ʟạɪ ʟệɴʜ !ᴘʟᴀʏɴʜᴀᴄ.",
            )
            .setColor("#ff0000");

          await message.channel.send({ embeds: [embed] });
        }, 15000);

        const filter = (interaction) =>
          interaction.isButton() &&
          interaction.message.id === replyMessage.id &&
          interaction.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({
          filter,
          time: 15000,
        });

        //
        collector.on("collect", async (interaction) => {
          collector.stop();
          const choiceIndex =
            parseInt(interaction.customId.replace("button", ""), 10) - 1;
          const chosenResult = results[choiceIndex];

          if (chosenResult && chosenResult.link) {
            queue.push(chosenResult.link);
            const videoInfo = await ytdl.getInfo(chosenResult.link);
            const videoTitle = videoInfo.videoDetails.title;

            const embed = new EmbedBuilder()
              .setDescription(
                `<:youtube:1243493337302962196> Đã ᴛʜêᴍ ɴʜạᴄ: ${videoTitle}`,
              )
              .setColor("#00ff00");
            await message.channel.send({ embeds: [embed] });
            if (!isPlaying) {
              await playNextSong();
            }
          } else {
            await message.channel.send(
              "ᴋʜôɴɢ ᴛìᴍ ᴛʜấʏ ʙàɪ ʜáᴛ ᴘʜù ʜợᴘ. ᴠᴜɪ ʟòɴɢ ᴛʜử ʟạɪ.",
            );
          }

          if (replyMessage && replyMessage.deletable) {
            await replyMessage.delete();
          }
        });

        collector.on("end", async (collected, reason) => {
          if (reason === "time") {
            if (replyMessage) {
              try {
                await replyMessage.delete();
              } catch (error) {
                if (error.code !== 10008) {
                  console.error("Lỗi khi xóa tin nhắn:", error);
                }
              }
            }
          }
          clearTimeout(timeout);
        });
      } catch (error) {
        console.error("Đã xảʏ ʀᴀ ʟỗɪ ᴋʜɪ ᴛìᴍ ᴋɪếᴍ ɴʜạᴄ:", error);
        await message.channel.send(
          "Đã xảʏ ʀᴀ ʟỗɪ ᴋʜɪ ᴛìᴍ ᴋɪếᴍ ɴʜạᴄ.",
        );
      }
    }
  }

  if (
    content.startsWith("!quabai") ||
    content.startsWith("!qb") ||
    content.startsWith(`<@${client.user.id}> quabai`)
  ) {
    if (queue.length > 0) {
      await playNextSong();
      const embed = new EmbedBuilder()
        .setDescription("Đã ᴘʜáᴛ ʙàɪ ɴʜạᴄ ᴛɪếᴘ ᴛʜᴇᴏ.")
        .setColor("#00ff00");
      await message.channel.send({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setDescription("ᴋʜôɴɢ ᴄó ɴʜạᴄ ɴàᴏ ᴛʀᴏɴɢ ʜàɴɢ đợɪ.")
        .setColor("#ff0000");
      await message.channel.send({ embeds: [embed] });
    }
  }

  if (
    content.startsWith("!dungnhac") ||
    content.startsWith("!dn") ||
    content.startsWith(`<@${client.user.id}> dungnhac`)
  ) {
    if (player) {
      player.pause();
      const embed = new EmbedBuilder()
        .setDescription("Đã ᴅừɴɢ ɴʜạᴄ.")
        .setColor("#00ff00");
      await message.channel.send({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setDescription("ᴋʜôɴɢ ᴄó ɴʜạᴄ đᴀɴɢ đượᴄ ᴘʜáᴛ.")
        .setColor("#ff0000");
      await message.channel.send({ embeds: [embed] });
    }
  }

  if (
    content.startsWith("!choitiep") ||
    content.startsWith("!ct") ||
    content.startsWith(`<@${client.user.id}> choitiep`)
  ) {
    if (player) {
      player.unpause();
      const embed = new EmbedBuilder()
        .setDescription("đã ᴘʜáᴛ ᴛɪếᴘ ɴʜạᴄ.")
        .setColor("#00ff00");
      await message.channel.send({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setDescription("ᴋʜôɴɢ ᴄó ɴʜạᴄ đᴀɴɢ đượᴄ ᴘʜáᴛ.")
        .setColor("#ff0000");
      await message.channel.send({ embeds: [embed] });
    }
  }

  if (
    content.startsWith("!laplainhac") ||
    content.startsWith("!lln") ||
    content.startsWith(`<@${client.user.id}> laplainhac`)
  ) {
    isLooping = true;
    const embed = new EmbedBuilder()
      .setDescription("ʟặᴘ ʟạɪ ɴʜạᴄ | Đã Bật.")
      .setColor("#00ff00");
    await message.channel.send({ embeds: [embed] });
  }

  if (
    content.startsWith("!dunglaplai") ||
    content.startsWith("!dll") ||
    content.startsWith(`<@${client.user.id}> dunglaplai`)
  ) {
    isLooping = false;
    const embed = new EmbedBuilder()
      .setDescription("ʟặᴘ ʟạɪ ɴʜạᴄ | Đã Tắt.")
      .setColor("#00ff00");
    await message.channel.send({ embeds: [embed] });
  }
});
//___






//___logins vào bot
client.login(process.env.token);
