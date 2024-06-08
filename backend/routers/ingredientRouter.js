import express from "express";
import auth from "../middlewares/auth.js";
import authAdmin from "../middlewares/authAdmin.js";
import { createIngredient, updateIngredient, deleteIngredient, getAllIngredients, getIngredientById } from "../controllers/ingredientController.js";

const IngredientRouter = express.Router();


IngredientRouter.get("/getAll", getAllIngredients);
IngredientRouter.get("/:ingredientId", getIngredientById);
IngredientRouter.post("/create", createIngredient);
IngredientRouter.put("/:ingredientId", updateIngredient);
IngredientRouter.delete("/:ingredientId", deleteIngredient);

export default IngredientRouter;