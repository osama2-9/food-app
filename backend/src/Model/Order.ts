import mongoose, { Document } from "mongoose";

interface OrderItem {
  restaurantId: mongoose.Schema.Types.ObjectId;
  menuItem: mongoose.Schema.Types.ObjectId;
  quantity: number;
  price: number;
  size?: {
    name: string,
    price: number
  };
  additions?: { name: string; price: number }[];
}

interface Order extends Document {
  items: OrderItem[];
  totalAmount: number;
  orderDate: Date;
  user: {
    userId: mongoose.Schema.Types.ObjectId;
    name: string;
    phone: string;
    email: string;
    address: object
  };
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
}

const orderSchema = new mongoose.Schema<Order>({
  items: [
    {
      restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
      },
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      size: {
        name: String,
        price: Number
      },
      additions: [{ name: String, price: Number }],
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  user: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: Object,
      required: true
    }
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "Cancelled"],
    default: "Pending",
  },
});

const Order = mongoose.model<Order>("Order", orderSchema);
export default Order;
