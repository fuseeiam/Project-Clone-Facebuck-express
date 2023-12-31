const Joi = require('joi');

const checkUserIdSchema = Joi.object({
    userId: Joi.number().integer().positive().required()
});

exports.checkUserIdSchema = checkUserIdSchema;

const checkReceiverIdSchema = Joi.object({
    receiverId: Joi.number().integer().positive().required()
});

exports.checkReceiverIdSchema = checkReceiverIdSchema;

const checkRequestIdSchema = Joi.object({
    requesterId: Joi.number().integer().positive().required()
});

exports.checkRequestIdSchema = checkRequestIdSchema;

const checkFriendIdSchema = Joi.object({
    friendId: Joi.number().integer().positive().required()
});

exports.checkFriendIdSchema = checkFriendIdSchema