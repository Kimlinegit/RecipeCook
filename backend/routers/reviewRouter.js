import express from "express";
import auth from "../middlewares/auth.js";
import authAdmin from "../middlewares/authAdmin.js";
import {
    createReview,
    updateReview,
    deleteReview,
    addReply,
    updateReply,
    deleteReply,
    getAllReviewReply
} from "../controllers/reviewController.js";

const ReviewRouter = express.Router();



ReviewRouter.post("/create", auth, createReview);
ReviewRouter.put("/:reviewId/reply/:replyId", auth, updateReply);
ReviewRouter.delete("/:reviewId/reply/:replyId", auth, deleteReply);
ReviewRouter.get("/:reviewId/allReply", getAllReviewReply);
ReviewRouter.post("/:reviewId/reply", auth, addReply);
ReviewRouter.put("/:reviewId", auth, updateReview);
ReviewRouter.delete("/:reviewId", auth, deleteReview);

export default ReviewRouter;