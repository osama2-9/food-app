interface Meal {
    name: string;
    description: string;
    price: number;
    mealImg: string;
    sizes: string[];
    additions: string[];
    restaurant: string;
    rating: number;
}

export type {Meal}