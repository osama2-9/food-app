/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { API } from "../api";

export const UseLogout = () => {
  const navigator = useNavigate();
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${API}/api/user/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const data = res.data;
      if (data) {
        localStorage.removeItem("user");
        navigator("/login");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      }
    }
  };
  return { handleLogout };
};
