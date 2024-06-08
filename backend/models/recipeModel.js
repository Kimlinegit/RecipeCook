
import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    images: [
        {
            type: Object
        }
    ],
    description: {
        type: String,
        trim: true
    },
    ingredients: [
        {
            ingredient: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Ingredient"
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    instructions: [
        {
            type: String,
            required: true,
            trim: true
        }
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    avgRating: {
        type: Number,
        default: 0
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
            default: []
        }
    ],
    shares: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ]
}, {
    timestamps: true
});

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;