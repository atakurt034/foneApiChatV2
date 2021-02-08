import express from 'express'
const router = express.Router()
import { authUser, registerUser, getUserProfile } from '../controller/user.js'
import { protect } from '../middlewares/auth.js'

router.route('/').post(registerUser)
router.post('/login', authUser)
router.route('/profile').get(protect, getUserProfile)
router.route('/:id')

export default router
