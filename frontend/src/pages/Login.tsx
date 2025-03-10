import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../api";
import { ClipLoader } from "react-spinners";

export const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setUser = useSetRecoilState(userAtom);
  const navigator = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API}/user/login`,
        { email: email, password: password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const data = res.data;
      if (data) {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        console.log(data.error || "No error in response");
        navigator("/");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.error;

        if (errorMessage && errorMessage.includes("deactived")) {
          const toastId = toast.error(
            <div className="flex justify-between items-center">
              <span>
                Your account has been deactivated.{" "}
                <Link
                  className="text-green-600 font-semibold"
                  to={"/reactive-request"}
                >
                  Reactive Now
                </Link>
                .
              </span>
              <button
                onClick={() => toast.dismiss(toastId)}
                className="ml-4 text-black font-bold"
              >
                X
              </button>
            </div>,
            {
              duration: Infinity,
            }
          );
        } else {
          toast.error(errorMessage);
        }

        console.error("Error message:", errorMessage);
      } else {
        console.error(
          "Error during login:",
          error.message || "An unknown error occurred"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row md:bg-gray-50">
      <div className="w-full lg:w-1/2 p-8 flex items-center justify-center bg-white shadow- lg:rounded-l-lg">
        <div className="w-full mt-52 md:mt-0 max-w-sm">
          <h2 className="text-3xl font-semibold text-center text-purple-600 mb-8">
            Login
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-black rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-black rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center relative"
              disabled={isLoading}
            >
              {isLoading ? <ClipLoader size={24} color="white" /> : "Login"}
            </button>
          </form>
          <p className="text-center text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link to={"/signup"} className="text-purple-600 hover:underline">
              Sign up
            </Link>
          </p>
          <p className="text-center text-gray-500 mt-4">
            <Link
              to={"/forget-password"}
              className="text-purple-600 hover:underline"
            >
              Forget password ?
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-purple-600 text-white items-center justify-center lg:rounded-r-lg">
        <div className="text-center">
          <img src="/logo.png" alt="Logo" className="mb-6 w-24 mx-auto" />
          <h1 className="text-4xl font-semibold mb-4">Welcome Back!</h1>
          <p className="text-lg">
            We're happy to see you again. Please log in to continue.
          </p>
        </div>
      </div>
    </div>
  );
};
