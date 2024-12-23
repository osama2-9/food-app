import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetRestaurants } from "../hooks/useGetRestaurants";
import { ClipLoader } from "react-spinners";
import { Footer } from "../components/Footer";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export const AllRestaurants = () => {
  const { restaurant, loading, error } = useGetRestaurants();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cuisineTypes, setCuisineTypes] = useState<string[]>([]);

  useEffect(() => {
    if (restaurant) {
      const uniqueCuisines = [
        "all",
        ...new Set(
          restaurant
            .map((res) => res.cuisineType)
            .filter((cuisine) => cuisine !== undefined)
        ),
      ];
      setCuisineTypes(uniqueCuisines);
    }
  }, [restaurant]);

  const filteredRestaurants =
    filter === "all"
      ? restaurant
      : restaurant?.filter(
          (res) => res.cuisineType?.toLowerCase() === filter.toLowerCase()
        );

  const searchedRestaurants = filteredRestaurants?.filter((res) =>
    res.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearFilters = () => {
    setFilter("all");
    setSearchQuery("");
  };

  const renderStars = (rating: number) => {
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
      </div>
    );
  };

  return (
    <>
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-purple-700">
          Discover Our Restaurants
        </h2>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/4 bg-white rounded-lg shadow-lg p-6 space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              Filter by Cuisine
            </h3>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by restaurant name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              {cuisineTypes.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setFilter(cuisine)}
                  className={`w-full px-4 py-2 rounded-lg text-left ${
                    filter === cuisine
                      ? "bg-purple-600 text-white"
                      : "bg-white text-purple-600"
                  } border-2 border-purple-600 font-semibold hover:bg-purple-600 hover:text-white mb-4`}
                >
                  {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400"
            >
              Clear Filter
            </button>
          </div>

          <div className="w-full lg:w-3/4">
            {loading && (
              <div className="flex justify-center items-center py-16">
                <ClipLoader color="#7C3AED" loading={loading} size={50} />
              </div>
            )}

            {error && (
              <div className="text-center text-red-600 mb-8">
                <p>Oops! Something went wrong. Please try again later.</p>
              </div>
            )}

            {searchedRestaurants?.length === 0 && !loading && !error && (
              <p className="text-center text-gray-600">No restaurants found.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {searchedRestaurants?.map((restaurant) => (
                <Link
                  key={restaurant.rid}
                  to={`/restaurant/${restaurant.name}/${restaurant.rid}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
                >
                  <img
                    src={restaurant.brandImg}
                    alt={restaurant.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {restaurant.name}
                    </h3>
                    <p className="text-lg text-gray-600 mb-4">
                      {restaurant.cuisineType}
                    </p>
                    <div>{renderStars(restaurant.rating)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
