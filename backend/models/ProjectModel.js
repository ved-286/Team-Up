import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,

    },
    description: {
        type: String,
        
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    collaborators: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
},{timestamps: true});

export const Project = mongoose.model('Project', projectSchema);