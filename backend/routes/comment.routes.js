import { Router } from 'express';
import { createComment, getCommentsByPost } from '../controller/comment.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { commentRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

router.post('/', protect, commentRateLimiter, createComment);
router.get('/:postId', getCommentsByPost);

export default router;