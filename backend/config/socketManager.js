import { io } from "../index.js";

const restaurantSocket = {}; // Use an object to store restaurantId as key and socketId as value

const handleRestaurantConnection = (socket) => {
  console.log("Restaurant connected:", socket.id);

  socket.on("restaurantConnected", (restaurantId) => {
    // Associate restaurantId with the socket.id
    restaurantSocket[restaurantId] = socket.id;
    console.log(
      `Restaurant ${restaurantId} connected with socket ID ${socket.id}`
    );
  });

  socket.on("disconnect", () => {
    console.log("Restaurant disconnected:", socket.id);
    for (let restaurantId in restaurantSocket) {
      if (restaurantSocket[restaurantId] === socket.id) {
        delete restaurantSocket[restaurantId];
        console.log(`Restaurant ${restaurantId} disconnected`);
        break;
      }
    }
  });
};

const notifyRestaurant = (event, data) => {
  io.emit(event, data);
  console.log(`Notified all restaurants with event: ${event}`);
};

export { handleRestaurantConnection, notifyRestaurant };
