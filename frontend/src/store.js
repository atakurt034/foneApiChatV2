import { combineReducers, applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { USER, CHAT } from './reducers/index'

const reducer = combineReducers({
  userLogin: USER.loginReducer,
  userRegister: USER.registerReducer,
  getRooms: CHAT.getRoomsReducer,
  createRoom: CHAT.createRoomsReducer,
  getRoomDetails: CHAT.getRoomDetailsReducer,
})

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
}

const midlleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...midlleware))
)

export default store
