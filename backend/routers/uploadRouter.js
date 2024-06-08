import express from "express";
import { uploadImage, destroyImage } from "../config/cloudinary.js";

const UploadRouter = express.Router();


UploadRouter.post("/upload", uploadImage);
UploadRouter.delete("/destroy", destroyImage);


export default UploadRouter;