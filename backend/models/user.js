import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Valid Email'],
      unique: true,
    },
    password: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    chatrooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chatroom',
      },
    ],
    privateRooms: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'PrivateRoom' },
    ],
  },
  {
    timestamps: true,
  }
)

userSchema.statics.privateCount = async function (id) {
  return await this.find({ _id: id })
    .select('messages')
    .populate({
      path: 'privateRooms',
      select: 'messages',
      populate: {
        path: 'messages',
        select: 'seenBy -_id',
        match: { seenBy: { $nin: id } },
      },
    })
}

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User
