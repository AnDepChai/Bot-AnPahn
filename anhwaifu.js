const axios = require('axios');

// Địa chỉ API của waifu.pics
const API_URL = 'https://api.waifu.pics/sfw/waifu';

// Hàm lấy ảnh ngẫu nhiên từ API
async function getRandomWaifuImage() {
    try {
        // Gửi yêu cầu GET tới API
        const response = await axios.get(API_URL);

        // Lấy URL của ảnh từ phản hồi của API
        const imageUrl = response.data.url;
        return imageUrl;
    } catch (error) {
        console.error('Lỗi khi lấy ảnh ngẫu nhiên:', error);
        return null;
    }
}

// Xuất hàm getRandomWaifuImage để sử dụng trong các tập tin khác
module.exports = {
    getRandomWaifuImage,
};