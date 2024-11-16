import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetRestaurants } from "../hooks/useGetRestaurants";
import { CircleLoader } from "react-spinners";

export const AllRestaurants = () => {
  const { restaurant, loading, error } = useGetRestaurants();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRestaurants =
    filter === "all"
      ? restaurant
      : restaurant?.filter(
          (res) => res.cuisineType?.toLowerCase() === filter.toLowerCase()
        );

  const searchedRestaurants = filteredRestaurants?.filter((res) =>
    res.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-4xl font-extrabold text-center mb-8 text-purple-700">
        Discover Our Restaurants
      </h2>

      {/* Search and Filter */}
      <div className="flex justify-center items-center space-x-6 mb-8">
        <input
          type="text"
          placeholder="Search by restaurant name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-3 w-1/2 sm:w-1/3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <div className="space-x-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-3 rounded-lg border-2 transition-all ${
              filter === "all"
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-600 border-purple-600"
            } font-semibold hover:bg-purple-600 hover:text-white`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("Italian")}
            className={`px-6 py-3 rounded-lg border-2 transition-all ${
              filter === "Italian"
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-600 border-purple-600"
            } font-semibold hover:bg-purple-600 hover:text-white`}
          >
            Italian
          </button>
          <button
            onClick={() => setFilter("Fast-food")}
            className={`px-6 py-3 rounded-lg border-2 transition-all ${
              filter === "Fast-food"
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-600 border-purple-600"
            } font-semibold hover:bg-purple-600 hover:text-white`}
          >
            Fast-food
          </button>
          <button
            onClick={() => setFilter("Syrian")}
            className={`px-6 py-3 rounded-lg border-2 transition-all ${
              filter === "Syrian"
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-600 border-purple-600"
            } font-semibold hover:bg-purple-600 hover:text-white`}
          >
            Syrian
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center mb-8">
          <CircleLoader size={50} color="#6B46C1" loading={loading} />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-red-600 mb-8">
          <p>Oops! Something went wrong. Please try again later.</p>
        </div>
      )}

      {/* No Results */}
      {searchedRestaurants?.length === 0 && !loading && !error && (
        <p className="text-center text-gray-600">No restaurants found.</p>
      )}

      {/* Restaurants Cards */}
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
