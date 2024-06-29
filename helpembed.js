const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
} = require("discord.js");

function registerHelpCommand(client) {
  client.on("ready", async () => {
    await client.application.commands.create({
      name: "help",
      description: "HIỆN TẤT CẢ CÁC LỆNH CÓ THỂ DÙNG ĐƯỢC.",
    });
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "help") {
      let pageIndex = 0;
      const embeds = createHelpEmbeds(interaction.user);
      const row = createActionRow();

      const message = await interaction.reply({
        embeds: [embeds[pageIndex]],
        components: [row],
        ephemeral: true,
        fetchReply: true,
      });

      const filter = (i) =>
        ["prev", "next"].includes(i.customId) &&
        i.user.id === interaction.user.id;
      const collector = message.createMessageComponentCollector({ filter });

      collector.on("collect", async (i) => {
        if (i.customId === "next") {
          pageIndex = (pageIndex + 1) % embeds.length;
        } else if (i.customId === "prev") {
          pageIndex = (pageIndex - 1 + embeds.length) % embeds.length;
        }
        await i.update({ embeds: [embeds[pageIndex]], components: [row] });
      });
    }
  });
}

function createHelpEmbeds(user) {
  return [
    new EmbedBuilder()
      .setTitle("📜 ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅ & ᴛừ ᴋʜᴏá ᴛᴇxᴛt 📜")
      .setDescription(
        "ʙᴏᴛ đᴀɴɢ sử ᴅụɴɢ ʟệɴʜ sʟᴀsʜ ᴄᴏᴍᴍᴀɴᴅ để ʙɪếᴛ ᴛʜêᴍ ʜãʏ ᴅùɴɢ ʟệɴʜ : `/help`\n" +
          "- Lưu Ý: `Bot Sẽ Ngưng Từ Khoá Text Sau Khi Dùng Từ Khoá Đầu, Sẽ Hồi Sau 60s`.\n" +
          "- Cảm Ơn Các Bạn Đã Dùng Bot!!",
      )
      .setColor("#ef87fa")
      .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
      .setImage(
        "https://cdn.donmai.us/sample/ad/1a/__momoi_blue_archive_drawn_by_go_sai_tamanegi__sample-ad1a1d4fdeb9630ba798de757804564d.jpg",
      )
      .setTimestamp(),

    new EmbedBuilder()
      .setTitle("ʟệɴʜ ᴄủᴀ ᴀᴅᴍɪɴɪsᴛʀᴀᴛᴏʀ 👑")
      .setDescription(
        "• ᴄáᴄ ʟệɴʜ ᴅướɪ ᴄʜỉ <@958668688607838208> ᴅùɴɢ đượᴄ!\n``` /txt Bật & Tắt Text\n !dungbot Tắt bot\n !uptime kiểm tra thời gian bot online ```",
      )
      .setColor("#ef87fa")
      .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
      .setImage(
        "https://cdn.donmai.us/sample/ad/1a/__momoi_blue_archive_drawn_by_go_sai_tamanegi__sample-ad1a1d4fdeb9630ba798de757804564d.jpg",
      )
      .setTimestamp(),

    new EmbedBuilder()
      .setTitle("ᴠăɴ ʙảɴ ᴅùɴɢ ᴛᴇxᴛ 💬")
      .setDescription(
        "``` • chào, avatar wibu, chó, thằng Otaku, hi, ai hỏi, gà, thằng gà, quê, bạn là nhất... (Ví dụ: chào), ```",
      )
      .setColor("#ef87fa")
      .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
      .setImage(
        "https://cdn.donmai.us/sample/ad/1a/__momoi_blue_archive_drawn_by_go_sai_tamanegi__sample-ad1a1d4fdeb9630ba798de757804564d.jpg",
      )
      .setTimestamp(),

    new EmbedBuilder()
      .setTitle("ʟệɴʜ ᴅấᴜ ᴄʜấᴍ ᴛʜᴀɴɢ ❗")
      .setDescription(
        "``` !avatar | Lấy avatar.\n !anhwaifu | Gửi ảnh anime.\n !riengwaifu | Gửi ảnh anime riêng\n - Lưu ý: lệnh !anhwaifu & !riengwaifu sẽ delay 5->10s nên hãy kiên nhẫn nhé.```",
      )
      .setColor("#ef87fa")
      .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
      .setImage(
        "https://cdn.donmai.us/sample/ad/1a/__momoi_blue_archive_drawn_by_go_sai_tamanegi__sample-ad1a1d4fdeb9630ba798de757804564d.jpg",
      )
      .setTimestamp(),

    new EmbedBuilder()
      .setTitle("ʟệɴʜ ᴅùɴɢ ɴʜạᴄ 🎵")
      .setDescription(
        "``` !joinv | Vào voice.\n !leavev | Rời voice.\n !playnhac | Phát nhạc.\n !dungnhac | Dừng nhạc.\n !choitiep | Phát tiếp nhạc.\n !quabai | Qua bài tiếp theo.\n !laplainhac | Lặp lại 1 bài nhạc.\n !dunglaplai | Dừng lặp lại nhạc.\n```",
      )
      .setColor("#ef87fa")
      .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
      .setImage(
        "https://cdn.donmai.us/sample/ad/1a/__momoi_blue_archive_drawn_by_go_sai_tamanegi__sample-ad1a1d4fdeb9630ba798de757804564d.jpg",
      )
      .setTimestamp(),

    new EmbedBuilder()
      .setTitle("ʟờɪ ᴋếᴛ ᴛʜúᴄ 💞")
      .setDescription(
"• ᴄảᴍ ơɴ ᴄáᴄ ʙạɴ đã ᴅùɴɢ ʙᴏᴛ <@1180786118724177920>\n• ᴛᴜʏ ᴄʜỉ ʟà ʙᴏᴛ ᴛʜử ɴɢʜɪệᴍ ᴠà ᴄòɴ ɴʜɪềᴜ ᴛʜɪếᴜ sóᴛ ᴄũɴɢ ɴʜư ᴍᴏɴɢ ᴍọɪ ɴɢườɪ ʙỏ ǫᴜᴀ!\n• ʟờɪ ᴄᴜốɪ ᴄùɴɢ ᴄũɴɢ ɴʜư ʟà ʟờɪ ᴄảᴍ ơɴ đếɴ ᴍọɪ ɴɢườɪ đã ᴛɪɴ ᴛưởɴɢ ᴠà ᴄũɴɢ ɴʜư ʟà ᴅùɴɢ ʙᴏᴛ! ",
      )
      .setColor("#ef87fa")
      .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
      .setImage(
        "https://cdn.donmai.us/sample/ad/1a/__momoi_blue_archive_drawn_by_go_sai_tamanegi__sample-ad1a1d4fdeb9630ba798de757804564d.jpg",
      )
      .setTimestamp(),
  ];
}

function createActionRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("prev")
      .setLabel("◀️")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("next")
      .setLabel("▶️")
      .setStyle(ButtonStyle.Success),
  );
}

module.exports = registerHelpCommand;

/*
const { EmbedBuilder } = require("discord.js");

function registerHelpCommand(client) {
  client.on("ready", async () => {
    await client.application.commands.create({
      name: "help",
      description: "Hiện tất cả các lệnh có thể dùng được.",
    });
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "help") {
      const embed = createHelpEmbed(interaction.user);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  });
}

function createHelpEmbed(user) {
  return new EmbedBuilder()
    .setTitle("📜 All Command & Từ Khoá Text 📜")
    .setDescription(
      "Bot đang sử dụng lệnh slash command để biết thêm hãy dùng : `lệnh /help`\n" +
        "- Lưu Ý: `Bot Sẽ Ngưng Từ Khoá Text Sau Khi Dùng Từ Khoá Đầu, Sẽ Hồi Sau 60s`.\n" +
        "- Cám Ơn Các Bạn Đã Dùng Bot!!"
    )
    .addFields([
      {
        name: "Lệnh của Admin: 👑",
        value: "``` /opentxt Bật & Tắt Text\n !dungbot Tắt bot\n !uptime kiểm tra thời gian bot online ```",
      },
      {
        name: "Văn bản: 💬",
        value:
          "``` • chào, avatar wibu, chó, thằng Otaku, hi, ai hỏi, gà, thằng gà, quê, bạn là nhất... (Ví dụ: chào), ```",
      },
      {
        name: "Lệnh: ❗",
        value:
          "``` !avatar | Lấy avatar.\n !anhwaifu | Gửi ảnh anime.\n !riengwaifu | Gửi ảnh anime riêng\n - Lưu ý: lệnh !anhwaifu & !riengwaifu sẽ delay 5->10s nên hãy kiên nhẫn nhé.```",
      },
      {
        name: "Lệnh dùng nhạc: 🎵",
        value:
          "``` !joinv | Vào voice.\n !leavev | Rời voice.\n !playnhac | Phát nhạc.\n !dungnhac | Dừng nhạc.\n !choitiep | Phát tiếp nhạc.\n !quabai | Qua bài tiếp theo.\n !laplainhac | Lặp lại 1 bài nhạc.\n !dunglaplai | Dừng lặp lại nhạc.\n```",
      },
    ])
    .setColor("#ef87fa")
    .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
    .setImage(
      "https://cdn.donmai.us/sample/ad/1a/__momoi_blue_archive_drawn_by_go_sai_tamanegi__sample-ad1a1d4fdeb9630ba798de757804564d.jpg"
    )
    .setTimestamp();
}

module.exports = registerHelpCommand;
*/
