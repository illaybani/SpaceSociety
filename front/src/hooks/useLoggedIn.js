import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import jwt_decode from "jwt-decode";

const useLoggedIn = () => {
  const dispatch = useDispatch();
  return async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      axios.get('/users/userInfo', { headers: { "x-auth-token": token } });
      const payload = jwt_decode(token);
      dispatch(authActions.login(payload));
    } catch (err) {
      console.log(err);
      console.log("error from server");
    }
  };
};

export default useLoggedIn;