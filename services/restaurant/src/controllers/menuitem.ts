import axios from "axios";
import getBuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import TryCatch from "../middleware/trycatch.js"
import MenuItems from "../models/MenuItems.js";
import Restaurant from "../models/Restaurant.js";

export const addMenuItem = TryCatch(async (req: AuthenticatedRequest, res) => {

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });

    if (!restaurant) {
        res.status(404).json({ message: "Restaurant not found" });
        return;
    }

    const { name, description, price } = req.body;

    if (!name || !price) {
        res.status(400).json({ message: "Name and price are required" });
    }

    const file = req.file;

    if (!file) {
        res.status(400).json({ message: "Image is required" });
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer?.content) {
        res.status(400).json({ message: "Invalid image file" });
    }

    const { data: uploadResult } = await axios.post(`${process.env.UTILS_SERVICE}/api/upload`, {
        buffer: fileBuffer.content,
    });

    const item = await MenuItems.create({
        name,
        description,
        price,
        restaurantId: restaurant._id,
        image: uploadResult.url,
    })

    res.json({
        message: "Menu item added successfully",
        item,
    })

});


export const getAllItems = TryCatch(async (req: AuthenticatedRequest, res) => {

    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Restaurant ID is required" });
    }

    const items = await MenuItems.find({ restaurantId: id });
    res.json({
        items,
    });
});
