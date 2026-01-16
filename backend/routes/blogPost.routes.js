import { Router } from 'express';
import { createPost, getPosts } from '../controller/blogPost.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { postRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

router.post('/', protect, postRateLimiter, createPost);
router.get('/', protect, getPosts);

export default router;