

import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    messages: [
        {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            content: {
                type: String,
                required: true,
                trim: true
            }
        }
    ],
    isGroup: {
        type: Boolean,
        default: false
    },
    groupName: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;