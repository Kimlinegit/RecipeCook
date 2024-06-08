import Category from "../models/categoryModel.js";

// Hàm tạo một Category mới
const createCategory = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { name, description } = req.body;

        const existCategory = await Category.findOne({ name })

        if (existCategory) {
            return res.status(400).json({ message: "Danh mục đã tồn tại!" });
        }

        // Tạo một đối tượng Category mới
        const newCategory = new Category({ name, description });

        // Lưu Category vào cơ sở dữ liệu
        const savedCategory = await newCategory.save();

        // Trả về kết quả
        return res.status(201).json("Tạo mới danh mục thành công!");
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Hàm cập nhật thông tin của một Category
const updateCategory = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { name, description } = req.body;

        // Lấy id của Category từ request params
        // const { id } = req.params;
        const categoryId = req.params.categoryId;

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: "Danh mục không tồn tại!" })
        }

        // Kiểm tra xem tên mới có trùng với bất kỳ category nào khác không
        const existingCategory = await Category.findOne({ name });
        if (existingCategory && existingCategory._id.toString() !== categoryId) {
            return res.status(400).json({ message: "Tên danh mục đã tồn tại!" });
        }

        category.name = name;
        category.description = description;
        await category.save();

        // Trả về kết quả
        return res.status(200).json({ message: "Cập nhật danh mục thành công!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Hàm xóa một Category
const deleteCategory = async (req, res) => {
    try {
        // Lấy id của Category từ request params
        // const { id } = req.params;
        const categoryId = req.params.categoryId;

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: "Không tìm thấy danh mục!" });
        }
        await Category.findByIdAndDelete(categoryId);
        return res.status(200).json({ message: "Xóa danh mục thành công!" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Hàm lấy tất cả các Category
const getAllCategory = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Xuất các hàm controller để sử dụng ở nơi khác
export { createCategory, updateCategory, deleteCategory, getAllCategory };
