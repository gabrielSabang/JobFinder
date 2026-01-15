import { Router } from 'express';
import { userSignUp, userLogin } from '../controller/user.controller.js';

const router = Router();

router.post('/signup', userSignUp);
router.post('/login', userLogin);

export default router;