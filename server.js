require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/database');
app.use(express.json());
app.use((req, res, next)=>{
    const currentTimeStamp = new Date().toISOString();
    const httpMethod = req.method;
    const requestedPath = req.url;
    console.log(`[TRAFFIC LOG] [${currentTimeStamp}] ${httpMethod} request to ${requestedPath}`);
    next();
});

const port = process.env.PORT;
const marketRouter = require('./routes/market');

app.use('/api/market', marketRouter);

app.get('/', async (req, res) =>{
    res.send('Moduler MultiFile API is online. Please visit api/market/ for alert');
});

app.use((err, req, res, next) =>{
    console.log(`[GLOBAL ERROR CATCH]: ${err.message}`);
    const statusCode = err.StatusCode || 500;
    res.status(statusCode).json({
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
})

.catch((err) =>{
    console.log(`[DATABASE ERROR]: ${err.message}`);
})