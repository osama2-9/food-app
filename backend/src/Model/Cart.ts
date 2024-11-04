import mongoose, { Document, Schema } from "mongoose";

interface CartItem {
    restaurantId: mongoose.Schema.Types.ObjectId;
    mealId: mongoose.Schema.Types.ObjectId;
    quantity: number;
    price: number;
    size?: {
        name: string;
        price: number;
    };
    additions?: {
        name: string;
        price: number;
    }[]; 
}

interface Cart extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    items: CartItem[];
}

const CartItemSchema = new Schema<CartItem>({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Restaurant" },
    mealId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Meal' },
    quantity: { type: Number, required: true, min: 1 },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    size: {
        name: { type: String },
        price: { type: Number, default: 0 },
    },
    additions: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
    }],
});

const CartSchema = new Schema<Cart>({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    items: [CartItemSchema],
}, {
    timestamps: true,
});

const Cart = mongoose.model<Cart>("Cart", CartSchema);

export default Cart;
