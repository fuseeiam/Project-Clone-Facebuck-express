const fs = require('fs/promises');

const createError = require('../utils/create-error');
const { upload } = require('../utils/cloudinary-service')
const prisma = require('../models/prisma');
const { checkUserIdSchema } = require('../validators/user-validator');
const { AUTH_USER, UNKNOWN, STATUS_ACCEPTED, FRIEND, RECEIVER, REQUEST } = require('../config/constants');

const getTargetUserStatusWithAuthUser = async (targetUserId, authUserId) => {
    if (targetUserId === authUserId) {
        return AUTH_USER;
    }
    const relationship = await prisma.friend.findFirst({
        where: {
            OR: [
                { requesterId: targetUserId, receiverId: authUserId },
                { requesterId: authUserId, receiverId: targetUserId }
            ]
        }
    });

    if (!relationship) {
        return UNKNOWN;
    }

    if (relationship.status === STATUS_ACCEPTED) {
        return FRIEND;
    }

    if (relationship.requesterId === authUserId) {
        return REQUESTER;
    }
    return RECEIVER;
};

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
        const { error } = checkUserIdSchema.validate(req.params);
        if (error) {
            return next(error);
        }

        const userId = +req.params.userId;
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        let status = null;
        if (user) {
            delete user.password;
            status = await getTargetUserStatusWithAuthUser(userId, req.user.id);
        }

        // if (req.user.id === userId) {
        //     status = AUTH_USER;
        // } else {
        //     // userId 2
        //     // auth user id : req.user.id
        //     const relationship = await prisma.friend.findFirst({
        //         where: {
        //             OR: [
        //                 { requesterId: userId, receiverId: req.user.id },
        //                 { requesterId: req.user.id, receiverId: userId }
        //             ]
        //         }
        //     });

        //     if (!relationship) {
        //         status = UNKNOWN;
        //     }
        //     if (relationship.status === STATUS_ACCEPTED) {
        //         status = FRIEND;
        //     }

        //     if (relationship.requesterId === targetUserId) {
        //         return REQUEST
        //     }
        //     return RECEIVER;
        // };


        res.status(200).json({ user, status });
    } catch (err) {
        next(err)
    }
};