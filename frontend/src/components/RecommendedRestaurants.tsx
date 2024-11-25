import { useEffect, useState } from "react";
import { API } from "../api";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { User } from "../types/User";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import axios from "axios";

interface Restaurant {
  rId: string;
  name: string;
  brandImg: string;
}

const RecommendedRestaurants = () => {
  const [recommendedRestaurants, setRecommendedRestaurants] = useState<
    Restaurant[]
  >([]);
  const [loading, setLoading] = useState(true);
  const user = useRecoilValue<User | null>(userAtom);

  useEffect(() => {
    const fetchRecommendedRestaurants = async () => {
      try {
        const response = await axios.get(
          `${API}/user/picks-for-you/${user?.uid}`,
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
        const data = await response.data;
        setRecommendedRestaurants(data.recommendedRestaurants);
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
      <div className="flex justify-center items-center py-10">
        <ClipLoader color="#6B21A8" loading={loading} size={50} />
      </div>
    );
  }

  return (
    <>
      {user && (
        <>
          <div className="max-w-7xl mx-auto py-10 px-5">
            <h2 className="text-3xl font-bold text-center mb-8">
              Picks For You 🔥
            </h2>
            <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-8">
              {recommendedRestaurants.length > 0 ? (
                recommendedRestaurants.slice(0, 3).map((restaurant) => (
                  <Link
                    key={restaurant.rId}
                    to={`/restaurant/${restaurant.name}/${restaurant.rId}`}
                  >
                    <div className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
                      <img
                        src={restaurant.brandImg}
                        alt={restaurant.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-5">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {restaurant.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RecommendedRestaurants;
