import express from "express";
import auth from "../middlewares/auth.js";
import authAdmin from "../middlewares/authAdmin.js";
import {
    createRecipe,
    getAllRecipes,
    updateRecipe,
    deleteRecipe,
    getUserRecipes,
    getMyRecipes,
    getRecipeById,
    addRecipeReview,
    addReviewReply,
    likeRecipe,
    shareRecipe
} from "../controllers/recipeController.js";

const RecipeRouter = express.Router();


RecipeRouter.get("/getAll", getAllRecipes);
RecipeRouter.post("/create", auth, createRecipe);
RecipeRouter.post("/:recipeId/addReview", auth, addRecipeReview);
RecipeRouter.post("/:recipeId/reviews/:reviewId/reply", auth, addReviewReply);
RecipeRouter.get("/:recipeId", getRecipeById);
RecipeRouter.get("/myRecipe", auth, getMyRecipes);
RecipeRouter.get("/:userId/recipe", getUserRecipes);
RecipeRouter.put("/:recipeId/like", auth, likeRecipe);
RecipeRouter.put("/:recipeId/share", auth, shareRecipe);
RecipeRouter.put("/:recipeId", auth, updateRecipe);
RecipeRouter.delete("/:recipeId", auth, deleteRecipe);

export default RecipeRouter;