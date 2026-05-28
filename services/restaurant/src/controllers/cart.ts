import mongoose, { mongo } from "mongoose";
import TryCatch from "../middleware/trycatch.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import Cart from "../models/Cart.js";


export const addToCart = TryCatch(async (req: AuthenticatedRequest, res) => {
    if(!req.user) {
        return res.status(401).json({
            message: "Please login",
        });
    }

    const userId = req.user._id;

    const {restaurantId, itemId} = req.body;

    if (
        !mongoose.Types.ObjectId.isValid(restaurantId) ||
        !mongoose.Types.ObjectId.isValid(itemId)
    ) {
        return res.status(400).json({
            message: "Invalid restaurant and item id",
        });
    }

    const cartFromDifferentRestaurant = await Cart.findOne({
        userId,
        restaurantId: { $ne: restaurantId},
    })

    if(cartFromDifferentRestaurant) {
        return res.status(400).json({
            message: "You can order from only one restaurant at a time. Please clear your cart first to add items from this restaurant."
        });
    }

    const cartItem = await Cart.findOneAndUpdate(
        {userId,restaurantId,itemId},
        {
            $inc: {quantity: 1},
            $setOnInsert: {userId, restaurantId, itemId},
        },
        {upsert: true, new: true, setDefaultsOnInsert: true}
    );

    res.json({
        message: "Item added to cart",
        cart: cartItem,
    });

})


export const fetchMyCart = TryCatch(async (req: AuthenticatedRequest, res) => {
    if(!req.user) {
        return res.status(401).json({
            message: "Please login",
        });
    }

    const userId = req.user._id;

    const cartItems = await Cart.find({ userId }).populate("restaurantId").populate("itemId");

    let subtotal = 0;
    let cartLength = 0;

    for (const cartItem of cartItems) {
        const item:any = cartItem.itemId;

        subtotal += item.price * cartItem.quantity;
        cartLength += cartItem.quantity
    }

    res.json({
        success: true,
        cartLength,
        subtotal,
        cart: cartItems,
    });

}) 