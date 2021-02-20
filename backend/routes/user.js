import express from 'express'
const router = express.Router()
import { user } from '../controller/index.js'
import { protect } from '../middlewares/auth.js'

router.route('/').post(user.registerUser)
router.post('/login', user.authUser)
router
  .route('/profile')
  .get(protect, user.getUserProfile)
  .put(protect, user.updateUserProfile)
router.route('/:id')
router.post('/uploads/avatar', protect, user.updateAvatar)

export default router
