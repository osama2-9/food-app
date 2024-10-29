import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";

export const VerifyEmail = () => {
  const [code, setCode] = useState<string>(""); 
  const { token } = useParams();
  console.log(token);
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const user = useRecoilValue(userAtom);
console.log(user);

  if (!user) {
    return null;
  }

  const handleSendVerificationCode = async () => {
    try {
      const res = await axios.post(
        "/api/user/send-verification-code",
        {
          uid: user.uid
          ,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const data = res.data;
      if (data) {
        toast.success(data.message);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.log(error);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 
    const CastedCode = Number(code); 

    try {
      const res = await axios.post(
        "/api/user/verify-email",
        { verificationCode: CastedCode, token:token },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.data;
      if (data) {
        toast.success("Account verified");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error: any) {
      console.log(error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold mb-6 text-center text-black">
          Verify Your Email
        </h2>

        <form onSubmit={handleVerifyEmail}>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            type="text"
            className="w-full text-center border border-gray-300 rounded-md p-2 focus:outline-black text-2xl text-black"
            maxLength={4}
            placeholder="Enter 4-digit code"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition duration-200 mt-4"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleSendVerificationCode}
            className="text-black py-2 rounded-md hover:bg-gray-100 transition duration-200 w-52"
          >
            Send Code Again
          </button>
        </div>
      </div>
    </div>
  );
};
