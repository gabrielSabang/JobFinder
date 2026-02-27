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

dotenv.config();
const app = express();
const server = http.createServer(app)

const PORT = parseInt(process.env.PORT) || 8000;

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
    // Allow requests from localhost on any port during development
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
      const message = await Message.create({
        sender,
        receiver,
        content,
      });
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

db_connection()
  .then(() => {
    console.log('Connected to Database');

    const startServer = (port) => {
      server.listen(port, () => {
        console.log(`Server running on port ${port}`);
      }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is busy, trying ${port + 1}...`);
          startServer(port + 1);
        } else {
          console.error('Server error:', err);
        }
      });
    };

    startServer(PORT);
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
