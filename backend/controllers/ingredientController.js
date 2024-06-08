import Ingredient from "../models/ingredientModel.js";

// Hàm tạo một Ingredient mới
const createIngredient = async (req, res) => {
    try {
        const { recipe, name, unit, image, description } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Name is required and cannot be empty." });
        }
        if (!unit || !unit.trim()) {
            return res.status(400).json({ message: "Unit is required and cannot be empty." });
        }
        if (!image) {
            return res.status(400).json({ message: "Chưa có ảnh được chọn!" })
        }

        const existIngredient = await Ingredient.findOne({ name });

        if (existIngredient) {
            return res.status(400).json({ message: "Nguyên liệu đã tồn tại!" });
        }

        const newIngredient = new Ingredient({
            // recipe,
            name: name.trim(),
            unit: unit.trim(),
            image,
            description: description ? description.trim() : "",
        });

        await newIngredient.save();
        res.status(201).json(newIngredient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Hàm cập nhật thông tin của một Ingredient
const updateIngredient = async (req, res) => {
    try {
        const { name, unit, image, description } = req.body;
        const ingredientId = req.params.ingredientId;

        const ingredient = await Ingredient.findById(ingredientId);

        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Name is required and cannot be empty." });
        }
        if (!unit || !unit.trim()) {
            return res.status(400).json({ message: "Unit is required and cannot be empty." });
        }
        if (!image) {
            return res.status(400).json({ message: "Chưa có ảnh được chọn!" })
        }

        if (!ingredient) {
            return res.status(404).json({ message: "Không tìm thấy nguyên liệu!" });
        }

        const existIngredient = await Ingredient.findOne({ name });
        if (existIngredient && existIngredient._id.toString() !== ingredientId) {
            return res.status(400).json({ message: "Nguyên liệu đã tồn tại!" });
        }

        if (name) {
            ingredient.name = name.trim();
        }

        if (unit) {
            ingredient.unit = unit.trim();
        }

        if (image) {
            ingredient.image = image;
        }

        if (description) {
            ingredient.description = description.trim();
        }

        await ingredient.save();
        res.status(200).json({ message: "Ingredient updated successfully!", ingredient });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Hàm xóa một Ingredient
const deleteIngredient = async (req, res) => {
    try {
        const ingredientId = req.params.ingredientId;

        const ingredient = await Ingredient.findById(ingredientId);

        if (!ingredient) {
            return res.status(404).json({ message: "Nguyên liệu không tồn tại!" });
        }

        await Ingredient.findByIdAndDelete(ingredientId);
        res.status(200).json({ message: "Xóa nguyên liệu thành công!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getIngredientById = async (req, res) => {
    try {
        const ingredientId = req.params.ingredientId;
        const ingredient = await Ingredient.findById(ingredientId);
        if (!ingredient) {
            return res.status(404).json({ message: "Nguyên liệu không tồn tại!" })
        }
        return res.status(200).json(ingredient);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Hàm lấy tất cả Ingredients
const getAllIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.find();
        res.status(200).json(ingredients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    createIngredient,
    updateIngredient,
    deleteIngredient,
    getAllIngredients,
    getIngredientById
};
