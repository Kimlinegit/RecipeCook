import express from "express";
import auth from "../middlewares/auth.js";
import authAdmin from "../middlewares/authAdmin.js";
import {
    createConversation,
    updateConversation,
    deleteConversation,
    addMessage,
    getUserConversations
} from "../controllers/conversationController.js";

const ConversationRouter = express.Router();



ConversationRouter.post("/create", auth, createConversation);
ConversationRouter.post("/:conversationId/addMessage", auth, addMessage);
ConversationRouter.put("/:conversationId", auth, updateConversation);
ConversationRouter.delete("/:conversationId", auth, deleteConversation);
ConversationRouter.get("/myConversation", auth, getUserConversations);


export default ConversationRouter;