import express from "express";
import { isAuth, isSeller } from "../middleware/isAuth.js";
import { addMenuItem, deleteMenuItem, getAllItems, toggleMenuItemAvailability } from "../controllers/menuitem.js";

const router = express.Router();

router.post("/new",isAuth,isSeller, addMenuItem);
router.post("/all/:id",isAuth, getAllItems);
router.delete("/:id", isAuth, isSeller, deleteMenuItem);
router.put("/status/:id", isAuth, isSeller, toggleMenuItemAvailability);

export default router;