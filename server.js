require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/database');
const startAlertChecker = require('./worker/alertWorker');
app.use(express.json());
app.use(express.static('public'));
app.use((req, res, next)=>{
    const currentTimeStamp = new Date().toISOString();
    const httpMethod = req.method;
    const requestedPath = req.url;
    console.log(`[TRAFFIC LOG] [${currentTimeStamp}] ${httpMethod} request to ${requestedPath}`);
    next();
});

const port = process.env.PORT;
const marketRouter = require('./routes/market');
const authRouter = require('./routes/auth');

app.use('/api/market', marketRouter);
app.use('/api/auth', authRouter);


app.use((err, req, res, next) =>{
    console.log(`[GLOBAL ERROR CATCH]: ${err.message}`);
    const StatusCode = err.StatusCode || 500;
    res.status(StatusCode).json({
        success: false,
        error: err.message || 'An unexpected error occurred',
        timeStamp: new Date().toISOString()
    });
});

db.sync({force: false})
.then(()=>{
    console.log('[DATABASE]: Connected successfully.');
    app.listen(port, () =>{
        console.log(`[SERVER]: Running on port ${port}`);
    })

    startAlertChecker(30000);
})

.catch((err) =>{
    console.log(`[DATABASE ERROR]: ${err.message}`);
})