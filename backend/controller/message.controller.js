import Message from '../models/Message.js';

export const sendMessage = async (req, res) => {
  const senderId = req.user;
  if (!senderId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { receiver, content } = req.body;

    if (!receiver || !content) {
      return res.status(400).json({ message: 'Receiver and content are required' });
    }

    const message = await Message.create({
      sender: senderId,
      receiver,
      content,
    });


    return res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ message: 'Server error while sending message.' });
  }
};