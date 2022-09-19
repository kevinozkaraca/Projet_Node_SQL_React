import { GET } from "../others/Axios";
import ENDPOINTS from "../others/Endpoints";

export const GET_USERS = "GET_USERS";

export const getUsers = () => {
  return (dispatch) => {
    return GET(ENDPOINTS.GET_USERS)
      .then((res) => {
        dispatch({ type: GET_USERS, payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};
