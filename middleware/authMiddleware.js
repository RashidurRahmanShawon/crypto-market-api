const jwt = require('jsonwebtoken');

const  protectRoute = (req, res, next) => {
    try{
        const authHeader  = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('bearer ')){
            const error = new Error('Access denied. No authentication token provided.');
            error.statusCode = 401;
            throw error;
        }

        const token = authHeader.split(' ')[1];
        const secretKey = process.env.JWT_SECRET || 'fallback_crypto_secret_signature_key';
        const decoded = jwt.verify(token, secretKey);
        req.user = deocodedPlayload;
        next();
    } catch (err){
        console.log(`[AUTH MIDDLEWARE ERROR]: ${err.message}`);
        if(err.name === 'jsonWebTokenError'){
            err.statusCode = 401;
            err.message = 'Authentication failed. Token is invalid or expired.';
        }
        next(err);
    }
};

module.exports = protectRoute;