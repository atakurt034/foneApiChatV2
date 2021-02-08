import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
  message: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
})

const Chat = mongoose.model('Chat', chatSchema)

export default Chat
