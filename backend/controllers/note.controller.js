import Note from '../models/note.model.js';
import User from '../models/user.model.js';
import Notebook from '../models/notebooks.model.js'; // Assuming you have a Notebook model
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';
import mongoose from 'mongoose';
const DEFAULT_NOTEBOOK_ID = '64f8ca5ff1bdfb6a4c8b4567';

// Create a note with a reference to a notebook
export async function createNote(req, res) {
    try {
        let { title, content, notebookId } = req.body;

        // If no notebookId is provided, use the default one
        if (!notebookId) {
            notebookId = DEFAULT_NOTEBOOK_ID;
        }

        // Validate if the notebookId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(notebookId)) {
            return res.status(400).json({ success: false, message: "Invalid notebook ID" });
        }

        // Check if the notebook exists, create it if not
        let notebook = await Notebook.findById(notebookId);
        if (!notebook) {
            // If the default notebook doesn't exist, create it
            if (notebookId === DEFAULT_NOTEBOOK_ID) {
                notebook = new Notebook({
                    _id: notebookId,
                    name: 'General Notebook',  // You can change this to a more descriptive name
                    user: req.user._id,  // Assuming the user who makes the request owns it
                });
                await notebook.save();
                console.log('Default notebook created successfully.');
            } else {
                return res.status(404).json({ success: false, message: "Notebook not found" });
            }
        }

        // Create the new note and associate it with the notebook
        const note = new Note({
            user: req.user._id,
            title,
            content,
            notebookId  // Assign the notebookId (either provided or default)
        });
        
        const savedNote = await note.save();
        res.status(201).json({ success: true, note: savedNote });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Fetch all notes belonging to the authenticated user
export async function getNotes(req, res) {
    try {
        const notes = await Note.find({ user: req.user._id }).populate('notebookId');  // Populate notebook details
        res.status(200).json({ success: true, notes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Fetch a note by its ID, ensuring it belongs to the user
export async function getNoteById(req, res) {
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.user._id }).populate('notebookId');
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }
        res.status(200).json({ success: true, note });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Update a note by its ID
export async function updateNote(req, res) {
    try {
        const { title, content, notebookId } = req.body;

        if (notebookId && !mongoose.Types.ObjectId.isValid(notebookId)) {
            return res.status(400).json({ success: false, message: "Invalid notebook ID" });
        }

        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { title, content, notebookId, updatedAt: Date.now() },
            { new: true }
        ).populate('notebookId'); // Populate notebook after update
        
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }
        
        res.status(200).json({ success: true, note });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Delete a note by its ID
export async function deleteNote(req, res) {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }
        res.status(200).json({ success: true, message: "Note deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get notebook by note title
export const getNotebookByNoteTitle = async (req, res) => {
    try {
        const { noteTitle } = req.params;

        // Find the note by title and populate the notebookId field
        const note = await Note.findOne({ title: noteTitle }).populate('notebookId');

        if (!note) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        }

        // Return the notebook ID in the response
        res.status(200).json({
            success: true,
            notebookId: note.notebookId ? note.notebookId._id : 'Notebook ID not populated'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
