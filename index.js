const Discord = require("discord.js");
const axios = require("axios");
const express = require("express");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

// Xuất hàm
const { sendEmo } = require("./sendEmo");
const registerHelpCommand = require("./helpembed.js");
const handleCooldown = require("./cooldown");
const loadFileContents = require("./xacdinhtxt");
const { getRandomWaifuImage } = require("./anhwaifu");
const setBotStatus = require("./trangthaibot");
const { ownerResponses, otherResponses } = require("./responses");

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
    "MessageContent",
    "GuildVoiceStates",
    "GuildPresences",
  ],
});
registerHelpCommand(client);
setBotStatus(client);

//___
const folderPath = "text";
const fileContents = loadFileContents(folderPath);

//___id kênh
const allowedChannel = ["", ""]; // thêm id kênh để dùng SendEmo.js
//___id quyền(permission)
const allowedUserIds = ["", ""]; // thêm id bạn vào để dùng Quyền dùng các lệnh administrator 
//___id quyền lệnh !dungbot
const authorizedUserIds = ["", ""]; // thêm id bạn vào để dùng Quyền administrator lệnh !dungbot

app.listen(3000, () => {
  console.log("Bot Đã Hoạt Động!");
});
app.get("/", (req, res) => {
  res.send("Bot By Phan Văn An!");
});

client.on("messageCreate", (message) => {
  if (message.content === "ping") {
    message.channel.send(`ᴘɪɴɢ ʜɪệɴ ᴛạɪ ʟà: ${client.ws.ping} ᴍs`);
  }
  sendEmo(message, allowedChannel);
  if (ActiveMessage) handleCooldown(message, fileContents);
});

//___
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.trim().split(/ +/);
  const command = content[0].toLowerCase();
  const args = content.slice(1);

  if (command === "!dungbot") {
    if (!authorizedUserIds.includes(message.author.id)) {
      return message.reply("Bạn không có quyền thực hiện lệnh này.");
    }

    const embed = new EmbedBuilder()
      .setTitle("Dừng Hoạt Động Bot:")
      .setDescription(
        "ʙᴏᴛ đã ᴅừɴɢ ʜᴏạᴛ độɴɢ: 🔒 \nʙᴏᴛ sẽ ᴏɴʟɪɴᴇ ʟạɪ ᴋʜɪ ᴄậᴘ ɴʜậᴛ xᴏɴɢ: 🔓",
      )
      .setColor("#ff0000")
      .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
      .setImage("https://share.creavite.co/664f611d32c4bf0a0b48b2d9.gif")
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
    process.exit();
  }
});

//___
client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!info")) {
    const args = message.content.split(" ");
    let targetUser;

    if (args.length > 1) {
      const mention = message.mentions.users.first();
      if (mention) {
        targetUser = mention;
      } else {
        const userId = args[1];
        targetUser = await client.users.fetch(userId).catch(() => null);
      }
    } else {
      targetUser = message.author;
    }

    if (!targetUser) {
      return message.channel.send("Không tìm thấy người dùng.");
    }

    const member = message.guild.members.cache.get(targetUser.id);
    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Tʜôɴɢ ᴛɪɴ ᴄá ɴʜâɴ:")
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "ᴛêɴ ɴɢườɪ ᴅùɴɢ:", value: targetUser.username, inline: true },
        { name: "ID:", value: `\`${targetUser.id}\``, inline: true },
        {
          name: "ɴɢàʏ ᴛʜᴀᴍ ɢɪᴀ Discord:",
          value: targetUser.createdAt.toLocaleDateString("en-US"),
          inline: true,
        },
      );

    if (member) {
      embed.addFields(
        {
          name: "ɴɢàʏ ᴛʜᴀᴍ ɢɪᴀ Server:",
          value: member.joinedAt.toLocaleDateString("en-US"),
          inline: true,
        },
        {
          name: "ᴠᴀɪ ᴛʀò:",
          value: member.roles.cache.map((role) => role.name).join(", "),
          inline: true,
        },
        {
          name: "ᴛʀạɴɢ ᴛʜáɪ:",
          value: member.presence ? member.presence.status : "Offline",
          inline: true,
        },
      );
    }

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
        name: "opentxt",
        description: "Bật/Tắt trả lời tin nhắn txt",
        options: [],
      },
      {
        name: "help",
        description: "Hiện tất cả các lệnh có thể dùng được.",
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

      if (interaction.commandName === "opentxt") {
        const userId = interaction.user.id;
        if (allowedUserIds.includes(userId)) {
          ActiveMessage = !ActiveMessage;
          await interaction.reply(
            `Trả Lời Tin Nhắn: ${ActiveMessage ? "Bật" : "Tắt"}`,
          );
        } else {
          await interaction.reply(`Bạn không có quyền sử dụng lệnh này.`);
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
      await message.reply("Hãy nhập ID hoặc ping người dùng để lấy avatar.");
      return;
    }

    if (!user) {
      await message.reply("Không tìm thấy người dùng đó!");
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
    message.reply("Không thể lấy ảnh ngẫu nhiên.");
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
      message.reply(
        "Ảnh ngẫu nhiên đã được gửi đến tin nhắn riêng tư của bạn.",
      );
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn riêng tư:", error);
      message.reply(
        "ᴋʜôɴɢ ᴛʜể ɢửɪ ᴛɪɴ ɴʜắɴ ʀɪêɴɢ ᴛư. ᴠᴜɪ ʟòɴɢ ᴋɪểᴍ ᴛʀᴀ ᴄàɪ đặᴛ ǫᴜʏềɴ ʀɪêɴɢ ᴛư ᴄủᴀ ʙạɴ.",
      );
    }
  }
}

