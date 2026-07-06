import Post from '../models/Post.js'
import User from '../models/User.js'
import { setCache, getCache, deleteCache } from '../config/redis.js';

export const createPost = async (req, res) => {
  const userId = req.user?._id || req.user;
  if (!userId)
    return res.status(401).json({ message: 'Unauthorized' })
  
  try {
    const { title, content, tags } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' })
    }

    const post = await Post.create({
      title,
      content,
      tags,
      author: userId
    })

    const cacheKey = `posts:user:${userId}:*`; 
    await deleteCache(cacheKey);

    return res.status(201).json({ message: 'Post created successfully', post })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}


export const getPosts = async (req, res) => {
  const userId = req.user?._id || req.user;
  if (!userId)
    return res.status(401).json({ message: 'Unauthorized' })
  
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `posts:user:${userId}:${page}:${limit}`;
    
    const cachedPosts = await getCache(cacheKey);
    
    if (cachedPosts) {
      console.log(`Cache hit for user posts: ${userId} (page ${page}, limit ${limit})`);
      return res.status(200).json(cachedPosts);
    }

    const posts = await Post.find({ author: userId }).populate('author', 'userName email').skip(skip).limit(limit);
    const totalPosts = await Post.countDocuments({ author: userId });
    
    await setCache(cacheKey, { posts, totalPosts, page, limit }, 1800);
    
    return res.status(200).json({ posts, totalPosts, page, limit });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}

export const getPost = async (req, res) => {
  const userId = req.user?._id || req.user;
  if (!userId)
    return res.status(401).json({ message: 'Unauthorized' });
  
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('author', 'userName email');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.status(200).json({ post });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}

export const getPostsByUser = async (req, res) => {
  try {
    const { userName } = req.params;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ author: user._id }).populate('author', 'userName email').sort({ createdAt: -1 });
    return res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}

export const searchPosts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(200).json({ posts: [] });
    }

    const posts = await Post.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $elemMatch: { $regex: q, $options: 'i' } } }
      ]
    }).populate('author', 'userName email').limit(20);

    return res.status(200).json({ posts });
  } catch (error) {
    console.error('Error searching posts:', error);
    return res.status(500).json({ posts: [], message: 'Server error while searching posts.' });
  }
}

export const getAllPostsExceptOwn = async (req, res) => {
  const userId = req.user?._id || req.user;
  if (!userId)
    return res.status(401).json({ message: 'Unauthorized' })
  
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `posts:all_except:${userId}:${page}:${limit}`;
    
    const cachedPosts = await getCache(cacheKey);
    
    if (cachedPosts) {
      console.log(`Cache hit for all posts except own: ${userId} (page ${page}, limit ${limit})`);
      return res.status(200).json(cachedPosts);
    }

    const posts = await Post.find({ author: { $ne: userId } }).populate('author', 'userName email').sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalPosts = await Post.countDocuments({ author: { $ne: userId } });
    
    await setCache(cacheKey, { posts, totalPosts, page, limit }, 1800);
    
    return res.status(200).json({ posts, totalPosts, page, limit });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}