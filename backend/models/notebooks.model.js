import mongoose from 'mongoose';

const notebookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note',
    }],
}, {
    timestamps: true,
});

const Notebook = mongoose.model('Notebook', notebookSchema);
export default Notebook;
