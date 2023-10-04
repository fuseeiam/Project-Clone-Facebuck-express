const Joi = require('joi');

const checkUserIdShema = Joi.object({
    userId: Joi.number().integer().positive().required()
});

exports.checkUserIdShema = checkUserIdShema;