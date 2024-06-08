import Message from '../models/Message';
import User from '../models/User';

// Tạo cuộc trò chuyện
const sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.user.id;

        // Tìm hoặc tạo một cuộc trò chuyện giữa hai người dùng
        let conversation = await Message.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = new Message({
                participants: [senderId, receiverId],
                messages: [{ sender: senderId, content }]
            });
        } else {
            conversation.messages.push({ sender: senderId, content });
        }

        await conversation.save();

        // Populate các thông tin cần thiết trước khi trả về
        const populatedConversation = await conversation
            .populate('participants', 'username avatar')
            .populate('messages.sender', 'username avatar')
            .execPopulate();

        return res.status(201).json(populatedConversation);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách tin nhắn của một cuộc trò chuyện
const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const conversation = await Message.findById(conversationId)
            .populate('participants', 'username avatar')
            .populate('messages.sender', 'username avatar');

        if (!conversation) {
            return res.status(404).json({ message: "Cuộc trò chuyện không tồn tại!" });
        }

        return res.status(200).json(conversation);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách các cuộc trò chuyện của một người dùng
const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;

        const conversations = await Message.find({ participants: userId })
            .populate('participants', 'username avatar')
            .populate({
                path: 'messages.sender',
                select: 'username avatar'
            })
            .sort({ updatedAt: -1 });

        return res.status(200).json(conversations);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createConversation = async (req, res) => {
    try {
        const { receiverIds, isGroup, groupName } = req.body;
        const senderId = req.user.id;

        let conversation;

        if (isGroup) {
            conversation = new Message({
                participants: [senderId, ...receiverIds],
                isGroup,
                groupName,
                messages: []
            });
        } else {
            conversation = new Message({
                participants: [senderId, ...receiverIds],
                isGroup,
                messages: []
            });
        }

        await conversation.save();

        const populatedConversation = await conversation
            .populate('participants', 'username avatar')
            .execPopulate();

        return res.status(201).json(populatedConversation);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export { sendMessage, getMessages, getConversations };
