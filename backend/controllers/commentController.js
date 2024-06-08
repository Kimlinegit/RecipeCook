import mongoose from "mongoose";
import Comment from "../models/commentModel";

// Hàm tạo một bình luận mới
const createComment = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { user, content } = req.body;

        // Tạo một đối tượng Comment mới
        const newComment = new Comment({ user, content });

        // Lưu Comment vào cơ sở dữ liệu
        const savedComment = await newComment.save();

        // Trả về kết quả
        res.status(201).json(savedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Hàm tạo một phản hồi mới cho bình luận
const createReply = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { user, content } = req.body;
        // Lấy id của Comment từ request params
        const { commentId } = req.params.commentId;

        // Tìm và cập nhật Comment
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Bình luận không tồn tại!" });
        }

        // Tạo một đối tượng Comment mới
        const newReply = new Comment({ user, content });

        // Lưu Reply vào mảng replies của Comment
        comment.replies.push(newReply._id);
        await comment.save();

        // Trả về kết quả
        res.status(201).json(newReply);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Hàm cập nhật thông tin của một bình luận
const updateComment = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { content } = req.body;
        // Lấy id của Comment từ request params
        const { commentId } = req.params.commentId;

        // Tìm và cập nhật Comment
        const updatedComment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true });

        // Kiểm tra xem Comment có tồn tại không
        if (!updatedComment) {
            return res.status(404).json({ message: "Bình luận không tồn tại!" });
        }

        // Trả về kết quả
        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Hàm cập nhật thông tin của một phản hồi
const updateReply = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { content } = req.body;
        // Lấy id của Comment và Reply từ request params
        const { commentId, replyId } = req.params;

        // Tìm Comment
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Bình luận không tồn tại!" });
        }

        // Tìm Reply trong mảng replies của Comment
        const replyIndex = comment.replies.findIndex(reply => reply.toString() === replyId);
        if (replyIndex === -1) {
            return res.status(404).json({ message: "Phản hồi không tồn tại!" });
        }

        // Cập nhật nội dung của phản hồi
        comment.replies[replyIndex].content = content;
        await comment.save();

        // Trả về kết quả
        res.json({ message: "Phản hồi đã được cập nhật thành công!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Hàm xóa một bình luận
const deleteComment = async (req, res) => {
    try {
        // Lấy id của Comment từ request params
        const { commentId } = req.params.commentId;

        // Xóa Comment từ cơ sở dữ liệu
        const deletedComment = await Comment.findByIdAndDelete(commentId);

        // Kiểm tra xem Comment có tồn tại không
        if (!deletedComment) {
            return res.status(404).json({ message: "Bình luận không tồn tại!" });
        }

        // Trả về kết quả
        res.json({ message: "Bình luận đã được xóa thành công!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Hàm xóa một phản hồi của bình luận
const deleteReply = async (req, res) => {
    try {
        // Lấy id của Comment và Reply từ request params
        const { commentId, replyId } = req.params;

        // Tìm và cập nhật Comment
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Bình luận không tồn tại!" });
        }

        // Lọc và xóa Reply khỏi mảng replies của Comment
        comment.replies = comment.replies.filter(reply => reply.toString() !== replyId);
        await comment.save();

        // Trả về kết quả
        res.json({ message: "Phản hồi đã được xóa thành công!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xuất các hàm controller để sử dụng ở nơi khác
export { createComment, createReply, updateComment, updateReply, deleteComment, deleteReply };

