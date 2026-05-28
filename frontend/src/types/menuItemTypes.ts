export type IMenuItem = {
  _id: string;
  restaurantId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};
