import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../api";

export const ReactiveAccount: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleReactivationRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${API}/user/send-activetion-email`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const data = res.data;
      if (data.success) {
        toast.success("Reactivation request sent! Please check your email.");
        navigate("/login");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred while requesting reactivation.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row md:bg-gray-50">
      <div className="w-full lg:w-1/2 p-8 flex items-center justify-center bg-white shadow-lg lg:rounded-l-lg">
        <div className="w-full mt-52 md:mt-0 max-w-sm">
          <h2 className="text-3xl font-semibold text-center text-purple-600 mb-8">
            Reactivate Account
          </h2>
          <form onSubmit={handleReactivationRequest}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-black rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                required
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center relative"
              disabled={isLoading}
            >
              {isLoading && (
                <div className="w-5 h-5 mr-3 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
              )}
              Request Reactivation
            </button>
          </form>
          <p className="text-center text-gray-500 mt-4">
            Remembered your account details?{" "}
            <Link to={"/login"} className="text-purple-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-purple-600 text-white items-center justify-center lg:rounded-r-lg">
        <div className="text-center">
          <img src="/logo.png" alt="Logo" className="mb-6 w-24 mx-auto" />
          <h1 className="text-4xl font-semibold mb-4">
            Reactivate Your Account
          </h1>
          <p className="text-lg">
            Please enter your email address to receive the reactivation
            instructions.
          </p>
        </div>
      </div>
    </div>
  );
};
