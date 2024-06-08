import Recipe from "../models/recipeModel.js";
import User from "../models/userModel.js";
import Review from "../models/reviewModel.js";
import mongoose from 'mongoose';

// Tạo một công thức mới
const createRecipe = async (req, res) => {
    try {
        const { title, images, description, ingredients, instructions, category } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!title || !title.trim()) {
            return res.status(400).json({ message: "Tiêu đề không được để trống!" });
        }
        // if (!description || !description.trim()) {
        //     return res.status(400).json({ message: "Mô tả không được để trống!" });
        // }
        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ message: "Nguyên liệu không được để trống!" });
        }
        if (!instructions || !Array.isArray(instructions) || instructions.length === 0) {
            return res.status(400).json({ message: "Hướng dẫn không được để trống!" });
        }
        if (!category || !category.trim()) {
            return res.status(400).json({ message: "Danh mục không được để trống!" });
        }

        // Kiểm tra hình ảnh (tùy chọn, vì có thể không bắt buộc)
        if (!images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ message: "Vui lòng cung cấp ít nhất một ảnh!" });
        }

        // Tạo một đối tượng Recipe mới
        const newRecipe = new Recipe({
            owner: req.user.id,
            title: title.trim(),
            images,
            description: description.trim(),
            ingredients,
            instructions,
            category: category.trim(),
        });

        // Lưu Recipe vào cơ sở dữ liệu
        await newRecipe.save();
        res.status(201).json({ message: "Công thức được tạo thành công!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// const createRecipe = async (req, res) => {
//     try {
//         const { title, images, description, ingredients, instructions, category } = req.body;
//         const userId = req.user.id; // Giả định rằng bạn có middleware để lấy user từ token

//         // Kiểm tra các giá trị đầu vào
//         if (!title || !instructions || !category) {
//             return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin bắt buộc!" });
//         }

//         if (!Array.isArray(images) || images.length === 0) {
//             return res.status(400).json({ message: "Vui lòng cung cấp ít nhất một hình ảnh!" });
//         }

//         if (!Array.isArray(ingredients) || ingredients.length === 0) {
//             return res.status(400).json({ message: "Vui lòng cung cấp ít nhất một nguyên liệu!" });
//         }

//         if (!Array.isArray(instructions) || instructions.length === 0) {
//             return res.status(400).json({ message: "Vui lòng cung cấp ít nhất một hướng dẫn!" });
//         }

//         // Tạo một đối tượng Recipe mới
//         const newRecipe = new Recipe({
//             owner: mongoose.Types.ObjectId(userId),
//             title,
//             images,
//             description,
//             ingredients: ingredients.map(ingredient => ({
//                 ingredient: mongoose.Types.ObjectId(ingredient.ingredient),
//                 quantity: ingredient.quantity
//             })),
//             instructions,
//             category: mongoose.Types.ObjectId(category),
//         });

//         // Lưu recipe vào cơ sở dữ liệu
//         await newRecipe.save();

//         // Trả về kết quả
//         return res.status(201).json(newRecipe);
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };

// Lấy danh sách tất cả các công thức
const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate('owner', 'username avatar')
            .populate('category', 'name')
            .populate({
                path: 'ingredients.ingredient',
                select: 'name unit image'
            })
            .populate('likes', 'username avatar')
            .populate({
                path: 'reviews',
                populate: {
                    path: 'comment.user',
                    select: 'username avatar'
                }
            })
            .populate('shares', 'username avatar');
        // .populate({
        //     path: 'ingredients',
        //     populate: {
        //         path: 'ingredient',
        //         select: 'name unit image'
        //     }
        // });
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thông tin chi tiết một công thức
const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId)
            .populate('owner', 'username')
            .populate('category', 'name')
            .populate('ingredients.ingredient', 'name')
        // .populate('reviews');

        if (!recipe) {
            return res.status(404).json({ message: "Không tìm thấy công thức!" });
        }

        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// const getUserRecipes = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         // Kiểm tra ObjectId hợp lệ cho userId
//         if (!mongoose.Types.ObjectId.isValid(userId)) {
//             return res.status(400).json({ message: "User ID không hợp lệ!" });
//         }

