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

    // Invalidate user's posts cache
    const cacheKey = `posts:user:${userId}`;
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
    const cacheKey = `posts:user:${userId}`;
    
    // Check cache first
    const cachedPosts = await getCache(cacheKey);
    
    if (cachedPosts) {
      console.log(`Cache hit for user posts: ${userId}`);
      return res.status(200).json({ posts: cachedPosts });
    }

    const posts = await Post.find({ author: userId }).populate('author', 'userName email');
    
    // Cache the posts for 30 minutes
    await setCache(cacheKey, posts, 1800);
    
    return res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}