const express = require('express');

const userController = require('../controllers/user-controller');
const authenticatedMiddleware = require('../middlewares/authenticated');
const uploadMiddleware = require('../middlewares/upload')

const router = express.Router();

router.patch('/', authenticatedMiddleware,
    // uploadMiddleware.single('qwerty'),
    uploadMiddleware.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 }]),
    userController.updateProfile
);

router.get('/:userId', authenticatedMiddleware, userController.getUserById);

module.exports = router;