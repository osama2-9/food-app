import axios from "axios";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { UseLogout } from "./UseLogout";

export const CheckAuth = () => {
  const { handleLogout } = UseLogout();
  const [user, setUser] = useRecoilState(userAtom);

  const handleCheckAuth = async () => {
    try {
      const res = await axios.get("/api/user/protected", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ensure cookies are sent with the request
      });

      if (res.status === 401) {
        localStorage.removeItem("user");
        setUser(null); // Reset user state
        handleLogout();
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("user");
        setUser(null);
        handleLogout();
      } else {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (user == null) {
      handleCheckAuth();
    }
  }, [user]); 

  return null;
};
