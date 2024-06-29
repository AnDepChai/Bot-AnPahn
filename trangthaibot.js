/*function setBotStatus(client) {
  
    client.on("ready", () => {
  client.user.setStatus("dnd");
  client.user.setActivity("với An Pahn! | /Help", { Type: 'PLAYING'});
 });
}

module.exports = setBotStatus;
*/
const {
  ActivityType
} = require("discord.js");

function setBotStatus(client) {
    const statuses = [
        { type: ActivityType.Playing, text: "với An Pahn! | /Help" },
        { type: ActivityType.Watching, text: "An Pahn! Code | /Help" },
        { type: ActivityType.Listening, text: "An Pahn Hát! | /Help" },
      { type: ActivityType.Playing, text: "Genshin Impact! | /Help" },
    ];

    let currentIndex = 0;

    function updateActivity() {
        const status = statuses[currentIndex];
        client.user.setActivity(status.text, { type: status.type });

        currentIndex = (currentIndex + 1) % statuses.length;
    }

    client.on('ready', () => {
        client.user.setStatus("dnd");
        updateActivity();
        setInterval(updateActivity, 5 * 60 * 1000); // 5 phút cập nhật 1 lần
    });
}

module.exports = setBotStatus;
//5 * 60 * 1000 | 5 phút
//10 * 1000 | 10 giây