import mongoose from 'mongoose'

const blogPostSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
}, { timestamps: true })

const BlogPost = mongoose.model('BlogPost', blogPostSchema)
export default BlogPost