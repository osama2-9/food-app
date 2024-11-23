import Notification from "../Model/Notification.js";
export const createNotification = async ({
  message,
  messageType,
  action,
  expiresAt,
  createdAt = Date.now(),
}) => {
  try {
    const newNotification = new Notification({
      message,
      messageType,
      action,
      expiresAt,
      createdAt,
    });

    const savedNotification = await newNotification.save();
    console.log("Notification created successfully:", savedNotification);
    return savedNotification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Error creating notification: " + error.message);
  }
};
