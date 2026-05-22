import express from "express";
import { isAuth, isSeller } from "../middleware/isAuth.js";
import { addMenuItem, getAllItems } from "../controllers/menuitem.js";

const router = express.Router();

router.post("/new",isAuth,isSeller, addMenuItem);
router.post("/all/:id",isAuth, getAllItems);


export default router;