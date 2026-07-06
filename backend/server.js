import express from 'express';
import dotenv from 'dotenv';
import http from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io'

import { db_connection } from './config/db.connection.js';
import userRoutes from './routes/user.routes.js';
import blogPostRoutes from './routes/blogPost.routes.js';
import commentRoutes from './routes/comment.routes.js';
import messageRoutes from './routes/message.routes.js';
import Message from './models/Message.js';
import { authenticateToken } from './middleware/auth.middleware.js';
import { setFallbackMode, createFallbackMessage, isFallbackMode } from './config/fallbackStore.js';

dotenv.config();
const app = express();
const server = http.createServer(app)

const PORT = parseInt(process.env.PORT) || 8000;
const HOST = process.env.HOST || '127.0.0.1';

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], 
  }
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use(cors({
  origin: (origin, callback) => {
   
    if (!origin || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use('/api/users', userRoutes); 
app.use('/api/posts', authenticateToken, blogPostRoutes);
app.use('/api/comments', authenticateToken, commentRoutes);
app.use('/api/messages', authenticateToken, messageRoutes);

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('sendMessage', async (data) => {
    const { sender, receiver, content } = data;
    try {
      let message;
      if (isFallbackMode()) {
        message = await createFallbackMessage({ sender, receiver, content });
      } else {
        message = await Message.create({
          sender,
          receiver,
          content,
        });
      }
      io.to(receiver).emit('receiveMessage', message);
      io.to(sender).emit('messageSent', message);
    } catch (error) {
      console.error('Error sending message via socket:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const startServer = (port) => {
  try {
    server.listen(port, HOST, () => {
      console.log(`Server running on http://${HOST}:${port}`);
    });
  } catch (err) {
    console.error('Server error:', err);
  }
};

const initializeServer = async () => {
  try {
    await db_connection();
    console.log('Connected to Database');
  } catch (error) {
    console.warn('Database connection failed, running in fallback mode:', error.message);
    setFallbackMode(true);
  }

  startServer(PORT);
};

initializeServer();
