import { FaRegCheckCircle } from "react-icons/fa";

export const PaymentSuccess = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-10 rounded-lg shadow-xl max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
         <FaRegCheckCircle size={45} color="green" />
        </div>
        <h1 className="text-4xl font-extrabold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Your payment has been processed successfully. Thank you for your trust
          and purchase. We're excited to have you!
        </p>
        <button className="bg-green-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};
