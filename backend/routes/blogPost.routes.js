import { Router } from 'express';
import { createPost, getPosts, getPost, getPostsByUser, searchPosts, getAllPostsExceptOwn } from '../controller/blogPost.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { postRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

router.post('/', protect, postRateLimiter, createPost);
router.get('/', protect, getPosts);
router.get('/all', protect, getAllPostsExceptOwn);
router.get('/:id', protect, getPost);
router.get('/user/:userName', protect, getPostsByUser);
router.get('/search', protect, searchPosts);

export default router;