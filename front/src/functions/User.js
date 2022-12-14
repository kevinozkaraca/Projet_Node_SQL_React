import { DELETE, GET, PATCH } from "../others/Axios";
import endpoints from "../others/Endpoints";

export const GET_USER = "GET_USER";
export const UPDATE_USER = "UPDATE_USER";

export const getUser = (uid) => {
  return (dispatch) => {
    return GET(`${endpoints.GET_USER}${uid}`)
      .then((res) => {
        dispatch({ type: GET_USER, payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};

export const updateUser = (uid, data) => {
  return () => {
    return PATCH(`${endpoints.UPDATE_USER}${uid}`, data).catch((err) => console.log(err));
  };
};

export const deleteUser = (uid) => {
  return () => {
    return DELETE(`${endpoints.DELETE_USER}${uid}`).catch((e) => console.log(e));
  };
};
