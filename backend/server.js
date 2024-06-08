import express from "express";
import connectDB from "./config/database.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import CategoryRouter from "./routers/categoryRouter.js";
import UploadRouter from "./routers/uploadRouter.js";
import UserRouter from "./routers/userRouter.js";
import RecipeRouter from "./routers/recipeRouter.js";
import IngredientRouter from "./routers/ingredientRouter.js";
import ReviewRouter from "./routers/reviewRouter.js";
import ConversationRouter from "./routers/conversationRouter.js";

dotenv.config();
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({
    useTempFiles: true
}));

app.use("/api/categories", CategoryRouter);
app.use("/api/images", UploadRouter);
app.use("/api/users", UserRouter);
app.use("/api/recipes", RecipeRouter);
app.use("/api/ingredients", IngredientRouter);
app.use("/api/reviews", ReviewRouter);
app.use("/api/conversations", ConversationRouter);

connectDB();

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});


