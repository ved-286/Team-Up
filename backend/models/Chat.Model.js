import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    name:{
        type: String,
       
    },
    isGroupChat: { // changed from isGroup to isGroupChat for consistency
        type: Boolean,
        default: false,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: function () {
            return this.isGroupChat; // only required for group chats
        }
    },
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
      },
      groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }},{timestamps: true});

     const Chat = mongoose.model('Chat', chatSchema); 
     export default Chat;