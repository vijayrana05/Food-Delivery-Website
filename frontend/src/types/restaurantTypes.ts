export interface IRestaurant  {
    _id: string;
    name: string;
    description: string;
    image: string;
    ownerId: string;
    phone: number
    isVerified: boolean;

    autolocation: {
        type: "Point",
        coordinates: [number, number]
        formattedAddress: string;
    };

    isOpen: boolean;
    createdAt: Date;
}

export interface IMenuItems {
    _id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}
