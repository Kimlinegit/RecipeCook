import Review from '../models/reviewModel.js';
import mongoose from 'mongoose';

// Hàm tạo một đánh giá mới
const createReview = async (req, res) => {
    try {
        const { content, rating } = req.body;
        const userId = req.user.id; // Lấy ID của người dùng từ token

        // Kiểm tra xem rating có nằm trong khoảng từ 1 đến 5 không
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Đánh giá phải nằm trong khoảng từ 1 đến 5!" });
        }

        // Tạo một đối tượng đánh giá mới
        const newReview = new Review({
            comment: { user: userId, content },
            rating
        });

        // Lưu đánh giá vào cơ sở dữ liệu
        const savedReview = await newReview.save();

        // Populate để điền thông tin của người dùng
        // const populatedReview = await Review.findById(savedReview._id).populate('comment.user');
        const populatedReview = await Review.findById(savedReview._id).populate('comment.user', 'username avatar');

        // Trả về kết quả
        return res.status(201).json(populatedReview);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Hàm cập nhật một đánh giá đã tồn tại
const updateReview = async (req, res) => {
    try {
        const { content, rating } = req.body;
        const reviewId = req.params.reviewId;
        const user = req.user.id;

        // Kiểm tra xem review có tồn tại không
        const existingReview = await Review.findById(reviewId);
        if (!existingReview) {
            return res.status(404).json({ message: "Không tìm thấy đánh giá!" });
        }

        // Kiểm tra xem người dùng có quyền cập nhật đánh giá không
        if (existingReview.comment.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Bạn không có quyền cập nhật đánh giá này!" });
        }

        // Cập nhật thông tin đánh giá
        existingReview.comment.content = content;
        existingReview.rating = rating;

        // Lưu lại các thay đổi
        await existingReview.save();

        // Trả về kết quả
        return res.status(200).json(existingReview);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Hàm xóa một đánh giá đã tồn tại
const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        // Kiểm tra xem review có tồn tại không
        const existingReview = await Review.findById(reviewId);
        if (!existingReview) {
            return res.status(404).json({ message: "Không tìm thấy đánh giá!" });
        }

        // Kiểm tra xem người dùng có quyền xóa đánh giá không
        if (existingReview.comment.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Bạn không có quyền xóa đánh giá này!" });
        }

        // Xóa đánh giá
        await Review.findByIdAndDelete(reviewId);

        // Trả về kết quả
        return res.status(200).json({ message: "Xóa đánh giá thành công!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Hàm thêm một câu trả lời vào đánh giá đã tồn tại
const addReply = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.id;
        const reviewId = req.params.reviewId;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Không tìm thấy review!" });
        }

        const newReply = { user: userId, content };
        review.comment.replies.push(newReply);

        await review.save();

        const populatedReview = await Review.findById(reviewId).populate('comment.replies.user', 'username avatar');

        res.status(201).json(populatedReview);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// Hàm cập nhật một câu trả lời đã tồn tại trong đánh giá
const updateReply = async (req, res) => {
    try {
        const { content } = req.body;
        const { reviewId, replyId } = req.params;


        // Kiểm tra xem review có tồn tại không
        const existingReview = await Review.findById(reviewId);
        if (!existingReview) {
            return res.status(404).json({ message: "Không tìm thấy đánh giá!" });
        }

        // Tìm câu trả lời cần cập nhật
        const replyToUpdate = existingReview.comment.replies.find(reply => reply._id.toString() === replyId);
        if (!replyToUpdate) {
            return res.status(404).json({ message: "Không tìm thấy câu trả lời!" });
        }

        // Kiểm tra xem người dùng có quyền cập nhật câu trả lời không
        if (replyToUpdate.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Bạn không có quyền cập nhật câu trả lời này!" });
        }

        // Cập nhật nội dung của câu trả lời
        replyToUpdate.content = content;

        // Lưu lại các thay đổi
        await existingReview.save();

        // Trả về kết quả
        return res.status(200).json(existingReview);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Hàm xóa một câu trả lời khỏi đánh giá
const deleteReply = async (req, res) => {
    try {
        const { reviewId, replyId } = req.params;


        // Kiểm tra xem review có tồn tại không
        const existingReview = await Review.findById(reviewId);
        if (!existingReview) {
            return res.status(404).json({ message: "Không tìm thấy đánh giá!" });
        }

        // Tìm câu trả lời cần xóa
        const replyToDelete = existingReview.comment.replies.find(reply => reply._id.toString() === replyId);
        if (!replyToDelete) {
            return res.status(404).json({ message: "Không tìm thấy câu trả lời!" });
        }

        // Kiểm tra xem người dùng có quyền xóa câu trả lời không
        if (replyToDelete.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Bạn không có quyền xóa câu trả lời này!" });
        }

        // Xóa câu trả lời
        existingReview.comment.replies = existingReview.comment.replies.filter(reply => reply._id.toString() !== replyId);

        // Lưu lại các thay đổi
        await existingReview.save();

        // Trả về kết quả
        return res.status(200).json(existingReview);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const getAllReviewReply = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId).populate('comment.replies.user', 'username avatar');
        if (!review) {
            return res.status(404).json({ message: "Review không tồn tại!" });
        }

        const replies = review.comment.replies;
        return res.status(200).json(replies);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



export {
    createReview,
    updateReview,
    deleteReview,
    addReply,
    updateReply,
    deleteReply,
    getAllReviewReply
};
