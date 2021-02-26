import asyncHandler from 'express-async-handler'
import User from '../models/user.js'
import generateToken from '../utils/generateTokens.js'

import slugify from 'slugify'
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access   Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      image: user.image,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('invalid email or password')
  }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  // const exist_user = await User.find({ email })

  try {
    const user = await User.create({
      name,
      email,
      password,
    })
    res.status(201).json({
      _id: user._id,
      name: user.name,
      image: user.image,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500)
    if (error.code === 11000) {
      throw new Error('Email Already Used')
    } else {
      throw new Error(error)
    }
  }
})

// @desc    Get user profile
// @route   GET /api/users/login
// @access   Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      image: user.image,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found!')
  }
})

export const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    user.name = req.body.name
    user.image = req.body.image
    user.email = req.body.email
    if (req.body.password) {
      user.password = req.body.password
    }
    await user.save()
    res.json({ status: 200 })
  } catch (error) {
    res.status(404)
    throw new Error(error)
  }
})

export const updateAvatar = asyncHandler(async (req, res) => {
  const timestamp = new Date().toISOString().slice(0, 10)
  const __dirname = path.resolve()
  const uploadFolder = path.join(
    __dirname,
    'frontend',
    'public',
    'uploads',
    'avatar_images',
    timestamp
  )

  fs.mkdir(uploadFolder, { recursive: true }, function (err) {
    return console.log('dir ' + err)
  })

  const form = new formidable.IncomingForm()
  form.multiples = false
  form.maxFileSize = 30 * 1024 * 1024
  form.uploadDir = uploadFolder
  form.keepExtensions = true
  form.on('fileBegin', (name, file) => {
    file.path = path.join(uploadFolder, slugify(file.name + Date.now()))
  })

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err)
    } else {
      res.json(files)
    }
  })
})
