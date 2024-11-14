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
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-4xl font-extrabold text-center mb-6 text-purple-700">
        Discover Our Restaurants
      </h2>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by restaurant name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 w-1/2 sm:w-1/3 border-2 border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full border-2 ${
            filter === "all"
              ? "bg-purple-600 text-white"
              : "bg-white text-purple-600 border-purple-600"
          } font-semibold hover:bg-purple-600 hover:text-white transition`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("Italian")}
          className={`px-4 py-2 rounded-full border-2 ${
            filter === "Italian"
              ? "bg-purple-600 text-white"
              : "bg-white text-purple-600 border-purple-600"
          } font-semibold hover:bg-purple-600 hover:text-white transition`}
        >
          Italian
        </button>
        <button
          onClick={() => setFilter("Fast-food")}
          className={`px-4 py-2 rounded-full border-2 ${
            filter === "Fast-food"
              ? "bg-purple-600 text-white"
              : "bg-white text-purple-600 border-purple-600"
          } font-semibold hover:bg-purple-600 hover:text-white transition`}
        >
          Fast-food
        </button>
        <button
          onClick={() => setFilter("Syrian")}
          className={`px-4 py-2 rounded-full border-2 ${
            filter === "Syrian"
              ? "bg-purple-600 text-white"
              : "bg-white text-purple-600 border-purple-600"
          } font-semibold hover:bg-purple-600 hover:text-white transition`}
        >
          Syrian
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center">
          <CircleLoader size={50} color="#6B46C1" loading={loading} />
        </div>
      )}


      {searchedRestaurants?.length === 0 && !loading && !error && (
        <p className="text-center text-gray-600">No restaurants found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {searchedRestaurants?.map((restaurant) => (
          <Link
            key={restaurant.rid}
            to={`/restaurant/${restaurant.name}/${restaurant.rid}`}
            className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all"
          >
            <img
              src={restaurant.brandImg}
              alt={restaurant.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
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
