import Message from '../models/Message.js';
import { getCache, setCache, clearCachePattern } from '../config/redis.js';
import { createFallbackMessage, listFallbackMessages, isFallbackMode } from '../config/fallbackStore.js';

export const sendMessage = async (req, res) => {
  const senderId = req.user?._id || req.user;
  if (!senderId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { receiver, content } = req.body;

    if (!receiver || !content) {
      return res.status(400).json({ message: 'Receiver and content are required' });
    }

    let message;
    if (isFallbackMode()) {
      message = await createFallbackMessage({ sender: senderId, receiver, content });
    } else {
      message = await Message.create({
        sender: senderId,
        receiver,
        content,
      });
    }

    const sortedUserIds = [senderId, receiver].sort();
    const cachePattern = `messages:${sortedUserIds[0]}:${sortedUserIds[1]}:*`;
    await clearCachePattern(cachePattern);

    return res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ message: 'Server error while sending message.' });
  }
};


export const getMessage = async (req, res) => {
  const userId = req.user?._id || req.user;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { withUserId } = req.params;
    if (!withUserId) {
      return res.status(400).json({ message: "withUserId parameter not found" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Create a consistent cache key by sorting the two user IDs
    const sortedUserIds = [userId, withUserId].sort();
    const cacheKey = `messages:${sortedUserIds[0]}:${sortedUserIds[1]}:${page}:${limit}`;

    const cachedMessages = await getCache(cacheKey);
    if (cachedMessages) {
      console.log(`Cache hit for messages between ${userId} and ${withUserId}`);
      return res.status(200).json({ messages: cachedMessages, page, limit });
    }

    let messages;
    let totalMessages;
    if (isFallbackMode()) {
      messages = await listFallbackMessages(userId, withUserId);
      totalMessages = messages.length;
    } else {
      messages = await Message.find({
        $or: [
          { sender: userId, receiver: withUserId },
          { sender: withUserId, receiver: userId },
        ],
      }).populate('sender', 'userName email').populate('receiver', 'userName email').sort({ createdAt: -1 }).skip(skip).limit(limit);

      totalMessages = await Message.countDocuments({
        $or: [
          { sender: userId, receiver: withUserId },
          { sender: withUserId, receiver: userId },
        ],
      });
    }

    await setCache(cacheKey, messages, 3600);
    return res.status(200).json({ messages, totalMessages, page, limit });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ message: 'Server error while fetching messages.' });
  }
}