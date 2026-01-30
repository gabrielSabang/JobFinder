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
import { authenticateToken } from './middleware/auth.middleware.js';

dotenv.config();
const app = express();
const server = http.createServer(app)

const PORT = process.env.PORT || 8000;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], 
  }
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));

app.use('/api/users', userRoutes); 
app.use('/api/posts', authenticateToken, blogPostRoutes);
app.use('/api/comments', authenticateToken, commentRoutes);
app.use('/api/messages', authenticateToken, messageRoutes);

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

db_connection()
  .then(() => {
    console.log('Connected to Database');

    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
