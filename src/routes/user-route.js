const express = require('express');

const userController = require('../controllers/user-controller');
const authenticatedMiddleware = require('../middlewares/authenticated');
const uploadMiddleware = require('../middlewares/upload')

const router = express.Router();

router.patch('/', authenticatedMiddleware,
    uploadMiddleware.single('qwerty'),
    userController.updateProfile
);

module.exports = router;