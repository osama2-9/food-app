import {User} from './User'
interface Item {

    restaurant: string;
    restaurantImg:string
    meal: string;
    mealId: string;
    mealImg: string;
    size: {
        name: string;
        price: number;
    };
    additions: {
        name: string;
        price: number;
    }[];
    price: string;
    restaurntId:string
}

interface Order {
    userId: string;
    orderId: string;
    status: "pending" | "completed" | "cancelled" | "processing" | 'shipped';
    orderdAt: string; 
    totalAmount: number;
    items: Item[];
   user:User
}

export type { Order }