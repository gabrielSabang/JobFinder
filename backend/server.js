import express from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'

import { db_connection } from './config/db.connection.js';

import userRoutes from './routes/user.routes.js';
import blogPostRoutes from './routes/blogPost.routes.js';
import commentRoutes from './routes/comment.routes.js';

dotenv.config();

const app = express();
const server = http.createServer(app)

const PORT = process.env.PORT || 5000;

const io = new Server(server, {
  cors: {
    origin: "*", 
  }
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.use('/api/users', userRoutes);
app.use('/api/posts', blogPostRoutes);
app.use('/api/comments', commentRoutes);

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