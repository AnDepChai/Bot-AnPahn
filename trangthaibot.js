function setBotStatus(client) {
  
    client.on("ready", () => {
  client.user.setStatus("dnd");
  client.user.setActivity("với An Pahn! | /Help", { Type: 'PLAYING'});
 });
}

module.exports = setBotStatus;