//___
const botOwnerId = ""; //Thêm id bạn vào để bot trả lời lại bạn

function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.mentions.has(client.user)) {
    if (message.mentions.everyone) return;

    if (message.author.id === botOwnerId) {
      const response = getRandomResponse(ownerResponses);
      await message.reply(response);
    } else {
      const response = getRandomResponse(otherResponses);
      await message.reply(response);
    }
  }
});

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
});

//___
const youtubeApiKey = "<YOUTUBE_API_DATA_V3";

const queue = [];
let connection = null;
let player = null;
let isPlaying = false;
let isLooping = false;
let idleTimeout = null;
let textChannel = null;

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
    highWaterMark: 1 << 25,
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

// hàm phát nhạc từ Youtube
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  const userVoiceChannel = message.member.voice.channel;
  if (!userVoiceChannel) return;

  textChannel = message.channel;

  if (content === "!joinv") {
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
  //___
  if (content === "!leavev") {
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

      await message.reply({ embeds: [embed] });
    }
  }

  if (content.startsWith("!playnhac")) {
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
        .setColor("#00ff00")
        .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
        .setImage("https://share.creavite.co/6647322faac1146a40c3c117.gif");
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
            value: result.link,
          });
        });

        const actionRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("button1")
            .setLabel("1")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("button2")
            .setLabel("2")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("button3")
            .setLabel("3")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("button4")
            .setLabel("4")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("button5")
            .setLabel("5")
            .setStyle(ButtonStyle.Primary),
        );

        const replyMessage = await message.channel.send({
          embeds: [embed],
          components: [actionRow],
          content:
            "ᴠᴜɪ ʟòɴɢ ᴄʜọɴ ʙàɪ ʜáᴛ ʙằɴɢ ᴄáᴄʜ ʙấᴍ ᴠàᴏ ɴúᴛ ᴛừ <𝟷> đếɴ <𝟻>.",
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
              "<:clock:1243494996137738241> Đã ʜếᴛ ᴛʜờɪ ɢɪᴀɴ ᴄʜọɴ ɴʜạᴄ. ᴠᴜɪ ʟòɴɢ ᴅùɴɢ ʟạɪ ʟệɴʜ !ᴘʟᴀʏɴʜᴀᴄ.",
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
              .setColor("#00ff00")
              .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
              .setImage(
                "https://share.creavite.co/6647322faac1146a40c3c117.gif",
              );
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
        await message.channel.send("Đã xảʏ ʀᴀ ʟỗɪ ᴋʜɪ ᴛìᴍ ᴋɪếᴍ ɴʜạᴄ.");
      }
    }
  }

  if (content === "!quabai") {
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

  if (content === "!dungnhac") {
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

  if (content === "!choitiep") {
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

  if (content === "!laplainhac") {
    isLooping = true;
    const embed = new EmbedBuilder()
      .setDescription("Đã Bật.")
      .setColor("#00ff00");
    await message.channel.send({ embeds: [embed] });
  }

  if (content === "!dunglaplai") {
    isLooping = false;
    const embed = new EmbedBuilder()
      .setDescription("Đã Tắt.")
      .setColor("#00ff00");
    await message.channel.send({ embeds: [embed] });
  }
});
//___

//___logins vào bot
client.login(process.env.token);
