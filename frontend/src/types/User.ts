interface User {
    uid: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    isVerified: boolean;
    isAdmin: boolean
    address: {
        coordinates: {
            lng: number,
            lat: number
        },
        name: string,
        apartment: string,
        floor: string,
        building: string
    },
    lastLogin: Date
}

export type { User }