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
        value: "``` /opentxt Bật & Tắt Text\n !dungbot Tắt bot ```",
      },
      {
        name: "Văn bản: 💬",
        value:
          "``` • chào, avatar wibu, chó, thằng Otaku, ai hỏi, gà, thằng gà, quê, bạn là nhất, rick roll... (Ví dụ: chào), ```",
      },
      {
        name: "Lệnh: ❗",
        value:
          "``` !avatar | Lấy avatar.\n !info | Kiểm tra info.\n !anhwaifu | Gửi ảnh anime.\n !riengwaifu | Gửi ảnh anime riêng\n - Lưu ý: lệnh !anhwaifu & !riengwaifu sẽ delay 5->10s nên hãy kiên nhẫn nhé.```",
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