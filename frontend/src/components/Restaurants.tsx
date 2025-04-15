import { Link } from "react-router-dom";
import { useGetRestaurants } from "../hooks/useGetRestaurants";
import { ClipLoader } from "react-spinners";
import { FaStar, FaRegStar, FaLocationDot } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";

export const Restaurants = () => {
  const { restaurant, loading } = useGetRestaurants();
  const displayedRestaurants = restaurant?.slice(0, 6);

  const renderStars = (rating: any) => {
    if (!rating || rating <= 0) {
      return <span className="text-gray-500">No Rating</span>;
    }

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1 text-yellow-500">
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
        <span className="ml-1 text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const getCuisineTypes = (index: any) => {
    const cuisines = [
      "Italian",
      "Mexican",
      "Chinese",
      "Indian",
      "American",
      "Japanese",
    ];
    return cuisines[index % cuisines.length];
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Popular Restaurants</h2>
          <p className="text-gray-600 mt-2">
            Explore the most loved places in your area
          </p>
        </div>
        <Link
          to="/restaurants"
          className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition flex items-center"
        >
          View All
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <ClipLoader color="#6B21A8" loading={loading} size={50} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedRestaurants?.map((restaurant, index) => (
            <Link
              key={restaurant.rid}
              to={`/restaurant/${restaurant.name}/${restaurant.rid}`}
            >
              <div className="bg-white rounded-xl shadow-md overflow-hidden h-full transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                <div className="relative">
                  <img
                    src={restaurant.brandImg}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
                    <p className="font-semibold text-lg">{restaurant.name}</p>
                    {renderStars(restaurant.rating)}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                      {getCuisineTypes(index)}
                    </span>
                    <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      25-35 min
                    </span>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm">
                    <FaLocationDot className="mr-1" />
                    <span>1.2 miles away</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      $$ • Free delivery on orders $15+
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
