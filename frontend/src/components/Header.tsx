import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { Socket } from "../socket/socket"; 


interface Update {
  message: string;
  messageType: string;
  createdAt: Date;
}

export const Header = () => {
  const { clintSocket } = Socket();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Update[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const playSound = () => {
    if (hasInteracted) {
      const sound = new Audio("/sounds/alert.mp3");
      sound.play();
    }
  };

  useEffect(() => {
    clintSocket.on("connect", () => {
      console.log("connected", clintSocket.id);
    });

    clintSocket.on("newUser", (notification: Update) => {
      console.log("Received notification:", notification);

      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          messageType: notification.messageType,
          message: notification.message,
          createdAt: notification.createdAt,
        },
      ]);

      if (hasInteracted) {
        playSound();
      }
    });
    clintSocket.on("newOrder", (notification: Update) => {
      console.log("Received notification:", notification);

      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          messageType: notification.messageType,
          message: notification.message,
          createdAt: notification.createdAt,
        },
      ]);

      if (hasInteracted) {
        playSound();
      }
    });

    return () => {
      clintSocket.off("newUser");
      clintSocket.off("newOrder");
    };
  }, [clintSocket, hasInteracted]);

  const handleUserInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  return (
    <header className="bg-gray-100 text-blue-600 p-4 flex justify-between items-center shadow-md">
      <div className="text-2xl font-bold">Admin Dashboard</div>

      <div className="relative">
        <button
          onClick={() => {
            toggleDropdown();
            handleUserInteraction();
          }}
          className="flex items-center space-x-2 text-gray-300 hover:text-black"
        >
          <div className="relative">
            <FaBell className="text-xl" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </div>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white text-gray-800 shadow-lg rounded-lg w-64 p-2 z-50">
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Latest Updates
            </div>
            {notifications.length === 0 ? (
              <p className="text-gray-500">No new updates</p>
            ) : (
              <div className="space-y-2">
                {notifications.map((update) => (
                  <div
                    key={update.message}
                    className="flex justify-between items-center p-2 hover:bg-gray-200 rounded-md"
                  >
                    <span>{update.message}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(update.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
