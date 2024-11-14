import { Link } from 'react-router-dom';

export const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="mt-4 text-lg text-gray-600">Oops! The page you're looking for does not exist.</p>
        <Link 
          to="/" 
          className="mt-6 inline-block px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-200"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};
