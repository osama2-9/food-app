import { useEffect, useState } from "react";
import { API } from "../api";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import axios from "axios";

const RecommendedRestaurants = () => {
  const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    const fetchRecommendedRestaurants = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API}/user/picks-for-you/${user.uid}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (!response) {
          throw new Error("Failed to fetch restaurants");
        }

        setRecommendedRestaurants(response.data.recommendedRestaurants);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedRestaurants();
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <ClipLoader color="#6B21A8" loading={loading} size={50} />
      </div>
    );
  }

  if (!user || recommendedRestaurants.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Just For You</h2>
          <p className="text-gray-600 mt-2">Based on your previous orders</p>
        </div>
        <Link
          to="/recommendations"
          className="text-purple-600 font-medium hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {recommendedRestaurants.slice(0, 3).map((restaurant) => (
          <Link
            key={restaurant.rId}
            to={`/restaurant/${restaurant.name}/${restaurant.rId}`}
            className="group"
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-full transition-all duration-300 group-hover:shadow-xl transform group-hover:-translate-y-1">
              <div className="relative">
                <img
                  src={restaurant.brandImg}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-0 left-0 p-2 bg-purple-600 text-white text-xs rounded-br-lg">
                  Recommended
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                  {restaurant.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Based on your taste preferences
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-yellow-500 flex items-center">
                    <span className="text-lg mr-1">★</span>
                    <span className="text-gray-700 font-medium">4.8</span>
                  </div>
                  <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    20-30 min
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedRestaurants;
