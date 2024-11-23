const messageTypes = {
  NEW_USER: "new_user",
  NEW_RESTAURANT: "new_restaurant",
  NEW_ORDER: "new_order",
  NEW_MEAL: "new_meal",
};

const actions = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
};

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  messageType: {
    type: String,
    required: true,
    enum: Object.values(messageTypes),
  },
  action: {
    type: String,
    enum: Object.values(actions),
    required: true,
  },
  sound: {
    type: String,
    default: "alert.mp3",
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt:{
    type:Date,
    default:Date.now
  },
  seenAt: {
    type: Date,
    default: null,
  },
});

notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;

export { messageTypes, actions };
