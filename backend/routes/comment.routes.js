import { Router } from 'express';
import { createComment, getCommentsByPost } from '../controller/comment.controller.js';

const router = Router();

router.post('/', createComment);
router.get('/:postId', getCommentsByPost);

export default router;