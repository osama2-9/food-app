import { useState } from "react";
import { Sidebar } from "../pages/admin/Sidebar";
import { Header } from "../components/Header";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />

      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} />

        <main className="flex-1 bg-white  mt-10 p-6 overflow-y-auto shadow-lg rounded-lg ml-4 mr-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-700 p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>

          {children}
        </main>
      </div>
    </div>
  );
};
