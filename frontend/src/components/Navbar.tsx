import React, { useState, useEffect, useCallback } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { IoIosLogOut } from "react-icons/io";
import { UseLogout } from "../hooks/UseLogout";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { debounce } from "lodash";
import { API } from "../api";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [searchResults, setSearchResults] = useState<any>(null); 
  const [loading, setLoading] = useState(false); 
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate(); 
  const { handleLogout } = UseLogout();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setSearchResults(null); 
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${API}/user/search`, {
          params: { query },
        });
        setSearchResults(response.data); 
      } catch (error) {
        console.error("Error during search:", error);
        setSearchResults(null);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  ); 

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchTerm(query);
    debouncedSearch(query); 
  };

  const handleSearchSubmit = () => {
    if (searchTerm) {
      navigate(`/search?q=${searchTerm}`);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults(null);
    }
  }, [searchTerm]);

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center p-4 flex-wrap">
        <img src="/logo.png" alt="Logo" className="h-10" />

        <div className="flex-grow mx-4 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            placeholder="Search for restaurants or meals..."
            className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {loading && searchTerm && (
            <div className="absolute right-0 top-0 p-2">
              <BeatLoader color="#4B8BF5" size={8} />
            </div>
          )}

          {searchResults && searchTerm && !loading && (
            <div className="absolute bg-white shadow-lg rounded-lg mt-2 w-full z-10">
              <ul className="max-h-60 overflow-y-auto">
                {searchResults.restaurants.length > 0 && (
                  <div>
                    <h3 className="px-4 py-2 text-gray-700 font-semibold">
                      Restaurants
                    </h3>
                    {searchResults.restaurants.map((restaurant: any) => (
                      <li
                        key={restaurant._id}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        <Link
                          to={`/restaurant/${restaurant.name}/${restaurant._id}`}
                          className="text-purple-500"
                        >
                          {restaurant.name}
                        </Link>
                      </li>
                    ))}
                  </div>
                )}

                {searchResults.meals.length > 0 && (
                  <div>
                    <h3 className="px-4 py-2 text-gray-700 font-semibold">
                      Meals
                    </h3>
                    {searchResults.meals.map((meal: any) => (
                      <li
                        key={meal._id}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        <Link
                          to={`/restaurant/meal/${meal._id}`}
                          className="text-purple-500"
                        >
                          {meal.name}
                        </Link>
                      </li>
                    ))}
                  </div>
                )}

                {searchResults.restaurants.length === 0 &&
                  searchResults.meals.length === 0 && (
                    <div className="px-4 py-2 text-gray-500">
                      No results found for "{searchTerm}"
                    </div>
                  )}
              </ul>
            </div>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isOpen ? (
              <FaTimes className="text-purple-500 text-2xl" />
            ) : (
              <FaBars className="text-purple-500 text-2xl" />
            )}
          </button>
        </div>

        <div className="hidden md:flex space-x-4 mt-2">
          {user ? (
            <>
              <Link to="/my-orders" className="text-purple-500 hover:underline">
                <FaUserCircle className="text-purple-500 text-2xl" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-purple-500 hover:underline"
              >
                <IoIosLogOut className="text-purple-500 text-lg mr-1" />
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="text-purple-500 hover:underline">
                Signup
              </Link>
              <Link to="/login" className="text-purple-500 hover:underline">
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="bg-white shadow-md md:hidden">
          <div className="flex flex-col space-y-2 p-4">
            {user ? (
              <>
                <Link
                  to="/account"
                  className="flex items-center text-purple-500 hover:underline"
                >
                  <FaUserCircle className="text-purple-500 text-lg mr-1" />
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-purple-500 hover:underline"
                >
                  <IoIosLogOut className="text-purple-500 text-lg mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signup" className="text-purple-500 hover:underline">
                  Signup
                </Link>
                <Link to="/login" className="text-purple-500 hover:underline">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
