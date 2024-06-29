const axios = require('axios');

const API_URL = 'https://api.waifu.pics/sfw/waifu';

async function getRandomWaifuImage() {
    try {
        const response = await axios.get(API_URL);
      
        const imageUrl = response.data.url;
        return imageUrl;
    } catch (error) {
        console.error('Lỗi khi lấy ảnh ngẫu nhiên:', error);
        return null;
    }
}

module.exports = {
    getRandomWaifuImage,
};