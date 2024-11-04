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
        withCredentials: true,
      });

      if (res.status === 401) {
        localStorage.removeItem("user");
        setUser(null);
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
    if (!user == null) {
      handleCheckAuth();
    }
  }, []);

  return null;
};
