import mongoose, { Schema, Document } from "mongoose"

export interface IRestaurant extends Document {
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

const schema: Schema<IRestaurant> = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        required: true,
    },
    ownerId: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    isVerified: {
        type: Boolean,
        required: true,
    },
    autolocation: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
        formattedAddress: {
            type: String,
            required: true,
        },
    },
    isOpen: {
        type: Boolean,
        default: false,
    },

    },
    {
        timestamps: true,
    }
);

schema.index({ autolocation: "2dsphere" }); 

export default mongoose.model<IRestaurant>("Restaurant", schema)
