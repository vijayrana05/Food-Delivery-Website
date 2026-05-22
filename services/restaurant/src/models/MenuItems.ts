import mongoose, { Document } from "mongoose";


export interface IMenuItems extends Document {
    restaurantId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    image?: string;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}


const MenuItemSchema = new mongoose.Schema<IMenuItems>(
    {
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        price: { type: Number, required: true, trim: true },
        image: { type: String, required: false },
        isAvailable: { type: Boolean, required: true },
    }, {
        timestamps: true,
    }
);

export default mongoose.model<IMenuItems>("MenuItem",MenuItemSchema);