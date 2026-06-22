const User = require('../models/User');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res, next) =>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            const error = new Error('Email and Password are required');
            error.StatusCode = 400;
            throw error;
        }

        const userExists = await User.findOne({where: {email}});
        if(userExists){
            const error = new Error('User with this email already exists');
            error.statusCode = 409;
            throw error;
        }

        const hashePassword = await bcrypt.hash(password, 10);
        
        const newUser = await User.create({
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: newUser.id
        });
    } catch (err){
        next(err);
    }
};

module.exports = {
    registerUser
}