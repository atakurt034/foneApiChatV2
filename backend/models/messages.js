import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chatroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chatroom',
      required: true,
    },
  },
  { timestamps: true }
)
messageSchema.index({ createdAt: 1 })
messageSchema.index({ updatedAt: 1 })

const Message = mongoose.model('Message', messageSchema)

export default Message
