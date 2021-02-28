import { Router } from 'express'
import { chat } from '../controller/index.js'
import { protect, admin } from '../middlewares/auth.js'

const router = Router()

router.route('/').get(protect, chat.getRooms).post(protect, chat.createRoom)
router
  .route('/:id')
  .get(protect, chat.getRoomDetails)
  .delete(protect, admin, chat.deleteChatroom)
  .put(protect, admin, chat.editChatroomName)
router.route('/messages/:id').get(protect, chat.getMessages)
router
  .route('/private/:id')
  .post(protect, chat.createPrivateMsg)
  .get(protect, chat.privateRooms)
router.route('/private/message').get(protect, chat.getPrivateMsgs)

export default router
