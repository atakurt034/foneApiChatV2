import { USER } from '../constants/index'

export const loginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER.LOGIN_REQUEST:
      return { loading: true }
    case USER.LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload }
    case USER.LOGIN_FAIL:
      return { loading: false, error: action.payload }
    case USER.LOGOUT:
      return {}
    default:
      return state
  }
}

export const registerReducer = (state = {}, action) => {
  switch (action.type) {
    case USER.REGISTER_REQUEST:
      return { loading: true }
    case USER.REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload }
    case USER.REGISTER_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
