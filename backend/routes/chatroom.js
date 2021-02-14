import { Router } from 'express'
import { chat } from '../controller/index.js'
import { protect, admin } from '../middlewares/auth.js'

const router = Router()

router.route('/').get(protect, chat.getRooms).post(protect, chat.createRoom)
router
  .route('/:id')
  .get(protect, chat.getRoomDetails)
  .delete(protect, admin, chat.deleteChatroom)
router.route('/messages/:id').get(protect, chat.getMessages)

export default router
