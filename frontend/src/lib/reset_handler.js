import { CHAT } from '../constants/index'

export const reset = (dispatch) => {
  dispatch({ type: CHAT.EDIT_ROOM_RESET })
  dispatch({ type: CHAT.GET_ROOMS_RESET })
  dispatch({ type: CHAT.CREATE_ROOM_RESET })
  dispatch({ type: CHAT.DELETE_ROOM_RESET })
  dispatch({ type: CHAT.GET_MESSAGES_RESET })
  dispatch({ type: CHAT.GET_ROOM_DETAILS_RESET })
}
