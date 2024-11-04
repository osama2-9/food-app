interface User {
    uid: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    isVerified: boolean;
    isAdmin: boolean
}

export type { User }