require('dotenv').config();
const axios = require('axios');

async function alert(coinId, currency){
    console.log(`[NETWORK] Fetching the data for : ${coinId}...`);
        const baseurl = process.env.URL;
        const url = `${baseurl}?ids=${coinId}&vs_currencies=${currency}`;
        const response = await axios.get(url);
        const data = response.data;
        if(!data[coinId]){
            throw new Error(`The asset ${coinId} is not found on global exchanges. Please check the asset name and try again.`);
        }
        const coinprice = data[coinId][currency];
       return{
        coin: coinId,
        price: coinprice,
        timestamp: new Date()
       }
}

module.exports = alert;