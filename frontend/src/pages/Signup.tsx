/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { API } from "../api";

export const Signup = () => {
  const setUser = useSetRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for the spinner

  const onInputsValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Show spinner on submit
    try {
      const res = await axios.post(
        `${API}/api/user/signup`,
        { ...inputs },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data;
      if (data) {
        setUser(data.userData);
        localStorage.setItem("user", JSON.stringify(data.userData));
        toast.success("Signup successful!");
        setInputs({
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          password: "",
        }); // Clear inputs
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      }
    } finally {
      setIsLoading(false); // Hide spinner after request completes
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left Side - Signup Form */}
      <div className="w-full lg:w-1/2 p-8 flex items-center justify-center bg-white md:shadow-md lg:rounded-l-lg">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-semibold text-center text-purple-600 mb-8">
            Signup
          </h2>
          <form>
            <div className="mb-6">
              <label
                htmlFor="firstname"
                className="block text-gray-700 font-medium mb-2"
              >
                First Name
              </label>
              <input
                name="firstname"
                onChange={onInputsValueChange}
                value={inputs.firstname}
                type="text"
                id="firstname"
                placeholder="First Name"
                className="w-full p-3 border border-black rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="lastname"
                className="block text-gray-700 font-medium mb-2"
              >
                Last Name
              </label>
              <input
                name="lastname"
                onChange={onInputsValueChange}
                value={inputs.lastname}
                type="text"
                id="lastname"
                placeholder="Last Name"
                className="w-full p-3 border border-black rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email
              </label>
              <input
                name="email"
                onChange={onInputsValueChange}
                value={inputs.email}
                type="email"
                id="email"
                placeholder="Email"
                className="w-full p-3 border border-black rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="phone"
                className="block text-gray-700 font-medium mb-2"
              >
                Phone
              </label>
              <input
                name="phone"
                onChange={onInputsValueChange}
                value={inputs.phone}
                type="tel"
                id="phone"
                placeholder="Phone"
                className="w-full p-3 border border-black rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
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
                name="password"
                onChange={onInputsValueChange}
                value={inputs.password}
                type="password"
                id="password"
                placeholder="Password"
                className="w-full p-3 border border-black rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div className="flex mb-2">
              <p>Already have an account?</p>
              <Link to={"/login"}>
                <p className="ml-2 text-purple-500 hover:underline">Login</p>
              </Link>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleSubmit}
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors relative"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
                  </div>
                ) : (
                  "Signup"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Logo and Welcome Message */}
      <div className="hidden lg:flex w-1/2 bg-purple-600 text-white items-center justify-center lg:rounded-r-lg">
        <div className="text-center">
          <img src="/logo.png" alt="Logo" className="mb-6 w-24 mx-auto" />
          <h1 className="text-4xl font-semibold mb-4">Welcome!</h1>
          <p className="text-lg">Create an account to get started.</p>
        </div>
      </div>
    </div>
  );
};
