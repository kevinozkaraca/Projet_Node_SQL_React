import { DELETE, GET, PATCH, POST } from "../others/Axios";
import ENDPOINTS from "../others/Endpoints";

export const ADD_POST = "ADD_POST";
export const GET_POSTS = "GET_POSTS";

export const addPost = (data) => {
  return () => {
    return POST(ENDPOINTS.ADD_POST, data)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log("erreur : " + e));
  };
};

export const getPosts = () => {
  return (dispatch) => {
    return GET(ENDPOINTS.GET_POSTS)
      .then((res) => {
        dispatch({ type: GET_POSTS, payload: res.data });
      })
      .catch((e) => console.log("Erreur : " + e));
  };
};

export const deletePost = (id) => {
  return () => {
    return DELETE(`${ENDPOINTS.DELETE_POST}${id}`)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log(e));
  };
};

export const updatePost = (id, data) => {
  return () => {
    return PATCH(`${ENDPOINTS.UPDATE_POST}${id}`, data).catch((e) => console.log("Erreur : " + e));
  };
};
