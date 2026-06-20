const Alert = require('../models/Alert');
const alert = require('../engine');

async function checkThresholds(){
    console.log(`[BACKGROUND WORKER]: Scanning database for active alert targets...`);
    try{
        const saveAlerts = await Alert.findAll();
        if(saveAlerts.length === 0){
            console.log(`[BACKGROUND WORKER]: No active alerts found in the database.`);
            return;
        }

        for(const item of saveAlerts){
            console.log(`[BACKGROUND WORKER]: Checking alert for ${item.coin} with target price ${item.targetPrice} ${item.currency}...`);
            const currentMaketData = await alert(item.coin, item.currency);
            const currentPrice = currentMaketData.price;
            const target = item.targetPrice;

            if(currentPrice >= target){
                console.log(`[ALERT TRIGGERED] 🎉 ${item.coin} has reached the target price of ${target} ${item.currency}. Current price: ${currentPrice} ${item.currency}.`);
            }else{
                console.log(`[ALERT CHECK] ${item.coin} is still below the target price. Current price: ${currentPrice} ${item.currency}, Target price: ${target} ${item.currency}.`);
            }
        }
    } catch (err) {
        console.error(`[WORKER ERROR]: ${err.message}`);
    }
}

function startWorker(intervalTime = 60000){
    setInterval(checkThresholds, intervalTime);
}

module.exports = startWorker;