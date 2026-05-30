import type { IMenuItem } from "./menuItemTypes";
import type { IRestaurant } from "./restaurantTypes";

export interface ICart  {  
    userId: string;
    restaurantId: string | IRestaurant;
    itemId: string | IMenuItem;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}