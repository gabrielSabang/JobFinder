import { Router } from 'express';
import { userSignUp, userLogin, userLogout, getUser, getMe } from '../controller/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/signup', userSignUp);
router.post('/login', userLogin);
router.post('/logout', protect, userLogout);
router.get('/me', protect, getMe);
router.get('/:userName', getUser);

export default router;