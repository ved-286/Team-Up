import express from 'express';
import {getOrCreatePriveteChat , createGorupChat , sendMessage , getChatMessages , getUserChats } from '../controllers/chatCOntroller.js';
import { protect } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/private', protect, getOrCreatePriveteChat);
router.post('/group', protect, createGorupChat);
router.post('/:chatId/messages', protect, sendMessage);
router.get('/:chatId/messages', protect, getChatMessages);
router.get('/', protect, getUserChats);


export default router;