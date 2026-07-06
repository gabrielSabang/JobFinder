import crypto from 'crypto';
import bcrypt from 'bcrypt';

const users = new Map();
const posts = new Map();
const comments = new Map();
const messages = new Map();

let fallbackMode = false;

export const setFallbackMode = (value) => {
  fallbackMode = value;
};

export const isFallbackMode = () => fallbackMode;

const normalizeUser = (user) => ({
  ...user,
  _id: user._id,
  userName: user.userName,
  email: user.email,
  role: user.role || 'user',
  isActive: user.isActive !== false,
  createdAt: user.createdAt || new Date().toISOString(),
});

export const createFallbackUser = async ({ userName, email, password }) => {
  const existing = Array.from(users.values()).find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    const error = new Error('Email is already registered.');
    error.code = 11000;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const id = crypto.randomUUID();
  const user = {
    _id: id,
    userName,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: 'user',
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  users.set(id, user);
  return normalizeUser(user);
};

export const getFallbackUserByEmail = async (email) => {
  const user = Array.from(users.values()).find((entry) => entry.email.toLowerCase() === email.toLowerCase());
  return user ? normalizeUser(user) : null;
};

export const getFallbackUserById = async (id) => {
  const user = users.get(id);
  return user ? normalizeUser(user) : null;
};

export const getFallbackUserByUserName = async (userName) => {
  const user = Array.from(users.values()).find((entry) => entry.userName.toLowerCase() === userName.toLowerCase());
  return user ? normalizeUser(user) : null;
};

export const searchFallbackUsers = async (query = '') => {
  const search = query.trim().toLowerCase();
  const list = Array.from(users.values()).map(normalizeUser);
  if (!search) {
    return list.slice(0, 50);
  }
  return list.filter((user) => user.userName.toLowerCase().includes(search) || user.email.toLowerCase().includes(search)).slice(0, 10);
};

export const createFallbackPost = async ({ title, content, tags = [], author }) => {
  const post = {
    _id: crypto.randomUUID(),
    title,
    content,
    tags,
    author,
    createdAt: new Date().toISOString(),
  };
  posts.set(post._id, post);
  return post;
};

export const getFallbackPostById = async (id) => {
  return posts.get(id) || null;
};

export const listFallbackPosts = async ({ authorId, exceptAuthorId, page = 1, limit = 10 }) => {
  const startIndex = (page - 1) * limit;
  const postList = Array.from(posts.values())
    .filter((post) => !authorId || post.author === authorId)
    .filter((post) => !exceptAuthorId || post.author !== exceptAuthorId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return {
    posts: postList.slice(startIndex, startIndex + limit),
    totalPosts: postList.length,
    page,
    limit,
  };
};

export const listFallbackPostsByUserName = async (userName) => {
  const user = await getFallbackUserByUserName(userName);
  if (!user) {
    return [];
  }
  return Array.from(posts.values())
    .filter((post) => post.author === user._id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const createFallbackComment = async ({ content, author, post, parentComment = null }) => {
  const comment = {
    _id: crypto.randomUUID(),
    content,
    author,
    post,
    parentComment,
    replies: [],
    createdAt: new Date().toISOString(),
  };
  comments.set(comment._id, comment);
  return comment;
};

export const listFallbackCommentsByPost = async (postId) => {
  return Array.from(comments.values())
    .filter((comment) => comment.post === postId && !comment.parentComment)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

export const createFallbackMessage = async ({ sender, receiver, content }) => {
  const message = {
    _id: crypto.randomUUID(),
    sender,
    receiver,
    content,
    createdAt: new Date().toISOString(),
  };
  messages.set(message._id, message);
  return message;
};

export const listFallbackMessages = async (userId, withUserId) => {
  return Array.from(messages.values())
    .filter((message) => (message.sender === userId && message.receiver === withUserId) || (message.sender === withUserId && message.receiver === userId))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};
