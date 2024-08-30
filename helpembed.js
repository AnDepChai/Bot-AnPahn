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
      description: "ʜɪệɴ ᴛấᴛ ᴄả ᴄáᴄ ʟệɴʜ ʙạɴ ᴄó ᴛʜể ᴅùɴɢ.",
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
      .setTitle("ʟệɴʜ ᴄủᴀ ᴀᴅᴍɪɴɪsᴛʀᴀᴛᴏʀ ʙᴏᴛ - [🔰]")
      .setDescription(
        "• ᴄáᴄ ʟệɴʜ ᴅướɪ ᴄʜỉ <@958668688607838208> ᴅùɴɢ đượᴄ!\n``` /txt Bật & Tắt Text\n /dungbot Tắt bot\n /quetpl Quét virus plugins ```",
      )
      .setColor("#ef87fa")
      .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
      .setImage(
        "https://cdn.donmai.us/sample/ad/1a/__momoi_blue_archive_drawn_by_go_sai_tamanegi__sample-ad1a1d4fdeb9630ba798de757804564d.jpg",
      )
      .setTimestamp(),

    new EmbedBuilder()
      .setTitle("ᴠăɴ ʙảɴ ᴅùɴɢ ᴛᴇxᴛ - [💬]")
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
      .setTitle("ʟệɴʜ sʟᴀsʜ ᴄᴏᴍᴍᴀɴᴅ - [🔧]")
      .setDescription(
        "``` /avatar | <@mention> <id>.\n /quetlink | <url>.\n /anhwaifu | <Gửi ảnh anime>.\n /riengwaifu | <Gửi ảnh anime riêng.\n /server | <ip server>.\n /check | <id>.\n - Lưu ý: lệnh /anhwaifu & /riengwaifu sẽ delay 5->10s nên hãy kiên nhẫn nhé.```",
      )
      .setColor("#ef87fa")
      .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
      .setImage(
        "https://cdn.donmai.us/sample/ad/1a/__momoi_blue_archive_drawn_by_go_sai_tamanegi__sample-ad1a1d4fdeb9630ba798de757804564d.jpg",
      )
      .setTimestamp(),

    new EmbedBuilder()
      .setTitle("ʟệɴʜ ᴅùɴɢ ɴʜạᴄ - [🎵]")
      .setDescription(
        "``` !joinv | Vào voice.\n !leavev | Rời voice.\n !playnhac | Phát nhạc.\n !dungnhac | Dừng nhạc.\n !choitiep | Phát tiếp nhạc.\n !quabai | Qua bài tiếp theo.\n !laplainhac | Tắt & Bật lặp lại nhạc.\n ```",
      )
      .setColor("#ef87fa")
      .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
      .setImage(
        "https://cdn.donmai.us/sample/ad/1a/__momoi_blue_archive_drawn_by_go_sai_tamanegi__sample-ad1a1d4fdeb9630ba798de757804564d.jpg",
      )
      .setTimestamp(),

    new EmbedBuilder()
      .setTitle("ʟệɴʜ ᴅùɴɢ ɴʜạᴄ ɴʜᴀɴʜ - [🎵]")
      .setDescription(
        "``` !jv hoặc <@mention bot> joinv.\n !lv hoặc <@mention bot> leavev.\n !pn hoặc <Tên nhạc & Link nhạc.\n !dn hoặc <@mention bot> dungnhac.\n !ct hoặc <@mention bot> choitiep.\n !qb hoặc <@mention bot> quabai.\n !lln hoặc <@mention bot> laplainhac.\n ```",
      )
      .setColor("#ef87fa")
      .setFooter({ text: "© ᴄᴏᴅᴇ ʙʏ ᴀɴ ᴘᴀʜɴ 🐧" })
      .setImage(
        "https://cdn.donmai.us/sample/ad/1a/__momoi_blue_archive_drawn_by_go_sai_tamanegi__sample-ad1a1d4fdeb9630ba798de757804564d.jpg",
      )
      .setTimestamp(),

    new EmbedBuilder()
      .setTitle("ᴋếᴛ ᴛʜúᴄ - [😘]")
      .setDescription(
"• ᴄảᴍ ơɴ ᴄáᴄ ʙạɴ đã ᴅùɴɢ ʙᴏᴛ <@1180786118724177920>\n \n```• ᴛᴜʏ ᴄʜỉ ʟà ʙᴏᴛ ᴛʜử ɴɢʜɪệᴍ ᴠà ᴄòɴ ɴʜɪềᴜ ᴛʜɪếᴜ sóᴛ ᴄũɴɢ ɴʜư ᴍᴏɴɢ ᴍọɪ ɴɢườɪ ʙỏ ǫᴜᴀ!\n• ʟờɪ ᴄᴜốɪ ᴄùɴɢ ᴄũɴɢ ɴʜư ʟà ʟờɪ ᴄảᴍ ơɴ đếɴ ᴍọɪ ɴɢườɪ đã ᴛɪɴ ᴛưởɴɢ ᴠà ᴄũɴɢ ɴʜư ʟà ᴅùɴɢ ʙᴏᴛ! ```",
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