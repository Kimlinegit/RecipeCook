import Conversation from '../models/conversationModel.js';
import User from '../models/userModel.js';

const createConversation = async (req, res) => {
    try {
        const { receiverIds } = req.body;
        const senderId = req.user.id;

        // Kiểm tra xem tất cả các userId trong receiverIds có tồn tại không
        for (const userId of receiverIds) {
            const userExists = await User.exists({ _id: userId });
            if (!userExists) {
                return res.status(400).json({ message: `Người dùng có id ${userId} không tồn tại.` });
            }
        }

        let participants = [senderId, ...receiverIds];
        let isGroup = participants.length > 2;
        let groupName;

        if (isGroup) {
            const users = await User.find({ _id: { $in: participants } }, 'username');
            groupName = users.map(user => user.username).join(', ');
        } else {
            const otherUserId = participants.find(id => id.toString() !== senderId);
            const otherUser = await User.findById(otherUserId, 'username');
            groupName = otherUser.username;
        }

        let newConversation = new Conversation({
            participants,
            isGroup,
            groupName
        });

        await newConversation.save();

        const populatedConversation = await newConversation.populate('participants', 'username avatar')

        return res.status(201).json(populatedConversation);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateConversation = async (req, res) => {
    try {
        const { receiverIds, groupName } = req.body;
        const conversationId = req.params.conversationId;
        const userId = req.user.id;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ message: "Không tìm thấy nhóm chat" });
        }

        if (!conversation.participants.includes(userId)) {
            return res.status(403).json({ message: "Người dùng không thuộc nhóm chat" });
        }

        if (receiverIds) {
            // Thêm người dùng mới vào danh sách người tham gia
            receiverIds.forEach(receiverId => {
                if (!conversation.participants.includes(receiverId)) {
                    conversation.participants.push(receiverId);
                }
            });
            conversation.isGroup = conversation.participants.length > 2;
        }

        if (groupName) {
            // Cập nhật tên nhóm
            conversation.groupName = groupName;
        }

        await conversation.save();

        const populatedConversation = await Conversation.findById(conversationId)
            .populate('participants', 'username avatar')
            .populate('messages.sender', 'username avatar');

        return res.status(200).json(populatedConversation);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const deleteConversation = async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const userId = req.user.id;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ message: "Không tìm thấy nhóm chat" });
        }

        if (!conversation.participants.includes(userId)) {
            return res.status(403).json({ message: "Người dùng không thuộc nhóm chat" });
        }

        await Conversation.findByIdAndDelete(conversationId);

        return res.status(200).json({ message: "Xóa hội thoại thành công!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const addMessage = async (req, res) => {
    try {
        const { content } = req.body;
        const senderId = req.user.id;
        const conversationId = req.params.conversationId;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        if (!conversation.participants.includes(senderId)) {
            return res.status(403).json({ message: "You are not a participant in this conversation" });
        }

        conversation.messages.push({ sender: senderId, content });
        await conversation.save();

        const populatedConversation = await Conversation.findById(conversationId)
            .populate('participants', 'username avatar')
            .populate('messages.sender', 'username avatar');

        return res.status(201).json(populatedConversation);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getUserConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversations = await Conversation.find({ participants: userId })
            .populate('participants', 'username avatar')
            .populate('messages.sender', 'username avatar')
            .sort({ updatedAt: -1 });

        return res.status(200).json(conversations);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



export {
    createConversation,
    updateConversation,
    deleteConversation,
    addMessage,
    getUserConversations
};
