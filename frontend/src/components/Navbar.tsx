import React, { useState, useEffect, useCallback } from "react";
import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaSearch,
} from "react-icons/fa";
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
  const [searchResults, setSearchResults] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const { handleLogout } = UseLogout();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchTerm("");
      setSearchResults(null);
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (query) => {
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

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchTerm(query);
    debouncedSearch(query);
  };

  const handleSearchSubmit = () => {
    if (searchTerm) {
      navigate(`/search?q=${searchTerm}`);
      setShowSearch(false);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults(null);
    }
  }, [searchTerm]);

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10" />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="font-medium text-gray-700 hover:text-purple-600 transition"
          >
            Home
          </Link>
          <Link
            to="/restaurants"
            className="font-medium text-gray-700 hover:text-purple-600 transition"
          >
            Restaurants
          </Link>
          <Link
            to="/offers"
            className="font-medium text-gray-700 hover:text-purple-600 transition"
          >
            Offers
          </Link>
          <button
            onClick={toggleSearch}
            className="text-gray-700 hover:text-purple-600 transition"
          >
            <FaSearch className="text-xl" />
          </button>
        </div>

        {/* Desktop account actions */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link
                to="/cart"
                className="text-gray-700 hover:text-purple-600 transition relative"
              >
                <FaShoppingCart className="text-2xl" />
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  2
                </span>
              </Link>

              <div className="relative group">
                <button className="flex items-center space-x-2">
                  <FaUserCircle className="text-gray-700 text-2xl" />
                </button>

                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl invisible group-hover:visible transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0">
                  <Link
                    to="/my-orders"
                    className="block px-4 py-2 text-gray-800 hover:bg-purple-50 hover:text-purple-600"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-purple-50 hover:text-purple-600"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-purple-50 hover:text-purple-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-purple-600 border border-purple-600 rounded-full hover:bg-purple-50 transition"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleSearch} className="mr-4 text-gray-700">
            <FaSearch className="text-xl" />
          </button>
          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none"
          >
            {isOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Full-width search bar that appears when toggled */}
      {showSearch && (
        <div className="w-full bg-gray-100 p-4 shadow-inner">
          <div className="container mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                placeholder="Search for restaurants or meals..."
                className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

              {loading && searchTerm && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <BeatLoader color="#4B8BF5" size={8} />
                </div>
              )}

              {searchResults && searchTerm && !loading && (
                <div className="absolute bg-white shadow-lg rounded-lg mt-2 w-full z-20">
                  <ul className="max-h-96 overflow-y-auto">
                    {searchResults.restaurants &&
                      searchResults.restaurants.length > 0 && (
                        <div>
                          <h3 className="px-4 py-2 text-gray-700 font-semibold bg-gray-50">
                            Restaurants
                          </h3>
                          {searchResults.restaurants.map((restaurant) => (
                            <li
                              key={restaurant._id}
                              className="px-4 py-3 hover:bg-purple-50 flex items-center"
                            >
                              <img
                                src={
                                  restaurant.brandImg ||
                                  "/placeholder-restaurant.png"
                                }
                                alt={restaurant.name}
                                className="w-10 h-10 rounded-full object-cover mr-3"
                              />
                              <Link
                                to={`/restaurant/${restaurant.name}/${restaurant._id}`}
                                className="text-gray-800 hover:text-purple-600"
                                onClick={() => setShowSearch(false)}
                              >
                                {restaurant.name}
                              </Link>
                            </li>
                          ))}
                        </div>
                      )}

                    {searchResults.meals && searchResults.meals.length > 0 && (
                      <div>
                        <h3 className="px-4 py-2 text-gray-700 font-semibold bg-gray-50">
                          Meals
                        </h3>
                        {searchResults.meals.map((meal) => (
                          <li
                            key={meal._id}
                            className="px-4 py-3 hover:bg-purple-50 flex items-center"
                          >
                            <img
                              src={meal.image || "/placeholder-meal.png"}
                              alt={meal.name}
                              className="w-10 h-10 rounded object-cover mr-3"
                            />
                            <Link
                              to={`/restaurant/meal/${meal._id}`}
                              className="text-gray-800 hover:text-purple-600"
                              onClick={() => setShowSearch(false)}
                            >
                              {meal.name}
                            </Link>
                          </li>
                        ))}
                      </div>
                    )}

                    {(!searchResults.restaurants ||
                      searchResults.restaurants.length === 0) &&
                      (!searchResults.meals ||
                        searchResults.meals.length === 0) && (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          No results found for "{searchTerm}"
                        </div>
                      )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="flex flex-col space-y-3 p-4">
            <Link
              to="/"
              className="px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/restaurants"
              className="px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Restaurants
            </Link>
            <Link
              to="/offers"
              className="px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Offers
            </Link>

            <div className="border-t border-gray-200 my-2"></div>

            {user ? (
              <>
                <Link
                  to="/my-orders"
                  className="px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUserCircle className="mr-2" /> My Orders
                </Link>
                <Link
                  to="/cart"
                  className="px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <FaShoppingCart className="mr-2" /> Cart
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg flex items-center"
                >
                  <IoIosLogOut className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  to="/login"
                  className="px-3 py-2 text-center border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50"
                  onClick={() => setIsOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 text-center bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
