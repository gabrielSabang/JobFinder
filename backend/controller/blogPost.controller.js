import Post from '../models/Post.js'

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
    const posts = await Post.find({ author: userId }).populate('author', 'userName email');
    return res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}