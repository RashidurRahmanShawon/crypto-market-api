const alert = require('../engine');
const Alert = require('../models/Alert');

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

const calculateThreshold = async  (req, res, next) =>{
    try{
        const {coin, targetPrice, currency} = req.body;
        const reqCoin  = coin.toLowerCase();
        const reqCurrency = (currency || 'usd').toLowerCase();
        
        const saveAlert = await Alert.create({
            coin: reqCoin,
            targetPrice: targetPrice,
            currency: reqCurrency
        });
        console.log(`[DATABASE] Saved alert for ${reqCoin} at target price ${targetPrice} ${reqCurrency}`);
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

const getAlertHistory = async (req, res, next) =>{
    try{
        const history = await Alert.findAll();
        res.json({
            success : true,
            count: history.length,
            data: history
        });
    } catch (err){
        next(err);
    }
}

const deleteAlert = async (req, res, next) =>{
    try{
        const {id} = req.params;
        const rowDeleted = await Alert.destroy({where:{id: id}});
        if(!rowDeleted){
            const error = new Error(`Alert with id ${id} not found`);
            error.statusCode = 404;
            throw error;
        }
        console.log(`[DATABASE] Deleted alert with id ${id}`);
        res.json({
            success: true,
            message: `Alert with id ${id} has been deleted`
        });
    } catch (err){
        next(err);
    }
};

module.exports =  {
    getMarketData,
    calculateThreshold,
    getAlertHistory,
    deleteAlert
}