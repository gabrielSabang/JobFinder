import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

CommentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment',
  justOne: false
});

CommentSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

CommentSchema.index({ post: 1, createdAt: -1 })

const Comment = mongoose.model('Comment', CommentSchema)
export default Comment