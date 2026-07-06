import Comment from '../models/Comment.js'
import Post from '../models/Post.js'

export const createComment = async (req, res) => {
  const userId = req.user?._id || req.user;
  if (!userId)
    return res.status(401).json({ message: "Unauthorized" })
  
  try {
    const { postId, content, parentComment } = req.body
    if (!postId || !content)
      return res.status(400).json({ message: "Post ID and content are required" })

    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const comment = await Comment.create({
      content,
      author: userId,
      post: postId,
      parentComment: parentComment || null
    })

    const populatedComment = await comment.populate('author', 'userName email')

    return res.status(201).json({ message: 'Comment created successfully', comment: populatedComment })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId, parentComment: null })
      .populate({
        path: 'author',
        select: 'userName email'
      })
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'userName email' }
      });

    return res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}