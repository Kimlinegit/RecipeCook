
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    comment: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
            required: true
        },
        replies: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                content: {
                    type: String,
                    required: true,
                    trim: true
                }
            }
        ]
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
}, {
    timestamps: true
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;