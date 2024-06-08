
import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
    // recipe: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Recipe"
    // },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    unit: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: Object
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

export default Ingredient;