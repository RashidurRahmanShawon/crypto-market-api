const alert = require('../engine');

const getMarketData = async (req, res, next) =>{
    try{
        const  reqCoin = req.params.coin;
        const reqCurrency = (req.query.currency || 'usd').toLowerCase();

        const report = await alert(reqCoin, reqCurrency);
        res.json(report);
    } catch (err) {
        next(err);
    }
};

const calculateThreshold = async  (req, res, nect) =>{
    try{
        const {coin, targetPrice, currency} = req.body;
        const reqCoin  = coin.toLowerCase();
        const reqCurrency = (currency || 'usd').toLowerCase();
        
        console.log(`[POST API] Received threshold alert request for ${coin} with target price ${targetPrice} ${currency || 'usd'}`);
        const currentMarketData = await  alert(reqCoin, reqCurrency);
        const currentPrice = currentMarketData.price;
        const priceDifference = currentPrice - targetPrice;
        const ifTargetReached = currentPrice >= targetPrice;
        res.json({
            success: true,
            asset: reqCoin,
            currency: reqCurrency,
            currentMarketPrice:  currentPrice,
            userTargetPrice: targetPrice,
            alertTriggered: ifTargetReached,
            message: ifTargetReached
            ?`🎉 Target reached! ${coin} is now at ${currentPrice} ${reqCurrency}, which is above your target of ${targetPrice} ${reqCurrency}.`
            : `⚠️ Target not reached. ${coin} is at ${currentPrice} ${reqCurrency}, below your target of ${targetPrice} ${reqCurrency}.`
        });
    } catch (err) {
        next(err);
    }
};

module.exports =  {
    getMarketData,
    calculateThreshold
}