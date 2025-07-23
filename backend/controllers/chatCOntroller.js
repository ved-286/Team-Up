import mongoose from 'mongoose';
import Chat from '../models/Chat.Model.js';
import Message from '../models/MessageModal.js';
import User from '../models/userModel.js';

export const getOrCreatePriveteChat = async (req, res) => {
  const { userId } = req.body;
  const currentUserId = req.user.userId;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Ensure both IDs are valid
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(currentUserId)) {
      return res.status(400).json({ message: 'Invalid user ID(s)' });
    }

    // Find existing private chat
    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: {
        $all: [currentUserId, userId],
      },
    }).populate('participants', '-password');

    // If chat doesn't exist, create it
    if (!chat) {
      chat = await Chat.create({
        isGroupChat: false,
        participants: [currentUserId, userId],
      });

      chat = await chat.populate('participants', '-password');
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error('Error in getOrCreatePriveteChat:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const createGorupChat = async (req, res) => {
    const {name, userIds , projectId} = req.body;

    if(!userIds || userIds.length < 2) {
        return res.status(400).json({ message: 'At least two users are required to create a group chat' });
    }

    try{
        const chat = await Chat.create({
            name,
            isGroupChat: true,
            participants: [
                ...userIds,
                req.user.userId
            ],
            project: projectId
        });

        const populatedChat = await chat.populate('participants', '-password');
        res.status(201).json(populatedChat);
    }catch (error) {
        console.error('Error in createGorupChat:', error);
        res.status(500).json({ message: 'Internal server error' });
    }   }

    export const getUserChats = async (req, res) => {
        try{
            const chats = await Chat.find({
                participants: req.user.userId,
            })
            .populate('participants', '-password')
            .populate('project')
            .sort({ updatedAt: -1 });
        
        res.status(200).json(chats);
        } catch (error) {
            console.error('Error in getUserChats:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    export const sendMessage = async (req, res) => {
        const { chatId, content } = req.body;

        if (!chatId || !content) {
            return res.status(400).json({ message: 'Chat ID and content are required' });
        }

        try {
            const message = await Message.create({
                chat: chatId,
                sender: req.user.userId,
                content,
            });

            // Correct way to populate multiple fields on a document
            await message.populate([
                { path: 'sender', select: 'name email' },
                { path: 'chat' }
            ]);

            await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });

            res.status(201).json(message);
        } catch (error) {
            console.error('Error in sendMessage:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

export const getChatMessages = async (req, res) => {
  const { chatId } = req.params;

  if (!chatId) {
    return res.status(400).json({ message: 'Chat ID is required' });
  }

  try {
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name email')
      .populate('chat')
      .sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error in getChatMessages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}