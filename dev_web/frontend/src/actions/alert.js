import { v4 as uuid } from 'uuid'
import { SET_ALERT, REMOVE_ALERT } from './constants'

export const setAlert = (message, alertType, timeout = 2500) => (dispatch) => {
  const id = uuid()
  dispatch({
    type: SET_ALERT,
    payload: { message, alertType, id },
  })

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout)
}
