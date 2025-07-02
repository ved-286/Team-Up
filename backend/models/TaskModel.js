import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'review','done'],
        default: 'todo',
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }, 
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },     
    dueDate: {
        type: Date,
        default: null,
    },
        priority:{
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
        },
}, { timestamps: true });

export const Task = mongoose.model('Task', taskSchema);