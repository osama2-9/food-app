import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { API } from "../../api";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import resturantAtom from "../../atoms/ResturantAtom";

export const RestaurantLogin = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const setResturant = useSetRecoilState(resturantAtom);

  const navigator = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const res = await axios.post(
        `${API}/restaurant/login`,
        { email: email, password: password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.data;
      if (data) {
        console.log("Login successful, redirecting...");
        localStorage.setItem("Rid", JSON.stringify(data));
        setResturant(data);
        navigator("/myDashboard");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Restaurant Login
        </h2>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleLogin}
            type="submit"
            className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
