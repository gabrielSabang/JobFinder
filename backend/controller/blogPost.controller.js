import Post from '../models/Post.js'
import { setCache, getCache, deleteCache, clearCachePattern } from '../config/redis.js';

export const createPost = async (req, res) => {
  const userId = req.user
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
  const userId = req.user;
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