import { Router } from 'express';
import { createComment, getCommentsByPost } from '../controller/comment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', protect, createComment);
router.get('/:postId', getCommentsByPost);

export default router;