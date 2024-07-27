exports.sendEmo = function (message, allowedChannels) {
    if (!message) {
        throw new Error("Ok");
    }
    if (!allowedChannels.includes(message.channel.id)) {
        return;
    }
    if (message.attachments.size > 0) {
        // Thả emoji vào kênh
        message.react('<:_pepe_yes:1239156742605242388>');
        // Thả emoji vào kênh
        message.react('<:_pepe_no:1239156779309465611>');
    }
};