//         // Tìm tất cả các công thức của người dùng cụ thể
//         const recipes = await Recipe.find({ owner: userId })
//             .populate('owner', 'username')
//             .populate('category', 'name')
//             .populate({
//                 path: 'ingredients.ingredient',
//                 select: 'name unit'
//             });

//         if (recipes.length === 0) {
//             return res.status(404).json({ message: "Người dùng này chưa có công thức nào!" });
//         }

//         return res.status(200).json(recipes);
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };

const getUserRecipes = async (req, res) => {
    try {
        const userId = req.params.userId; // Lấy ID của người dùng từ token xác thực

        const recipes = await Recipe.find({ owner: userId })
            .populate('owner', 'username avatar')
            .populate('category', 'name')
            .populate({
                path: 'ingredients.ingredient',
                select: 'name unit image'
            })
            .populate('likes', 'username avatar')
            .populate('reviews', 'comment rating')
            .populate('shares', 'username avatar');

        if (!recipes || recipes.length === 0) {
            return res.status(404).json({ message: "No recipes found for this user" });
        }

        return res.status(200).json(recipes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getMyRecipes = async (req, res) => {
    try {
        const userId = req.user.id;

        // Kiểm tra xem userId có phải là ObjectId hợp lệ hay không
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const recipes = await Recipe.find({ owner: userId })
            .populate('owner', 'username avatar')
            .populate('category', 'name')
            .populate({
                path: 'ingredients.ingredient',
                select: 'name unit image'
            })
            .populate('likes', 'username avatar')
            .populate('reviews', 'comment rating')
            .populate('shares', 'username avatar');

        if (!recipes || recipes.length === 0) {
            return res.status(404).json({ message: "No recipes found for this user" });
        }

        return res.status(200).json(recipes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// Cập nhật một công thức
const updateRecipe = async (req, res) => {
    try {
        const { title, images, description, ingredients, instructions, category } = req.body;
        const recipe = await Recipe.findById(req.params.recipeId);

        if (!recipe) {
            return res.status(404).json({ message: "Không tìm thấy công thức!" });
        }

        if (recipe.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Không có quyền cập nhật công thức này!" });
        }

        recipe.title = title || recipe.title;
        recipe.images = images || recipe.images;
        recipe.description = description || recipe.description;
        recipe.ingredients = ingredients || recipe.ingredients;
        recipe.instructions = instructions || recipe.instructions;
        recipe.category = category || recipe.category;

        await recipe.save();
        res.status(200).json({ message: "Cập nhật công thức thành công!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa một công thức
const deleteRecipe = async (req, res) => {
    try {

        const recipeId = req.params.recipeId;

        const existingRecipe = await Recipe.findById(recipeId);

        if (!existingRecipe) {
            return res.status(404).json({ message: "Không tìm thấy công thức!" });
        }

        if (existingRecipe.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Không có quyền xóa công thức này!" });
        }

        await Recipe.findByIdAndDelete(recipeId);
        res.status(200).json({ message: "Xóa công thức thành công!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm đánh giá vào một công thức cụ thể
const addRecipeReview = async (req, res) => {
    try {
        const { content, rating } = req.body;
        const userId = req.user.id; // Lấy ID người dùng từ token
        const { recipeId } = req.params;

        // Kiểm tra xem rating có nằm trong khoảng từ 1 đến 5 không
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Đánh giá phải nằm trong khoảng từ 1 đến 5!" });
        }

        // Tìm công thức theo ID
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: "Không tìm thấy công thức!" });
        }

        // Tạo một đối tượng đánh giá mới
        const newReview = new Review({
            comment: { user: userId, content },
            rating
        });

        // Lưu đánh giá vào cơ sở dữ liệu
        await newReview.save();

        // Thêm đánh giá vào công thức
        recipe.reviews.push(newReview._id);

        // Cập nhật đánh giá trung bình
        const totalReviews = recipe.reviews.length;
        const currentAvgRating = recipe.avgRating;
        const newAvgRating = ((currentAvgRating * (totalReviews - 1)) + rating) / totalReviews;
        recipe.avgRating = newAvgRating;


        // Lưu công thức đã cập nhật
        await recipe.save();

        // Điền trường user trong đánh giá và trả về công thức đã cập nhật
        const populatedReview = await Review.findById(newReview._id).populate('comment.user', 'username avatar');
        const updatedRecipe = await Recipe.findById(recipeId).populate('reviews');

        res.status(201).json({ recipe: updatedRecipe, review: populatedReview });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// const addReviewReply = async (req, res) => {
//     try {
//         const { recipeId, reviewId } = req.params;
//         const { content } = req.body;
//         const userId = req.user.id; // Giả sử userId được lưu trong token

//         // Tìm recipe và kiểm tra xem nó có tồn tại không
//         const recipe = await Recipe.findById(recipeId);
//         if (!recipe) {
//             return res.status(404).json({ message: "Công thức không tồn tại!" });
//         }

//         // Kiểm tra xem review có tồn tại không
//         const review = await Review.findById(reviewId);
//         if (!review) {
//             return res.status(404).json({ message: "Đánh giá không tồn tại!" });
//         }

//         // Thêm reply mới vào review
//         const newReply = {
//             user: userId,
//             content
//         };

//         review.comment.replies.push(newReply);

//         // Lưu cập nhật review vào cơ sở dữ liệu
//         await review.save();

//         // Populate lại review sau khi thêm reply mới
//         const populatedReview = await Review.findById(reviewId).populate({
//             path: 'comment.replies.user',
//             select: 'username avatar'
//         });

//         // Trả về kết quả
//         return res.status(201).json(populatedReview);
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };

const addReviewReply = async (req, res) => {
    try {
        const { recipeId, reviewId } = req.params;
        const { content } = req.body;
        const userId = req.user.id; // Giả sử userId được lưu trong token

        // Tìm review theo reviewId
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Đánh giá không tồn tại!" });
        }

        // Thêm phản hồi vào mảng replies
        review.comment.replies.push({ user: userId, content });
        await review.save();

        // Tìm công thức và cập nhật review
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: "Công thức không tồn tại!" });
        }

        // Cập nhật lại thông tin review trong công thức
        const reviewIndex = recipe.reviews.indexOf(reviewId);
        if (reviewIndex === -1) {
            return res.status(404).json({ message: "Đánh giá không thuộc về công thức nấu ăn này!" });
        }

        recipe.reviews[reviewIndex] = review._id;
        await recipe.save();

        return res.status(201).json(review);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const likeRecipe = async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        const userId = req.user.id;

        const recipe = await Recipe.findById(recipeId);

        if (!recipe) {
            return res.status(404).json({ message: "Không tìm thấy công thức!" });
        }

        const likeIndex = recipe.likes.indexOf(userId);

        if (likeIndex === -1) {
            // Nếu người dùng chưa thích recipe này, thêm userId vào mảng likes
            recipe.likes.push(userId);
        } else {
            // Nếu người dùng đã thích recipe này, xóa userId khỏi mảng likes
            recipe.likes.splice(likeIndex, 1);
        }

        await recipe.save();

        const populatedRecipe = await Recipe.findById(recipeId)
            .populate('owner', 'username avatar')
            .populate('likes', 'username avatar')
            .populate({
                path: 'ingredients.ingredient',
                select: 'name unit image'
            });

        return res.status(200).json(populatedRecipe);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const shareRecipe = async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        const userId = req.user.id;

        const recipe = await Recipe.findById(recipeId);

        if (!recipe) {
            return res.status(404).json({ message: "Không tìm thấy công thức!" });
        }

        if (!recipe.shares.includes(userId)) {
            recipe.shares.push(userId);
        }

        await recipe.save();

        const populatedRecipe = await Recipe.findById(recipeId)
            .populate('owner', 'username avatar')
            .populate('shares', 'username avatar')
            .populate({
                path: 'ingredients.ingredient',
                select: 'name unit image'
            });

        return res.status(200).json(populatedRecipe);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export {
    createRecipe,
    getAllRecipes,
    getUserRecipes,
    getMyRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    addRecipeReview,
    addReviewReply,
    likeRecipe,
    shareRecipe
};
