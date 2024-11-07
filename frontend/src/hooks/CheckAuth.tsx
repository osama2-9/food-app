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

  // Re-run the authentication check if `user` is null (or on mount)
  useEffect(() => {
    if (user == null) {
      handleCheckAuth();
    }
  }, [user]); // Dependency on `user` ensures the check is run when the user state changes

  return null;
};
