import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {  useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link } from 'react-router-dom';

export const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
const  setUser = useSetRecoilState(userAtom);
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      '/api/user/login',
      {
        email: email,
        password: password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    const data = res.data;
    if (data) {
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      console.log(data.error || 'No error in response');
    }
  } catch (error : any) {
    if (error.response && error.response.data) {
      toast.error(error.response.data.error)
      console.error('Error message:',  error.response.data.error );
    } else {
      console.error('Error during login:', error.message || 'An unknown error occurred');
    }
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-8">Login</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            onClick={handleSubmit}
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4">
          Don't have an account? <Link to={'/signup'} className="text-purple-500 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};
