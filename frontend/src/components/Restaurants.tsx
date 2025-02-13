import { Link } from "react-router-dom";
import { useGetRestaurants } from "../hooks/useGetRestaurants";
import { ClipLoader } from "react-spinners";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export const Restaurants = () => {
  const { restaurant, loading } = useGetRestaurants();

  const displayedRestaurants = restaurant?.slice(0, 6);

  const renderStars = (rating:number) => {
    if (!rating || rating <= 0) {
      return <span className="text-gray-500">No Rating</span>;
    }

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex justify-center items-center gap-1 text-yellow-500 mt-2">
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <FaStar key={`full-${i}`} />
          ))}
        {hasHalfStar && <FaStarHalfAlt />}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <FaRegStar key={`empty-${i}`} />
          ))}
      </div>
    );
  };

  return (
    <div className="m-5 mb-20 relative">
      <h2 className="text-3xl font-bold mb-4">Restaurants</h2>

      <Link
        to="/restaurants"
        className="absolute top-0 right-0 text-lg text-purple-500 font-semibold hover:underline"
      >
        View All
      </Link>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <ClipLoader color="#6B21A8" loading={loading} size={50} />
        </div>
      ) : (
        <div className="flex overflow-x-auto space-x-6 py-4">
          {displayedRestaurants?.map((restaurant) => (
            <Link
              key={restaurant.rid}
              to={`/restaurant/${restaurant.name}/${restaurant.rid}`}
              className="w-56 flex-shrink-0 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              <img
                src={restaurant.brandImg}
                alt={restaurant.name}
                className="w-full h-40 object-cover rounded-t-lg"
              />

              <div className="p-4 text-center">
                <p className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                  {restaurant.name}
                </p>
                {renderStars(restaurant.rating)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
