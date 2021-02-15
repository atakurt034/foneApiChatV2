import mongoose from 'mongoose'

const chatroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    onlineUsers: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

const Chatroom = mongoose.model('Chatroom', chatroomSchema)

export default Chatroom
