const { EmbedBuilder } = require("discord.js");

const cooldowns = {};
const cooldownTime = 60000; // 60 giây

async function handleCooldown(message, fileContents) {
    if (message.author.bot) return;

    const userId = message.author.id;
    const content = message.content.toLowerCase().trim();
    const now = Date.now();
    const lastTime = cooldowns[userId];

    if (content in fileContents) {
        if (lastTime && now - lastTime < cooldownTime) {
            const remainingTime = cooldownTime - (now - lastTime);
            const remainingSeconds = Math.ceil(remainingTime / 1000);

              const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('ᴛʜờɪ ɢɪᴀɴ ʜồɪ ᴛᴇxᴛ:')
                .setDescription(`ʙạɴ ᴄầɴ đợɪ ${remainingSeconds} ɢɪâʏ ᴛʀướᴄ ᴋʜɪ sử ᴅụɴɢ ʟạɪ ᴛᴇxᴛ.`);

            const sentMessage = await message.reply({ embeds: [embed] });

            let count = remainingSeconds;

            const interval = setInterval(async () => {
                count--;
                embed.setDescription(`ʙạɴ ᴄầɴ đợɪ ${count} ɢɪâʏ ᴛʀướᴄ ᴋʜɪ sử ᴅụɴɢ ʟạɪ ᴛᴇxᴛ.`);
                await sentMessage.edit({ embeds: [embed] });

                if (count <= 0) {
                    clearInterval(interval);
                    embed.setDescription('ʙạɴ ᴄó ᴛʜể sử ᴅụɴɢ ʟạɪ ᴛᴇxᴛ ✅.');
                    await sentMessage.edit({ embeds: [embed] });
                }
            }, 1000); // Cập nhật mỗi giây

            return;
        }

            const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('ᴛɪɴ ɴʜắɴ ᴛᴇxᴛ:')
            .setDescription(fileContents[content]);

        message.channel.send({ embeds: [embed] });
        cooldowns[userId] = now;
    }
}

module.exports = handleCooldown;