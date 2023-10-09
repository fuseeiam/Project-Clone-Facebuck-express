const express = require('express');

const authenticateMiddleware = require('../middlewares/authenticated');
const uploadMiddleware = require('../middlewares/upload');
const postController = require('../controllers/post-controller');
const likeController = require('../controllers/like-controller');

const router = express.Router();

router.post('/',
    authenticateMiddleware,
    uploadMiddleware.single('image'),
    postController.createPost
);

router.get(
    '/friend',
    authenticateMiddleware,
    postController.getAllPostIncludeFriendPost
);

router.post('/:postId/like', authenticateMiddleware, likeController.togglelike);
router.delete('/:postId', authenticateMiddleware, postController.deletePost);

module.exports = router;