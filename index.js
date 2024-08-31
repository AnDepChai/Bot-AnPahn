const Discord = require("discord.js");
const {
  REST,
  Routes,
  SlashCommandBuilder,
  ApplicationCommandOptionType,
} = require("discord.js");
const axios = require("axios");
const FormData = require("form-data");
const express = require("express");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionsBitField,
  //  StringSelectMenuBuilder,
  //  StringSelectMenuInteraction,
  //  AttachmentBuilder,
  Partials,
} = require("discord.js");
const events = require("events");
events.EventEmitter.defaultMaxListeners = 15;

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
const fs = require("fs");
const ytdl = require("@distube/ytdl-core");
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
const allowedChannel = ["1269625880272044042", "", ""];
//___quyền id lệnh administrator
const allowedUserIds = [
  "958668688607838208",
  "712642371669458964",
  "891486418872963092",
  "816890629581570058",
  "804347438881570836",
  "1091723343713021962",
];

//___id quyền lọc chửi thề và spam
/*
const allowedUserIds2 = ["",
 "",
 "",
 "",
 "",
]; // tạm dừng
*/

app.listen(3000, () => {
  console.log("An Pahn Online ✅");
  client.uptimeStart = Date.now();
});
app.get("/", (req, res) => {
  res.send("Bot By Pahn An - Version v3.0.0");
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
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
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
        description: "ʙậᴛ/ᴛắᴛ ᴛʀả ʟờɪ ᴛɪɴ ɴʜắɴ ᴛxᴛ.",
        options: [],
      },
      {
        name: "help",
        description: "ʜɪệɴ ᴛấᴛ ᴄả ᴄáᴄ ʟệɴʜ ʙạɴ ᴄó ᴛʜể ᴅùɴɢ.",
        options: [],
      },
      {
        name: "dungbot",
        description: "ᴛắᴛ ʙᴏᴛ ! ᴀɴ ᴘᴀʜɴ.",
        options: [],
      },
      {
        name: "nasa",
        description: "ʜɪểᴍ ᴛʜị ʜìɴʜ ảɴʜ ᴛʜɪêɴ ᴠăɴ ʜọᴄ ᴛᴜʏệᴛ đẹᴘ ᴍỗɪ ɴɢàʏ.",
        options: [],
      },
      {
        name: "quetpl",
        description: "ǫᴜéᴛ ᴠɪʀᴜs ғɪʟᴇ ᴘʟᴜɢɪɴs ᴅạɴɢ (.ᴊᴀʀ).",
        options: [
          {
            name: "plugin",
            description: "ᴛʜêᴍ ғɪʟᴇ ᴘʟᴜɢɪɴs ᴅạɴɢ (.ᴊᴀʀ) để ǫᴜéᴛ.",
            type: Discord.ApplicationCommandOptionType.Attachment,
            required: true,
          },
        ],
      },
      {
        name: "quetlink",
        description: "ᴋɪểᴍ ᴛʀᴀ ᴍứᴄ độ ᴀɴ ᴛᴏàɴ ᴄủᴀ ᴡᴇʙsɪᴛᴇ.",
        options: [
          {
            name: "url",
            description: "ᴛʜêᴍ ᴜʀʟ ᴅạɴɢ (ʜᴛᴛᴘs://) để ǫᴜéᴛ.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "avatar",
        description: "ʜɪểɴ ᴛʜị ᴀᴠᴀᴛᴀʀ ᴄủᴀ ɴɢườɪ ᴅùɴɢ.",
        options: [
          {
            name: "user",
            description: "ᴄʜọɴ <@ᴍᴇɴᴛɪᴏɴ>/<ɪᴅ> để ʟấʏ ᴀᴠᴀᴛᴀʀ.",
            type: Discord.ApplicationCommandOptionType.User,
            required: false,
          },
        ],
      },
      {
        name: "anhwaifu",
        description: "ʀᴀɴᴅᴏᴍ ảɴʜ ᴀɴɪᴍᴇ ɴɢẫᴜ ɴʜɪêɴ ᴛặɴɢ ʙạɴ.",
        options: [],
      },
      {
        name: "riengwaifu",
        description: "ʀᴀɴᴅᴏᴍ ɴɢẫᴜ ɴʜɪêɴ ảɴʜ ᴀɴɪᴍᴇ ᴠà ɢửɪ ʀɪêɴɢ ᴄʜᴏ ʙạɴ.",
        options: [],
      },
      {
        name: "server",
        description: "ᴋɪểᴍ ᴛʀᴀ ᴛʜôɴɢ ᴛɪɴ ᴄủᴀ sᴇʀᴠᴇʀ ᴍɪɴᴇᴄʀᴀғᴛ.",
        options: [
          {
            name: "ip",
            description: "ɴʜậᴘ ɪᴘ sᴇʀᴠᴇʀ ᴍɪɴᴇᴄʀᴀғᴛ để ᴋɪểᴍ ᴛʀᴀ.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "check",
        description: "ᴄʜᴇᴄᴋ ʙảᴏ ᴍậᴛ ᴍáʏ ᴄʜủ ᴅɪsᴄᴏʀᴅ.",
        options: [
          {
            name: "id",
            description: "ɴʜậᴘ ɪᴅ ᴍáʏ ᴄʜủ ʙᴏᴛ đᴀɴɢ ở để ᴄʜᴇᴄᴋ.",
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
          },
        ],
      },
      {
        name: "info",
        description: "Hiểm thị thông tin của bạn.",
        options: [
          {
            name: "user",
            description: "ᴄʜọɴ <@ᴍᴇɴᴛɪᴏɴ>/<ɪᴅ> để ʟấʏ thông tin.",
            type: Discord.ApplicationCommandOptionType.User,
            required: false,
          },
        ],
      },
    ];
    rest
      .put(Discord.Routes.applicationCommands(client.user.id), {
        body: commands,
      })
      .catch(console.error);
  } catch (e) {
    console.error(e);
  }
}
//___

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "txt") {
    const userId = interaction.user.id;
    if (allowedUserIds.includes(userId)) {
      ActiveMessage = !ActiveMessage;

      const statusEmbed = new EmbedBuilder()
        .setColor(ActiveMessage ? "#00ff00" : "#ff0000")
        .setDescription(`ᴛɪɴ ɴʜắɴ ᴛự độɴɢ: ${ActiveMessage ? "ʙậᴛ" : "ᴛắᴛ"}`);

      await interaction.reply({ embeds: [statusEmbed] });
    } else {
      const noPermissionEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("⚠️ ǫᴜʏềɴ ʜạɴ ᴋʜôɴɢ đủ ⚠️")
        .setDescription("❎ ʙạɴ ᴋʜôɴɢ ᴄó ǫᴜʏềɴ sử ᴅụɴɢ ʟệɴʜ ɴàʏ.");

      await interaction.reply({ embeds: [noPermissionEmbed] });
    }
  }
});
//___

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, user } = interaction;

  if (commandName === "dungbot") {
    if (!allowedUserIds.includes(user.id)) {
      const noPermissionEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("⚠️ ǫᴜʏềɴ ʜạɴ ᴋʜôɴɢ đủ ⚠️")
        .setDescription("❎ ʙạɴ ᴋʜôɴɢ ᴄó ǫᴜʏềɴ sử ᴅụɴɢ ʟệɴʜ ɴàʏ.");

      await interaction.reply({
        embeds: [noPermissionEmbed],
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("ᴛʜôɴɢ ʙáᴏ ᴄậᴘ ɴʜậᴛ ʙᴏᴛ 🤖")
      .setDescription(
        "• ʙᴏᴛ ʜɪệɴ ᴛạɪ đᴀɴɢ ᴅừɴɢ ʜᴏạᴛ độɴɢ 🔒 \n• ʙᴏᴛ sẽ ʜᴏạᴛ độɴɢ ʟạɪ sᴀᴜ ᴋʜɪ ǫᴜá ᴛʀìɴʜ ᴄậᴘ ɴʜậᴛ ʜᴏàɴ ᴛấᴛ 🔓",
      )
      .setColor("#ff0000")
      .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
      .setImage("https://share.creavite.co/667fa87da4acd93e52346f5a.gif")
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
    process.exit();
  }
});

//___
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "avatar") {
    const user = interaction.options.getUser("user") || interaction.user;
    let format = user.displayAvatarURL().includes(".gif") ? "gif" : "png";

    const avatarURL = user.displayAvatarURL({ format, size: 1024 });

    const embed = new EmbedBuilder()
      .setTitle(`ᴀᴠᴀᴛᴀʀ ᴄủᴀ: ${user.tag}`)
      .setDescription(`[ʟɪɴᴋ ᴀᴠᴀᴛᴀʀ:](${avatarURL})`)
      .setImage(avatarURL)
      .setColor("#2e3b46")
      .setFooter({
        text: `ʏêᴜ ᴄầᴜ ʙởɪ: ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });

    await interaction.reply({ embeds: [embed] });
  }
});
//___

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "anhwaifu") {
    const imageUrl = await getRandomWaifuImage();
    if (!imageUrl) {
      await interaction.reply("Đã ʙị ʟỗɪ, ᴋʜôɴɢ ᴛʜể ʟấʏ ảɴʜ!");
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("Ảɴʜ ᴡᴀɪғᴜ ɴɢẫᴜ ɴʜɪêɴ:")
      .setImage(imageUrl)
      .setColor("#FFC0CB")
      .setFooter({
        text: `ʏêᴜ ᴄầᴜ ʙởɪ: ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  if (commandName === "riengwaifu") {
    const imageUrl = await getRandomWaifuImage();
    if (!imageUrl) {
      await interaction.reply("Đã ʙị ʟỗɪ, ᴋʜôɴɢ ᴛʜể ʟấʏ ảɴʜ!");
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("Ảɴʜ ᴡᴀɪғᴜ ɴɢẫᴜ ɴʜɪêɴ:")
      .setImage(imageUrl)
      .setColor("#FFC0CB")
      .setFooter({
        text: `ʏêᴜ ᴄầᴜ ʙởɪ: ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    try {
      await interaction.user.send({
        content: "Đâʏ ʟà ảɴʜ ɴɢẫᴜ ɴʜɪêɴ ʀɪêɴɢ ᴛư ᴄủᴀ ʙạɴ:",
        embeds: [embed],
      });

      const replyEmbed = new EmbedBuilder()
        .setDescription(
          "Ảɴʜ ɴɢẫᴜ ɴʜɪêɴ đã đượᴄ ɢửɪ đếɴ ᴛɪɴ ɴʜắɴ ʀɪêɴɢ ᴛư ᴄủᴀ ʙạɴ ʜãʏ ᴄʜᴇᴄᴋ ᴛɪɴ ɴʜắɴ ɴʜé.",
        )
        .setColor("#00ff00");

      await interaction.reply({ embeds: [replyEmbed], ephemeral: true });
    } catch (error) {
      await interaction.reply(
        "ᴋʜôɴɢ ᴛʜể ɢửɪ ᴛɪɴ ɴʜắɴ ʀɪêɴɢ ᴛư. ᴠᴜɪ ʟòɴɢ ᴋɪểᴍ ᴛʀᴀ ᴄàɪ đặᴛ ǫᴜʏềɴ ʀɪêɴɢ ᴛư ᴄủᴀ ʙạɴ.",
        { ephemeral: true },
      );
    }
  }
});
//___

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "server") {
    await interaction.deferReply();
    const serverName = interaction.options.getString("ip");

    try {
      const response = await axios.get(
        `https://api.mcsrvstat.us/2/${serverName}`,
      );
      const data = await response.data;

      if (data.online) {
        const embed = new EmbedBuilder()
          .setDescription(`sᴇʀᴠᴇʀ: **${serverName}**`)
          .addFields(
            {
              name: "• ᴛʀạɴɢ ᴛʜáɪ:",
              value: data.online ? "ʜᴏạᴛ độɴɢ" : "ᴋʜôɴɢ ʜᴏạᴛ độɴɢ",
            },
            { name: "• ɪᴘ ᴀᴅᴅʀᴇss:", value: data.ip || "ᴋʜôɴɢ ᴄó ᴛʜôɴɢ ᴛɪɴ" },
            {
              name: "• ᴘᴏʀᴛ sᴇʀᴠᴇʀ:",
              value: data.port.toString() || "ᴋʜôɴɢ ᴄó ᴛʜôɴɢ ᴛɪɴ",
            },
            {
              name: "• ɴɢườɪ ᴄʜơɪ:",
              value: `${data.players.online} / ${data.players.max}`,
            },
            {
              name: "• ᴘʜɪêɴ ʙảɴ:",
              value: data.version || "ᴋʜôɴɢ ᴄó ᴛʜôɴɢ ᴛɪɴ",
            },
            {
              name: "• ᴍô ᴛả:",
              value: data.motd.clean.join("\n") || "ᴋʜôɴɢ ᴄó ᴛʜôɴɢ ᴛɪɴ",
            },
          )
          .setThumbnail(`https://api.mcsrvstat.us/icon/${serverName}`)
          .setColor("#00ff00")
          .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" });

        await interaction.editReply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setDescription(
            `sᴇʀᴠᴇʀ **${serverName}** ɴàʏ ᴋʜôɴɢ ʜᴏạᴛ Độɴɢ ʜᴏặᴄ ᴋʜôɴɢ ᴛồɴ ᴛạɪ!`,
          )
          .setColor("#ff0000");

        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      const embed = new EmbedBuilder()
        .setDescription("ʟỗɪ ᴋʜɪ ʟấʏ ᴛʜôɴɢ ᴛɪɴ ᴄủᴀ sᴇʀᴠᴇʀ!.")
        .setColor("#ff0000");

      await interaction.editReply({ embeds: [embed] });
    }
  }
});
//___

// Tạm dừng
/*
const WARNING_CHANNEL_ID = ''; // id kênh xem log

const antiSpam = new Map();
const spamTracker = new Map();
const SPAM_THRESHOLD = 5;
const SPAM_DURATION = 10000;
const RESET_DURATION = 30000; // 30 giây

const PROFANITY = ["cl",
  "cc",
  "cặc",
  "đéo",
  "dume",
  "đụ má",
  "djt",
  "cailonma",
  "cái lồn",
  "lồn",
  "địt",
  "địt mẹ",
  "đjt",
  "motherfucker",
  "bitch",
  "shit",
  "asshole",
  "pussy",
  "whore",
  "slut",
  "dick",
  "cock",
  "nigger",
  "faggot",
  "chink",
  "kike",
  "spic",
  "wetback",
  "cunt",
  "twat",
  "bugger",
  "bollocks",
  "arse",
  "tosser",
  "wanker",
  "bastard",
  "bloody",
  "damn",
  "hell",
  "balls",
  "bullshit",
  "crap",
  "darn",
  "douche",
  "freak",
  "frick",
  "jerk",
  "prick",
  "suck",
  "turd",
  "blowjob",
  "handjob",
  "spank",
  "spunk",
  "poontang",
  "piss",
  "pussyhole",
  "fuckface",
  "shithead",
  "mẹ kiếp",
  "đồ chó",
  "ngu",
  "chết tiệt",
  "thằng khốn",
  "đĩ",
  "bòi",
  "búa xua",
  "ba trợn",
  "dơ dáng",
  "đồ rác",
  "câm mồm",
  "khốn nạn",
  "con hoang",
  "con lợn",
  "mẹ mày",
  "thằng chó",
  "vãi đái",
  "vãi lồn",
  "đồ khốn nạn",
  "đồ lợn",
  "đồ phản bội",
  "đồ ngu",
  "mày điên à",
  "đồ đĩ",
  "đồ đĩ thõa",
  "mất dạy",
  "đồ chết tiệt",]; // các từ cần lọc vào đây

const ALLOWED_WORDS = ["acc",
  "access",
  "account",
  "accurate",
  "hello",
  "accomplish",
  "according",
  "acknowledge",
  "acquire",
  "active",
  "activity",
  "actually",
  "addition",
  "address",
  "adjust",
  "admit",
  "advance",
  "advantage",
  "advertise",
  "advice",
  "advise",
  "affect",
  "afford",
  "after",
  "again",
  "against",
  "age",
  "agency",
  "agent",
  "ago",
  "agree",
  "agreement",
  "ahead",
  "air",
  "all",
  "allow",
  "almost",
  "alone",
  "along",
  "already",
  "also",
  "although",
  "always",
  "amaze",
  "amazing",
  "among",
  "amount",
  "analysis",
  "ancient",
  "and",
  "anger",
  "angle",
  "animal",
  "announce",
  "another",
  "answer",
  "anxiety",
  "any",
  "anybody",
  "anymore",
  "anyone",
  "anything",
  "anyway",
  "apart",
  "apartment",
  "apologize",
  "apparent",
  "appeal",
  "appear",
  "appearance",
  "apple",
  "application",
  "apply",
  "appoint",
  "appointment",
  "appreciate",
  "approach",
  "appropriate",
  "approval",
  "approve",
  "approximate",
  "area",
  "argue",
  "argument",
  "arise",
  "arm",
  "around",
  "arrange",
  "arrangement",
  "arrest",
  "arrival",
  "arrive",
  "art",
  "article",
  "artist",
  "as",
  "aside",
  "ask",
  "asleep",
  "aspect",
  "ass",
  "assemble",
  "assembly",
  "assess",
  "assessment",
  "assign",
  "assignment",
  "assist",
  "assistance",
  "assistant",
  "associate",
  "association",
  "assume",
  "assumption",
  "assure",
  "at",
  "athlete",
  "atmosphere",
  "attach",
  "attack",
  "attempt",
  "attend",
  "attention",
  "attitude",
  "attorney",
  "attract",
  "attraction",
  "attractive",
  "attribute",
  "audience",
  "author",
  "authority",
  "available",
  "average",
  "avoid",
  "award",
  "aware",
  "awareness",
  "away",
  "awful",
  "baby",
  "back",
  "background",
  "bad",
  "badly",
  "bag",
  "balance",
  "ball",
  "ban",
  "band",
  "bank",
  "bar",
  "barely",
  "barrel",
  "base",
  "baseball",
  "basic",
  "basically",
  "basis",
  "basket",
  "basketball",
  "bath",
  "bathroom",
  "battery",
  "battle",
  "be",
  "beach",
  "bean",
  "bear",
  "beat",
  "beautiful",
  "beauty",
  "because",
  "become",
  "bed",
  "bedroom",
  "bee",
  "beef",
  "beer",
  "before",
  "began",
  "begin",
  "beginning",
  "behavior",
  "behind",
  "being",
  "belief",
  "believe",
  "bell",
  "belong",
  "below",
  "belt",
  "bench",
  "bend",
  "benefit",
  "beside",
  "besides",
  "best",
  "bet",
  "better",
  "between",
  "beyond",
  "bicycle",
  "big",
  "bike",
  "bill",
  "billion",
  "bind",
  "biological",
  "bird",
  "birth",
  "birthday",
  "bit",
  "bite",
  "black",
  "blame",
  "blanket",
  "blind",
  "block",
  "blood",
  "blow",
  "blue",
  "board",
  "boat",
  "body",
  "bomb",
  "bond",
  "bone",
  "book",
  "boom",]; // các từ ko đc lọc

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
      setTimeout(() => {
        sentMessage.delete().catch((err) => {
          if (err.code !== 10008) {
            console.error(err);
          }
        });
      }, 2000);
    });
    message.delete().catch((err) => {
      if (err.code !== 10008) {
        console.error(err);
      }
    });

    const warningEmbed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("[🔔 ʟᴏɢ ᴄẢɴʜ ᴄÁᴏ]")
      .setDescription(`<@${message.author.id}> Đã ʙị ᴄảɴʜ ᴄáᴏ ᴠì sᴘᴀᴍ!`)
      .setTimestamp();

    const warningChannel = client.channels.cache.get(WARNING_CHANNEL_ID);
    if (warningChannel) {
      warningChannel.send({ embeds: [warningEmbed] });
    }

    antiSpam.set(userId, timeFrame);

    if (isAllowedUser) {
      spamTracker.set(userId, Date.now());
    }
    return;
  }

  for (const word of PROFANITY) {
    if (
      message.content.toLowerCase().includes(word) &&
      !ALLOWED_WORDS.some((allowedWord) =>
        message.content.toLowerCase().includes(allowedWord),
      ) &&
      !isAllowedUser
    ) {
      message.delete().catch((err) => {
        if (err.code !== 10008) {
          console.error(err);
        }
      });

      const profanityEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("[ᴄảɴʜ ʙáᴏ ɴɢôɴ ᴛừ]")
        .setDescription(
          `${message.author}, ʜãʏ ᴄʜú ý ɴɢôɴ ᴛừ, ʙìɴʜ ᴛĩɴʜ ɴàᴏ ʙạɴ ơɪ!`,
        )
        .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
        .setTimestamp();

      message.channel.send({ embeds: [profanityEmbed] }).then((sentMessage) => {
        setTimeout(() => {
          sentMessage.delete().catch((err) => {
            if (err.code !== 10008) {
              console.error(err);
            }
          });
        }, 2000);
      });

      const warningEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("[🔔 ʟᴏɢ ᴄẢɴʜ ᴄÁᴏ]")
        .setDescription(`<@${message.author.id}> Đã ʙị ᴄảɴʜ ᴄáᴏ ᴠì ᴅùɴɢ ɴɢôɴ ᴛừ ᴋʜôɴɢ ᴘʜù ʜợᴘ!`)
        .setTimestamp();

      const warningChannel = client.channels.cache.get(WARNING_CHANNEL_ID);
      if (warningChannel) {
        warningChannel.send({ embeds: [warningEmbed] });
      }

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
*/
//___

const youtubeApiKey = "AIzaSyB5kahXDrdMynCN13IXwoPRG32HIA9Zj28";
//"AIzaSyD6WYgtRPv2CQAYgRX7kpVKJ6-_Pu36nRk";

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
      return;
    }
  }

  const stream = ytdl(youtubeUrl, {
    filter: "audioonly",
    quality: "highestaudio",
    highWaterMark: 1 << 27, // 25 MB mặc định
    bitrate: 128,
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

    const message = await textChannel.send({ embeds: [embed] });
    setTimeout(async () => {
      try {
        await message.delete();
      } catch (error) {}
    }, 5000);

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

//___
let is247Mode = false;

function startIdleTimeout() {
  if (idleTimeout) clearTimeout(idleTimeout);

  idleTimeout = setTimeout(async () => {
    if (!isPlaying && connection && !userRequestedLeave && !is247Mode) {
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

//___
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

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  lastBotMessage = message;

  const content = message.content.toLowerCase();

  const userVoiceChannel = message.member.voice.channel;
  textChannel = message.channel;

  if (
    content.startsWith("!joinv") ||
    content.startsWith("!jv") ||
    content.startsWith(`<@${client.user.id}> joinv`)
  ) {
    // Kiểm tra xem người dùng có trong kênh voice không
    if (!userVoiceChannel) {
      const embed = new EmbedBuilder()
        .setDescription("ʙạɴ ᴘʜảɪ ᴠàᴏ ᴠᴏɪᴄᴇ ᴄʜᴀɴɴᴇʟ ᴛʀướᴄ ᴋʜɪ ᴅùɴɢ ʟệɴʜ ɴàʏ!")
        .setColor("#ff0000");
      await message.channel.send({ embeds: [embed] });
      return;
    }

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
    content.startsWith("!leavev") ||
    content.startsWith("!lv") ||
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

  if (content.startsWith("!playnhac") || content.startsWith("!pn")) {
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
      const videoAuthor = videoInfo.videoDetails.author.name;
      const videoDuration = videoInfo.videoDetails.lengthSeconds;
      const videoThumbnail = videoInfo.videoDetails.thumbnails[0].url;
      const videoUrl = "https://t.co/elon"; //
      const embed = new EmbedBuilder()
        .setDescription(
          `<:youtube:1243493337302962196> Đã ᴛʜêᴍ ɴʜạᴄ:\n[_${videoTitle}_](${videoUrl})\n\n` +
          `<:heart:1269216504381968455> ᴛạɪ ᴋêɴʜ:\n_${videoAuthor}_\n\n` +
          `<:heart:1269216504381968455> 𝚃𝚑ờ𝚒 𝙻ượ𝚗𝚐:\n_${Math.floor(videoDuration / 60)} ᴘʜúᴛ : ${videoDuration % 60} ɢɪâʏ_\n\n` +
          `<:heart:1269216504381968455> 𝚈ê𝚞 𝙲ầ𝚞 𝙱ở𝚒:\n<@${message.author.id}>`,
        )
        .setThumbnail(videoThumbnail)
        .setColor("#00ff00");

      await message.channel.send({ embeds: [embed] });

      if (!isPlaying) {
        await playNextSong();
      }
    } else {
      try {
        const results = await searchYouTube(query);

        const embed = new EmbedBuilder()
          .setTitle(`ᴅᴀɴʜ sáᴄʜ ᴋếᴛ ǫᴜả ᴛìᴍ ᴋɪếᴍ ᴄʜᴏ: ${query}`)
          .setColor("#00ff00");

        results.forEach((result, index) => {
          embed.addFields({
            name: `${index + 1} • **${result.title}**`,
            value: `_ʟɪɴᴋ ɴʜạᴄ:_ ${result.link}`,
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

        const promptEmbed = new EmbedBuilder()
          .setDescription("ʙấᴍ ᴠàᴏ ᴄáᴄ ɴúᴛ ʙêɴ ᴅướɪ để ᴄʜọɴ ɴʜạᴄ!")
          .setColor("#00ff00");

        const replyMessage = await message.channel.send({
          embeds: [embed, promptEmbed],
          components: [actionRow],
        });

        const timeout = setTimeout(async () => {
          if (replyMessage) {
            try {
              await replyMessage.delete();
            } catch (error) {
              if (error.code !== 10008) {
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

        collector.on("collect", async (interaction) => {
          collector.stop();
          const choiceIndex =
            parseInt(interaction.customId.replace("button", ""), 10) - 1;
          const chosenResult = results[choiceIndex];

          if (chosenResult && chosenResult.link) {
            queue.push(chosenResult.link);
            const videoInfo = await ytdl.getInfo(chosenResult.link);
            const videoTitle = videoInfo.videoDetails.title;
            const videoAuthor = videoInfo.videoDetails.author.name;
            const videoDuration = videoInfo.videoDetails.lengthSeconds;
            const videoThumbnail = videoInfo.videoDetails.thumbnails[0].url;
            const videoUrl = "https://t.co/elon"; //
            const embed = new EmbedBuilder()
              .setDescription(
                `<:youtube:1243493337302962196> Đã ᴛʜêᴍ ɴʜạᴄ:\n[_${videoTitle}_](${videoUrl})\n\n` +
                `<:heart:1269216504381968455> ᴛạɪ ᴋêɴʜ:\n_${videoAuthor}_\n\n` +
                `<:heart:1269216504381968455> 𝚃𝚑ờ𝚒 𝙻ượ𝚗𝚐:\n_${Math.floor(videoDuration / 60)} ᴘʜúᴛ : ${videoDuration % 60} ɢɪâʏ_\n\n` +
                `<:heart:1269216504381968455> 𝚈ê𝚞 𝙲ầ𝚞 𝙱ở𝚒:\n<@${message.author.id}>`,
              )
              .setThumbnail(videoThumbnail)
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
                }
              }
            }
          }
          clearTimeout(timeout);
        });
      } catch (error) {
        await message.channel.send("Đã xảʏ ʀᴀ ʟỗɪ ᴋʜɪ ᴛìᴍ ᴋɪếᴍ ɴʜạᴄ.");
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
    isLooping = !isLooping;
    const embed = new EmbedBuilder()
      .setDescription(`ʟặᴘ ʟạɪ ɴʜạᴄ | đã ${isLooping ? "Bật" : "Tắt"}.`)
      .setColor(isLooping ? "#00ff00" : "#ff0000");
    await message.channel.send({ embeds: [embed] });
  }

  if (
    content.startsWith("!247") ||
    content.startsWith(`<@${client.user.id}> 247`)
  ) {
    is247Mode = !is247Mode;
    const status = is247Mode ? "Bật" : "Tắt";
    const embed = new EmbedBuilder()
      .setDescription(`ᴄʜế độ ᴛʀᴇᴏ 𝟸𝟺/𝟽 | đã ${status}.`)
      .setColor(is247Mode ? "#00ff00" : "#ff0000");
    await message.channel.send({ embeds: [embed] });
  }
});

//___

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "quetpl") {
    const pluginAttachment = interaction.options.getAttachment("plugin");

    if (!pluginAttachment.name.endsWith(".jar")) {
      await interaction.reply({
        content: "❌ ᴠᴜɪ ʟòɴɢ ɢửɪ ғɪʟᴇ ᴘʟᴜɢɪɴ ᴅạɴɢ (.ᴊᴀʀ).",
        ephemeral: true,
      });
      return;
    }

    if (!allowedUserIds.includes(interaction.user.id)) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ff0000")
            .setTitle("⚠️ ǫᴜʏềɴ ʜạɴ ᴋʜôɴɢ đủ ⚠️")
            .setDescription("❎ ʙạɴ ᴋʜôɴɢ ᴄó ǫᴜʏềɴ sử ᴅụɴɢ ʟệɴʜ ɴàʏ."),
        ],
        ephemeral: true,
      });
      return;
    }

    const initialReply = await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#0099ff")
          .setDescription(
            "Đᴀɴɢ ǫᴜéᴛ ғɪʟᴇ, ᴠᴜɪ ʟòɴɢ đợɪ <a:loadingma:1265977725559111710>\nᴄó ᴛʜể ᴍấᴛ ᴛừ 𝟹-𝟻 ᴘʜúᴛ để ǫᴜéᴛ xᴏɴɢ!",
          ),
      ],
      ephemeral: false,
      fetchReply: true,
    });

    try {
      const response = await fetch(pluginAttachment.url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const formData = new FormData();
      formData.append("file", buffer, { filename: pluginAttachment.name });

      const options = {
        method: "POST",
        url: "https://www.virustotal.com/api/v3/files",
        headers: {
          accept: "application/json",
          "x-apikey": process.env.VIRUSTOTAL_API_KEY,
          ...formData.getHeaders(),
        },
        data: formData,
      };

      const uploadResponse = await axios.request(options);
      const fileId = uploadResponse.data.data.id;

      const checkScanStatus = async (fileId) => {
        const scanOptions = {
          method: "GET",
          url: `https://www.virustotal.com/api/v3/analyses/${fileId}`,
          headers: {
            accept: "application/json",
            "x-apikey": process.env.VIRUSTOTAL_API_KEY,
          },
        };

        let scanResponse;
        let completed = false;

        while (!completed) {
          scanResponse = await axios.request(scanOptions);
          if (scanResponse.data.data.attributes.status === "completed") {
            completed = true;
          } else {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
        return scanResponse.data;
      };

      const scanResult = await checkScanStatus(fileId);
      const results = scanResult.data.attributes.results;
      const detections = [];

      for (const engine in results) {
        if (results[engine].category === "malicious") {
          detections.push(`${engine}: ${results[engine].result}`);
        }
      }

      let embedResult;
      if (detections.length > 0) {
        embedResult = new EmbedBuilder()
          .setColor("#ff0000")
          .setDescription(
            `ᴋếᴛ ǫᴜả ǫᴜéᴛ ғɪʟᴇ: **${pluginAttachment.name}**\n\nᴄʜươɴɢ ᴛʀìɴʜ độᴄ ʜạɪ đượᴄ ᴘʜáᴛ ʜɪệɴ:\n\`\`\`${detections.join("\n")}\`\`\``,
          )
          .setFooter({ text: "© sᴄᴀɴ ᴠɪʀᴜs ᴀᴛʜ🐧" })
          .setTimestamp();
      } else {
        embedResult = new EmbedBuilder()
          .setColor("#00ff00")
          .setDescription(
            `ᴋếᴛ ǫᴜả ǫᴜéᴛ ғɪʟᴇ: **${pluginAttachment.name}**\n\n\`\`\`ᴋʜôɴɢ ᴘʜáᴛ ʜɪệɴ ᴄʜươɴɢ ᴛʀìɴʜ độᴄ ʜạɪ ɴàᴏ.\`\`\``,
          )
          .setFooter({ text: "© sᴄᴀɴ ᴠɪʀᴜs ᴀᴛʜ🐧" })
          .setTimestamp();
      }

      await interaction.editReply({ embeds: [embedResult] });
    } catch (err) {
      console.error(err);
      await interaction.editReply({
        content: `ʟỗɪ ᴋʜɪ ǫᴜéᴛ ғɪʟᴇ. ᴄʜɪ ᴛɪếᴛ: \`${err.message}\``,
        embeds: [],
        ephemeral: true,
      });
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "quetlink") {
    const url = interaction.options.getString("url");

    if (!url) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ff0000")
            .setDescription("ᴠᴜɪ ʟòɴɢ ɴʜậᴘ ᴜʀʟ để ǫᴜéᴛt."),
        ],
        ephemeral: true,
      });
      return;
    }

    const embedScanning = new EmbedBuilder()
      .setColor("#0099ff")
      .setDescription(
        "Đᴀɴɢ ǫᴜéᴛ ᴜʀʟ, ᴠᴜɪ ʟòɴɢ đợɪ <a:loadingma:1265977725559111710>\nᴄó ᴛʜể ᴍấᴛ ᴛừ 𝟹-𝟻 ᴘʜúᴛ để ǫᴜéᴛ xᴏɴɢ!",
      );

    await interaction.reply({ embeds: [embedScanning], ephemeral: false });

    try {
      const options = {
        method: "POST",
        url: "https://www.virustotal.com/api/v3/urls",
        headers: {
          accept: "application/json",
          "x-apikey": process.env.VIRUSTOTAL_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: `url=${encodeURIComponent(url)}`,
      };

      const response = await axios.request(options);
      const scanId = response.data.data.id;

      const checkScanStatus = async (scanId) => {
        const statusOptions = {
          method: "GET",
          url: `https://www.virustotal.com/api/v3/analyses/${scanId}`,
          headers: {
            accept: "application/json",
            "x-apikey": process.env.VIRUSTOTAL_API_KEY,
          },
        };

        let scanResponse;
        let completed = false;

        while (!completed) {
          scanResponse = await axios.request(statusOptions);
          if (scanResponse.data.data.attributes.status === "completed") {
            completed = true;
          } else {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }

        return scanResponse.data;
      };

      const scanResult = await checkScanStatus(scanId);
      const results = scanResult.data.attributes.results;
      const detections = [];

      for (const engine in results) {
        if (results[engine].category === "malicious") {
          detections.push(`${engine}: ${results[engine].result}`);
        }
      }

      if (detections.length > 0) {
        embedScanning
          .setColor("#ff0000")
          .setDescription(
            `ᴋếᴛ ǫᴜả ǫᴜéᴛ ᴜʀʟ: **${url}**\n\nᴘʜáᴛ ʜɪệɴ ᴄáᴄ ᴘʜầɴ ᴍềᴍ độᴄ hại:\n\`\`\`${detections.join("\n")}\`\`\``,
          )
          .setFooter({ text: "© sᴄᴀɴ ᴠɪʀᴜs ᴀᴛʜ🐧" })
          .setTimestamp();
      } else {
        embedScanning
          .setColor("#00ff00")
          .setDescription(
            `ᴋếᴛ ǫᴜả ǫᴜéᴛ ᴜʀʟ: **${url}**\n\n\`\`\`ᴋʜôɴɢ ᴘʜáᴛ ʜɪệɴ ᴘʜầɴ ᴍềᴍ độᴄ ʜạɪ.\`\`\``,
          )
          .setFooter({ text: "© sᴄᴀɴ ᴠɪʀᴜs ᴀᴛʜ🐧" })
          .setTimestamp();
      }

      await interaction.editReply({ embeds: [embedScanning] });
    } catch (err) {
      console.error(err);
      await interaction.editReply({
        embeds: [
          embedScanning
            .setColor("#ff0000")
            .setDescription(`ʟỗɪ ᴋʜɪ ǫᴜéᴛ ᴜʀʟ. ᴄʜɪ ᴛɪếᴛ: \`${err.message}\``),
        ],
      });
    }
  }
});
//___

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'check') {
        const guildId = interaction.options.getString('id') || interaction.guild.id;

        try {
            const guild = await client.guilds.fetch(guildId);
            
            const securityEmbed = new EmbedBuilder()
                .setTitle('🔒 𝑺𝒆𝒄𝒖𝒓𝒊𝒕𝒚 𝑪𝒉𝒆𝒄𝒌')
                .setColor('#FF0000')
                .setDescription(`ᴋɪểᴍ ᴛʀᴀ ʙảᴏ ᴍậᴛ ᴄʜᴏ ᴍáʏ ᴄʜủ **${guild.name}**`)
                .setThumbnail(guild.iconURL())
                .setTimestamp();

            const is2FAEnabled = guild.mfaLevel === 1 ? 'ᴄó' : 'ᴋʜôɴɢ';
            securityEmbed.addFields([{ name: '𝟸ғᴀ ᴄʜᴏ ǫᴜảɴ ᴛʀị ᴠɪêɴ:', value: is2FAEnabled }]);

          let adminRoles = guild.roles.cache.filter(role => role.permissions.has(PermissionsBitField.Flags.Administrator));
securityEmbed.addFields([{ 
    name: 'ᴠᴀɪ ᴛʀò ᴄó ǫᴜʏềɴ ǫᴜảɴ ᴛʀị:', 
    value: adminRoles.size > 0 ? `\`\`\`${adminRoles.map(role => role.name).join(', ')}\`\`\`` : 'ᴋʜôɴɢ ᴄó' 
}]);

let botWithAdmin = guild.members.cache.filter(member => member.user.bot && member.permissions.has(PermissionsBitField.Flags.Administrator));
securityEmbed.addFields([{ 
    name: 'ʙᴏᴛ ᴄó ǫᴜʏềɴ ǫᴜảɴ ᴛʀị:', 
    value: botWithAdmin.size > 0 ? `\`\`\`${botWithAdmin.map(member => member.user.username).join(', ')}\`\`\`` : 'ᴋʜôɴɢ ᴄó' 
}]);

            const contentFilterLevels = ['ᴛắᴛ', 'ᴄʜỉ ǫᴜéᴛ ᴛʜàɴʜ ᴠɪêɴ ᴋʜôɴɢ ᴄó ᴠᴀɪ ᴛʀò', 'ǫᴜéᴛ ᴛấᴛ ᴄả ᴛʜàɴʜ ᴠɪêɴ'];
            const verificationLevels = ['ᴋʜôɴɢ ᴄó', 'ʏêᴜ ᴄầᴜ ᴇᴍᴀɪʟ', 'ʏêᴜ ᴄầᴜ đăɴɢ ᴋý ᴛʀêɴ ᴅɪsᴄᴏʀᴅ ᴛʀêɴ 𝟻 ᴘʜúᴛ', 'ʏêᴜ ᴄầᴜ ʟà ᴛʜàɴʜ ᴠɪêɴ ᴛʀêɴ 𝟷𝟶 ᴘʜúᴛ', 'ʏêᴜ ᴄầᴜ xáᴄ ᴍɪɴʜ ǫᴜᴀ số đɪệɴ ᴛʜᴏạɪ'];

            securityEmbed.addFields([
              { name: 'ʙộ ʟọᴄ ɴộɪ ᴅᴜɴɢ:', value: contentFilterLevels[guild.explicitContentFilter], inline: true },
              { name: 'ᴍứᴄ độ xáᴄ ᴍɪɴʜ:', value: verificationLevels[guild.verificationLevel], inline: true },
              { name: 'số ʟượɴɢ ᴛʜàɴʜ ᴠɪêɴ:', value: `${guild.memberCount}`, inline: true },
              { name: 'số ʟượɴɢ ᴋêɴʜ:', value: `${guild.channels.cache.size}`, inline: true },
            ]);

            await interaction.reply({ embeds: [securityEmbed] });
        } catch (error) {
            if (error.code === 10004) {
                await interaction.reply(`ᴋʜôɴɢ ᴛìᴍ ᴛʜấʏ ᴍáʏ ᴄʜủ ᴠớɪ ɪᴅ: "${guildId}"`);
            } else if (error.code === 50001) {
                await interaction.reply('ʙᴏᴛ ᴋʜôɴɢ ᴄó ǫᴜʏềɴ ᴛʀᴜʏ ᴄậᴘ ᴛʜôɴɢ ᴛɪɴ ᴄủᴀ ᴍáʏ ᴄʜủ ɴàʏ.');
            } else {
                await interaction.reply('Đã xảʏ ʀᴀ ʟỗɪ ᴋʜɪ xử ʟý ʏêᴜ ᴄầᴜ.');
                console.error(error);
            }
        }
    }
});
//___

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'nasa') {
        try {
      
            const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`);
            const apod = response.data;

            const nasaEmbed = new EmbedBuilder()
                .setTitle(apod.title)
                .setDescription(apod.explanation)
                .setImage(apod.url)
                .setFooter({ text: `Ngày: ${apod.date}` });

            await interaction.reply({ embeds: [nasaEmbed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('Không thể lấy dữ liệu từ NASA.');
        }
    }
});
//___

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'info') {
    let targetUser = interaction.options.getUser('user');

    // Nếu không có user, thì kiểm tra chính người gọi lệnh
    if (!targetUser) {
      targetUser = interaction.user;
    }

    const member = interaction.guild.members.cache.get(targetUser.id);
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Tʜôɴɢ ᴛɪɴ ᴄá ɴʜâɴ:')
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'ᴛêɴ ɴɢườɪ ᴅùɴɢ:', value: targetUser.username, inline: true },
        { name: 'ID:', value: `\`${targetUser.id}\``, inline: true },
        {
          name: 'ɴɢàʏ ᴛʜᴀᴍ ɢɪᴀ Discord:',
          value: targetUser.createdAt.toLocaleDateString('en-US'),
          inline: true,
        },
      );

    if (member) {
      embed.addFields(
        {
          name: 'ɴɢàʏ ᴛʜᴀᴍ ɢɪᴀ Server:',
          value: member.joinedAt.toLocaleDateString('en-US'),
          inline: true,
        },
        {
  name: 'ᴠᴀɪ ᴛʀò:',
  value: `\`\`\`${member.roles.cache.map((role) => role.name).join(', ')}\`\`\``,
  inline: true,
},
        {
          name: 'ᴛʀạɴɢ ᴛʜáɪ:',
          value: member.presence ? member.presence.status : 'Offline',
          inline: true,
        },
      );
    }

    await interaction.reply({ embeds: [embed] });
  }
});


//___logins vào bot
client.login(process.env.token);