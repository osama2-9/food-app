

export interface Size {
    name: string;
    price: string; 
}

export interface Addition {
    name: string;
    price: string; 
}

export interface Meal {
    _id: string; 
    name: string;
    price: string;
    mealType: string;
    description: string;
    mealImg: string;
    sizes: Size[];
    additions: Addition[];
}
