import axios from "axios";
import getBuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js"
import TryCatch from "../middleware/trycatch.js"
import Restaurant from "../models/Restaurant.js";

export const addRestaurant = TryCatch(async(req:AuthenticatedRequest, res) =>{
    const user = req.user;

    if(!user) {
        res.status(401).json({
            message: "Unauthorized",
        })
        return;
    }   

    const existingRestaurant = await Restaurant.findOne({ownerId: user._id});

    if(existingRestaurant) {
        res.status(400).json({
            message: "Restaurant already exists for this user",
        })
        return;
    }

    const{name, description,lattitude, longitude, formattedAddress,phone} = req.body;
     if(!name || !description || !lattitude || !longitude || !formattedAddress || !phone) {
        res.status(400).json({
            message: "All fields are required",
        })
        return;
     }

     const file = req.file;

     if(!file) {
        res.status(400).json({
            message: "Image is required",
        })
        return;
     }

     const fileBuffer = getBuffer(file);

     if(!fileBuffer?.content) {
        res.status(400).json({
            message: "Invalid image file",
        })
        return;
     }

     const {data:uploadResult} = await axios.post(`${process.env.UTILS_SERVICE}/api/upload`, {
        buffer: fileBuffer.content,
        });

     const restaurant = await Restaurant.create({
         ownerId: user._id,
         name,
         description,
         autolocation : {
             type: "Point",
             coordinates: [Number(longitude), Number(lattitude)],
             formattedAddress,
         },
         
         phone, 
         image: uploadResult.url,
     });

     return res.status(201).json({
         message: "Restaurant added successfully",
         restaurant,
     });
})