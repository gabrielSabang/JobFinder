import { Router } from 'express';
import { createPost, getPosts } from '../controller/blogPost.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', protect, createPost);
router.get('/', protect, getPosts);

export default router;