export interface Size {
    name: string;
    price: number; 
}

export interface Addition {
    name: string;
    price: number; 
}

export interface Meal {
    _id: string;
    name: string;
    price: number; 
    mealType: string;
    description: string;
    mealImg: string;
    sizes: Size[];
    additions: Addition[];
    isOffer: boolean;
    isActive: boolean;
    offerValidity: Date;
    offerPrice: number;
}
