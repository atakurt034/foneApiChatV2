import mongoose from 'mongoose'

const privateRoomSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Two users required'],
        validate: {
          validator: (users) => {
            return users.length > 2
          },
          message: (props) => `Error need 2 users`,
        },
      },
    ],

    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  },
  { timestamps: true }
)

const PrivateRoom = mongoose.model('PrivateRoom', privateRoomSchema)

export default PrivateRoom
