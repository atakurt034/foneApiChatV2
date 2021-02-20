import { USER } from '../constants/index'

export const loginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER.LOGIN_REQUEST:
      return { loading: true, logout: false }
    case USER.LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload, logout: false }
    case USER.LOGIN_FAIL:
      return { loading: false, error: action.payload, logout: false }
    case USER.LOGOUT:
      return { logout: true }
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

export const userDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case USER.DETAILS_REQUEST:
      return { loading: true }
    case USER.DETAILS_SUCCESS:
      return { loading: false, details: action.payload }
    case USER.DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case USER.DETAILS_RESET:
      return {}
    default:
      return state
  }
}

export const userUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case USER.UPDATE_REQUEST:
      return { loading: true }
    case USER.UPDATE_SUCCESS:
      return { loading: false, status: action.payload }
    case USER.UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case USER.UPDATE_RESET:
      return {}
    default:
      return state
  }
}
