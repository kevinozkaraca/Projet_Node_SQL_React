import { GET_POSTS } from "../functions/Post";

const initialState = {};

function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return action.payload;
    default:
      return state;
  }
}

export default postReducer;
