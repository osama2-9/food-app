import React, { useState, useEffect } from "react";
import { Usidebar } from "../components/Usidebar";
import { FaBars } from "react-icons/fa";

interface LayoutProps {
  children: React.ReactNode;
}

export const UserLayout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile (adjust the breakpoint as necessary)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Set mobile if width is less than 768px
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize); // Update on resize

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
          } md:block bg-white text-purple-600 p-6 h-screen w-64 shadow-lg fixed top-0 left-0 transition-transform duration-300 ease-in-out z-20`}
        >
          <Usidebar />
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black opacity-40 z-10"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <main
          className={`flex-1 bg-gray-50 p-6 mt-6 md:mt-0 md:ml-64 transition-all duration-300 ease-in-out ${
            isSidebarOpen && isMobile ? "ml-64" : "ml-0"
          }`}
        >
          {/* Mobile Sidebar Toggle Button */}
          <div className="md:hidden mb-4">
            <button
              onClick={toggleSidebar}
              className="text-purple-600 p-2 rounded-md focus:outline-none"
            >
              <FaBars size={24} />
            </button>
          </div>

          {/* Main content (children) */}
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
