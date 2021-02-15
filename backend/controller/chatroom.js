import asyncHandler from 'express-async-handler'
import Chatroom from '../models/chatrooms.js'
import Message from '../models/messages.js'

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
    const newRoom = await await Chatroom.create({ name, users })
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
  const id = req.params.id
  const limit = req.query.limit ? Number(req.query.limit) : 10
  const skip = req.query.skip || 1
  const messages = await Message.find({ chatroom: id })
    .populate('user', 'name')
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

  console.log(existName)

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
