import { useEffect } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { UseLogout } from "./UseLogout";
import axios from "axios";

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
      console.log("Error:", error);
      if (error.response) {
        console.log("Error Status:", error.response.status);
        console.log("Error Data:", error.response.data);

        if (error.response.status === 401) {
          localStorage.removeItem("user");
          setUser(null);
          handleLogout();
        }
      } else {
        console.log("Error:", error);
      }
    }
  };

  useEffect(() => {
    if (!user == null) {
      handleCheckAuth();
    }
  }, [user]);

  return null;
};
