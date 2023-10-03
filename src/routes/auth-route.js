const express = require('express')
const authController = require('../controllers/auth-controller');
const authenticatedMiddleware = require('../middlewares/authenticated');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
// router.use(authenticatedMiddleware); เขียนแยกได้ หรือถ้า path เดียวกัน สามารถใช้ร่วมกันได้
router.get('/me', authenticatedMiddleware, authController.getMe);

module.exports = router;
