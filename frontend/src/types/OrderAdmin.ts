interface OrderItem {
    restaurantId: string;
    restaurantName: string;
    restaurantEmail: string;
    restaurantPhone: string;
    mealId: string;
    mealName: string;
    quantity: number;
    price: number;
    size: { name: string; price: number };
    additions: { name: string; price: number; _id: string }[];
}

interface User {
    userId: string;
    name: string;
    email: string;
    phone: string;
}

interface Order {
    orderId: string;
    totalAmount: number;
    orderDate: string;
    user: User;
    orderItems: OrderItem[];
    orderStatus: string;
}
export type {Order}