import { combineReducers } from "redux";
import logReducer from "./Log";
import postReducer from "./Post";
import usersReducer from "./Users";
import userReducer from "./User";
import commentReducer from "./Comment";
import likesReducer from "./Likes";

export default combineReducers({
  logReducer,
  postReducer,
  usersReducer,
  userReducer,
  commentReducer,
  likesReducer,
});
