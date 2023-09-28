const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerSchema } = require('../validators/auth-validator');
const prisma = require('../models/prisma');

exports.register = async (req, res, next) => {
    try {
        const { value, error } = registerSchema.validate(req.body);

        if (error) {
            return next(error);
        }
        // await prisma.user.create({
        //     data:{
        //         firstName, 
        //         lastName, 
        //         email:null,
        //         Mobile : value.emailOrMobile, 
        //         password 
        //     }
        // })
        value.password = await bcrypt.hash(value.password, 12);
        // console.log('1', value, error);
        const user = await prisma.user.create({
            data: value
        });
        // console.log('2');
        const payload = { userId: user.id };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY || 'jhjfdgiwgcbssjgqaz', {
            expiresIn: process.env.JWT_EXPIRE
        });
        res.status(201).json({ accessToken });
    } catch (error) {
        next(error);
    }
};
exports.login = async (req, res, next) => {
    try {
        // const {value , error} = loginSchema.validate(req.body);
        //   if (error){}
    } catch (error) {
        next(err);
    }
};