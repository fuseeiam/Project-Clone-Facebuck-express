const fs = require('fs/promises');

const createError = require('../utils/create-error');
const { upload } = require('../utils/cloudinary-service')
const prisma = require('../models/prisma');
const { checkUserIdShema } = require('../validators/user-validator');

exports.updateProfile = async (req, res, next) => {
    try {
        // if (!req.file.profileImage)
        //     console.log(req.files)
        if (!req.files) {
            console.log(req.files);
            return next(createError('profile image or cover image is required'))
        }

        const response = {};

        if (req.files.profileImage) {
            const url = await upload(req.files.profileImage[0].path);
            response.profileImage = url;
            await prisma.user.update({
                data: {
                    profileImage: url
                },
                where: {
                    id: req.user.id
                }
            });

        }

        if (req.files.coverImage) {
            const url = await upload(req.files.coverImage[0].path);
            response.coverImage = url;
            await prisma.user.update({
                data: {
                    coverImage: url
                },
                where: {
                    id: req.user.id
                }
            });
        }

        res.status(200).json(response);
    } catch (err) {
        next(err);
    } finally {
        if (req.files.profileImage) {
            fs.unlink(req.files.profileImage[0].path);
        }
        if (req.files.coverImage) {
            fs.unlink(req.files.coverImage[0].path);
        }
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const { error } = checkUserIdShema.validate(req.params);
        if (error) {
            return next(error);
        }

        const userId = +req.params.userId;
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (user) {
            delete user.password;
        }
        res.status(200).json({ user });
    } catch (err) {
        next(err)
    }
};