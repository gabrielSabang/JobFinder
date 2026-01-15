import { Router } from 'express';
import { createPost, getPosts } from '../controller/blogPost.controller.js';

const router = Router();

router.post('/', createPost);
router.get('/', getPosts);

export default router;