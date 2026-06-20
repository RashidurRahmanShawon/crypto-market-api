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
const marketRouter = require('./routes/market');

app.use('/api/market', marketRouter);

app.get('/', async (req, res) =>{
    res.send('Moduler MultiFile API is online. Please visit api/market/ for alert');
});



app.listen(port, () =>{
    console.log(`[SERVER] Server is running on port ${port}`);
});