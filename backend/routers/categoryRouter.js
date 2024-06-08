import express from "express";
// import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import auth from "../middlewares/auth.js";
import authAdmin from "../middlewares/authAdmin.js";
import { createCategory, updateCategory, deleteCategory, getAllCategory } from "../controllers/categoryController.js";

const CategoryRouter = express.Router();

// categoryRouter.get("/", getAllCategories);
// categoryRouter.post("/create", auth, authAdmin, createCategory);
// categoryRouter.put("/:categoryId", auth, authAdmin, updateCategory);
// categoryRouter.delete("/:categoryId", auth, authAdmin, deleteCategory);
CategoryRouter.get("/getAll", getAllCategory);
CategoryRouter.post("/create", createCategory);
CategoryRouter.put("/:categoryId", updateCategory);
CategoryRouter.delete("/:categoryId", deleteCategory);

export default CategoryRouter;