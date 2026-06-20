require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use((req, res, next)=>{
    const currentTimeStamp = new Date().toISOString();
    const httpMethod = req.method;
    const requestedPath = req.url;
    console.log(`[TRAFFIC LOG] [${currentTimeStamp}] ${httpMethod} request to ${requestedPath}`);
    next();
});

const port = process.env.PORT;
const alert = require('./engine');

app.get('/', async (req, res) =>{
    res.send('Moduler MultiFile API is online. Please visit api/market/ for alert');
});

app.get('/api/market/:coin', async (req, res) =>{
    console.log('[API] Received request for market alert');
    try{
        const reqCoin = req.params.coin;
        const currency = (req.query.currency || 'usd').toLowerCase();
        console.log(`[API] Fetching market alert for: ${reqCoin}`);
        const alertdata = await alert(reqCoin, currency);
        res.json(alertdata);
    } catch(err){
        console.log('[ERROR]:', err.message);
        res.status(500).json({error: err.message});
    }
});

app.post('/api/alerts/threshold', async (req, res)=>{
    try{
        const {coin, targetPrice, currency} = req.body;
        console.log(`[POST API] Received threshold alert request for ${coin} with target price ${targetPrice} ${currency || 'usd'}`);
        const reqCoin = coin.toLowerCase();
        const reqCurrency = (currency || 'usd').toLowerCase();
        const currentMarketData = await alert(reqCoin, reqCurrency);
        const currentPrice = currentMarketData.price;
        const priceDifference = currentPrice - targetPrice;
        const ifTargetReached = currentPrice >= targetPrice;

        res.json({
            success: true,
            asset: coin,
            currentMarketPrice:  currentPrice,
            userTargetPrice: targetPrice,
            alertTriggered: ifTargetReached,
            message: ifTargetReached
            ? `🎉 Target reached! ${coin} is now at ${currentPrice} ${reqCurrency}, which is above your target of ${targetPrice} ${reqCurrency}.`
            : `⚠️ Target not reached. ${coin} is at ${currentPrice} ${reqCurrency}, below your target of ${targetPrice} ${reqCurrency}.`
        });
    } catch(err){
        console.log('[POST ERROR]:', err.message);
        res.status(500).json({error: err.message});
    }
});

app.listen(port, () =>{
    console.log(`[SERVER] Server is running on port ${port}`);
});