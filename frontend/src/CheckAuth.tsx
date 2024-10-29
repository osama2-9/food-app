import axios from "axios";
import React, { useEffect } from "react";
import { UseLogout } from "./hooks/UseLogout";

interface CheckAuthProps {
  children: React.ReactNode;
}

export const CheckAuth: React.FC<CheckAuthProps> = ({ children }) => {
  const { handleLogout } = UseLogout();

  const handleCheckAuth = async () => {
    try {
      const res = await axios.get("/api/user/protected", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.response.error) {
        handleLogout();
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
    }
  };

  useEffect(() => {
    handleCheckAuth();
  }, []);

  return <>{children}</>;
};
