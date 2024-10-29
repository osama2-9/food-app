/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {  useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
export const Signup = () => {
    const setUser = useSetRecoilState(userAtom);
    const [inputs, setInputs] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        password: ""
    });

    const onInputsValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/user/signup', { ...inputs }, {
                withCredentials: true,
                headers: {
                    'Content-Type': "application/json"
                }
            });

            const data = res.data;
            if (data) {
                setUser(data.userData);
                localStorage.setItem("user", JSON.stringify(data.userData)); 
                toast.success('Signup successful!'); 
                setInputs({ firstname: "", lastname: "", email: "", phone: "", password: "" }); // Clear inputs
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.error);
            }
        }
    };




    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Signup</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first-name">
                            First Name
                        </label>
                        <input
                            name="firstname"
                            onChange={onInputsValueChange}
                            value={inputs.firstname}
                            type="text"
                            id="first-name"
                            placeholder="First Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last-name">
                            Last Name
                        </label>
                        <input
                            name="lastname"
                            onChange={onInputsValueChange}
                            value={inputs.lastname}
                            type="text"
                            id="last-name"
                            placeholder="Last Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            name="email"
                            onChange={onInputsValueChange}
                            value={inputs.email}
                            type="email"
                            id="email"
                            placeholder="Email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                            Phone
                        </label>
                        <input
                            name="phone"
                            onChange={onInputsValueChange}
                            value={inputs.phone}
                            type="tel"
                            id="phone"
                            placeholder="Phone"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            name="password"
                            onChange={onInputsValueChange}
                            value={inputs.password}
                            type="password"
                            id="password"
                            placeholder="Password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        />
                    </div>
                    <div className="flex mb-2">
                        <p>Have an account ? </p>
                        <Link to={'/login'}> <p className="ml-2 text-purple-500 hover:underline">login</p></Link>

                    </div>

                    <div className="flex items-center justify-between">
                        <button
                        onClick={handleSubmit}
                            type="submit"
                            className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition duration-300"
                        >
                            Signup
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
