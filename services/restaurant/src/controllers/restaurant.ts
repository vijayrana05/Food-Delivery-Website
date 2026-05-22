import axios from "axios";
import getBuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js"
import TryCatch from "../middleware/trycatch.js"
import Restaurant from "../models/Restaurant.js";
import jwt from "jsonwebtoken"
import { trusted } from "mongoose";

export const addRestaurant = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
        res.status(401).json({
            message: "Unauthorized",
        })
        return;
    }

    const existingRestaurant = await Restaurant.findOne({ ownerId: user._id });

    if (existingRestaurant) {
        res.status(400).json({
            message: "Restaurant already exists for this user",
        })
        return;
    }

    const { name, description, lattitude, longitude, formattedAddress, phone } = req.body;
    if (!name || !description || !lattitude || !longitude || !formattedAddress || !phone) {
        res.status(400).json({
            message: "All fields are required",
        })
        return;
    }

    const file = req.file;

    if (!file) {
        res.status(400).json({
            message: "Image is required",
        })
        return;
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer?.content) {
        res.status(400).json({
            message: "Invalid image file",
        })
        return;
    }

    const { data: uploadResult } = await axios.post(`${process.env.UTILS_SERVICE}/api/upload`, {
        buffer: fileBuffer.content,
    });

    const restaurant = await Restaurant.create({
        ownerId: user._id,
        name,
        description,
        autolocation: {
            type: "Point",
            coordinates: [Number(longitude), Number(lattitude)],
            formattedAddress,
        },

        phone,
        image: uploadResult.url,
        isVerified: false,
    });

    return res.status(201).json({
        message: "Restaurant added successfully",
        restaurant,
    });
})

export const fetchMyRestaurant = TryCatch(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
        res.status(401).json({
            message: "Unauthorized",
        })
        return;
    }

    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });

    if (!restaurant) {
        res.status(404).json({
            message: "Restaurant not found",
        })
        return;
    }

    if (!req.user.restaurantId) {
        const token = jwt.sign({
            user: {
                ...req.user,
                restaurantId: restaurant._id
            },
        }, process.env.JWT_SECRET as string, { expiresIn: "15d" });
        return res.json({
            restaurant,
            token
        });
    }

    res.json({ restaurant })

})


export const updateStatusRestaurant = TryCatch(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const { status } = req.body

    if (typeof status !== "boolean") {
        return res.status(400).json({ message: "Status must be a boolean value" });
    }

    const restaurant = await Restaurant.findOneAndUpdate({
        ownerId: req.user._id,
    },
        { isOpen: status },
        { new: true }
    );

    if (!restaurant) {
        return res.status(404).json({
            message: "Restaurant not found",
        });
    }

    res.json({
        message: "Restaurant status updated",
        restaurant,
    });
});


export const updateRestaurant = TryCatch(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const { name, description } = req.body;

    const restaurant = await Restaurant.findOneAndUpdate({
        ownerId: req.user._id
    },
        { name: name, description: description },
        { new: true }
    )

    if (!restaurant) {
        return res.status(404).json({
            message: "Restaurant not found",
        });
    }

    res.json({
        message: "Restaurant updated",
        restaurant,
    });

})
