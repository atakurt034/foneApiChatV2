import asyncHandler from 'express-async-handler'
import PrivateRoom from '../models/privaterooms.js'
import Chatroom from '../models/chatrooms.js'
import Message from '../models/messages.js'
import User from '../models/user.js'

export const getRooms = asyncHandler(async (req, res) => {
  const rooms = await Chatroom.find({})
    .populate('users', 'name email')
    .populate('messages', 'message user chatroom')
    .sort({ createdAt: -1 })
  if (rooms) {
    res.json(rooms)
    res.status(200)
  } else {
    res.status(401)
    throw new Error('No Chatrooms found')
  }
})

export const createRoom = asyncHandler(async (req, res) => {
  const users = req.user._id
  const name = req.body.name
  const rooms = await Chatroom.find({ name })
  if (rooms.length > 0) {
    res.status(401)
    throw new Error('Room already exist')
  } else {
    const newRoom = await Chatroom.create({ name, users })
    if (newRoom) {
      res.json(newRoom)
      res.status
    }
  }
})

export const getRoomDetails = asyncHandler(async (req, res) => {
  const id = req.params.id
  const rooms = await Chatroom.findById(id)
    .populate({
      path: 'messages',
      populate: { path: 'user', select: 'name' },
    })
    .populate('messages', 'message user chatroom')
  if (rooms) {
    res.json(rooms)
    res.status(200)
  } else {
    res.status(401)
    throw new Error('No Chatrooms found')
  }
})

export const getMessages = asyncHandler(async (req, res) => {
  const chatroomId = req.params.id
  const limit = req.query.limit ? Number(req.query.limit) : 10
  const skip = req.query.skip || 1
  const messages = await Message.find({ chatroomId })
    .populate('user', 'name image')
    .populate('chatroom', 'name users')
    .limit(limit)
    .skip(skip - 1)
    .sort({ createdAt: -1 })

  if (messages) {
    res.json(messages)
    res.status(200)
  } else {
    res.status(401)
    throw new Error('No Chatrooms found')
  }
})

export const deleteChatroom = asyncHandler(async (req, res) => {
  const id = req.params.id
  const deleted = await Chatroom.findByIdAndDelete(id)
  if (deleted) {
    res.status(202)
    res.json({ status: 202 })
  } else {
    res.status(404)
    throw new Error('Delete Failed')
  }
})

export const editChatroomName = asyncHandler(async (req, res) => {
  const id = req.params.id
  const room = await Chatroom.findById(id)
  const existName = await Chatroom.findOne({ name: req.body.text })

  if (existName) {
    res.status(404)
    throw new Error('Name already exist')
  } else {
    room.name = req.body.text || room.name

    const saved = await room.save()

    if (saved) {
      res.status(202)
      res.json({ status: 202 })
    } else {
      res.status(204)
      throw new Error('Edit failed')
    }
  }
})

export const createPrivateMsg = asyncHandler(async (req, res) => {
  const id1 = req.body.id
  const id2 = req.user._id
  const users = await User.find({ _id: { $in: [id1, id2] } })
  const room = await PrivateRoom.findOne({
    $or: [{ users: { $eq: [id1, id2] } }, { users: { $eq: [id2, id1] } }],
  })

  const [user1, user2] = users

  if (!room && users.length === 2) {
    const create_room = new PrivateRoom({ users })
    const new_private_room = await create_room.save()
    if (new_private_room) {
      user1.privateRooms.push(create_room._id)
      user2.privateRooms.push(create_room._id)
      await user1.save()
      await user2.save()
      res.json(create_room)
    } else {
      res.status(404)
      throw new Error('failed')
    }
  } else {
    res.json(room)
  }
})

export const privateRooms = asyncHandler(async (req, res) => {
  try {
    const id = req.user._id
    const user = await User.findById(id)
      .select('privateRooms')
      .populate({
        path: 'privateRooms',
        model: 'PrivateRoom',
        populate: [
          {
            path: 'messages',
            model: 'Message',
            populate: { path: 'user', select: 'name image' },
          },
          { path: 'users', select: 'name' },
        ],
      })
    res.status(200)
    res.json(user)
  } catch (error) {
    res.status(404)
    throw new Error(error)
  }
})

export const getPrivateMsgs = asyncHandler(async (req, res) => {
  const id = req.user._id
  try {
    const user = await User.find({ _id: id })
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
    res.json(user)
    res.status(204)
  } catch (error) {
    res.status(500)
    throw new Error(error)
  }
})
