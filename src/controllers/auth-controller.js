const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../validators/auth-validator');
const prisma = require('../models/prisma');
const createError = require("../utils/create-error");

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
        delete user.password;
        res.status(201).json({ accessToken });
    } catch (error) {
        next(error);
    }
};
exports.login = async (req, res, next) => {
    try {
        const { value, error } = loginSchema.validate(req.body);
        if (error) {
            // error.statusCode = 400
            return next(error);
        }
        //select * from user where email = emailOrMobile OR M=mobile = emailOrMobile
        //findFirst return Obj

        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: value.emailOrMobile }, { mobile: value.emailOrMobile }]
            }
        });
        if (!user) {
            //create function to throw errorMiddleware instread of res.status(400).json({msg:'invalid'})
            return next(createError('invalid credential', 400));
            //next(error)
        }
        const isMatch = await bcrypt.compare(value.password, user.password);
        if (!isMatch) {
            return next(createError('invalid credential', 400));
        }

        const payload = { userId: user.id };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY || 'jhjfdgiwgcbssjgqaz',
            {
                expiresIn: process.env.JWT_EXPIRE
            });
        delete user.password;
        res.status(200).json({ accessToken, user });
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    res.status(200).json({ user: req.user });
}