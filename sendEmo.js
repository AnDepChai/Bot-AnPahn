// Xuất hàm sendEmo
exports.sendEmo = function (message, allowedChannels) {
    if (!message) {
        throw new Error("Ok");
    }
    // Kiểm tra nếu tin nhắn xuất phát từ một trong các kênh được phép
    if (!allowedChannels.includes(message.channel.id)) {
        // Nếu không phải kênh được phép, không làm gì cả
        return;
    }
    // Kiểm tra nếu tin nhắn có chứa ảnh
    if (message.attachments.size > 0) {
        // Thả emoji :_pepe_yes: vào tin nhắn
        message.react('<:_pepe_yes:1239156742605242388>');
        // Thả emoji :_pepe_no: vào tin nhắn
        message.react('<:_pepe_no:1239156779309465611>');
    }
};