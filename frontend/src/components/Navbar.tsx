import React, { useState } from 'react';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { IoIosLogOut } from "react-icons/io";
import { UseLogout } from '../hooks/UseLogout';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const user = useRecoilValue(userAtom); 

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const { handleLogout } = UseLogout()

    return (
        <nav className="bg-white shadow-sm">
            <div className="container mx-auto flex justify-between items-center p-4 flex-wrap">
                <img src="/logo.png" alt="Logo" className="h-10" />

                <div className="flex-grow mx-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div className="md:hidden">
                    <button onClick={toggleMenu} className="focus:outline-none">
                        {isOpen ? <FaTimes className="text-purple-500 text-2xl" /> : <FaBars className="text-purple-500 text-2xl" />}
                    </button>
                </div>

                <div className="hidden md:flex space-x-4 mt-2">
                    {user ? (  
                        <>
                            <Link to="/account" className="text-purple-500 hover:underline">
                                <FaUserCircle className="text-purple-500 text-2xl" />
                            </Link>
                            <button onClick={handleLogout} className="text-purple-500 hover:underline">
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
                                <Link to="/account" className="flex items-center text-purple-500 hover:underline">
                                    <FaUserCircle className="text-purple-500 text-lg mr-1" />
                                    Account
                                </Link>
                                <button onClick={handleLogout} className="flex items-center text-purple-500 hover:underline">
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
