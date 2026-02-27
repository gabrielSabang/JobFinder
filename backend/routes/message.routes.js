import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { messageRateLimiter } from '../middleware/rateLimiter.middleware.js';
import { sendMessage, getMessage } from '../controller/message.controller.js';

const router = Router();

router.post('/', protect, messageRateLimiter, sendMessage);
router.get('/:withUserId', protect, getMessage);

export default router;