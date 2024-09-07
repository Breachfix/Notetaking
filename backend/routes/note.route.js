import express from 'express';
import { 
  createNote, 
  getNotes, 
  getNoteById, 
  updateNote, 
  deleteNote, 
  getNotebookByNoteTitle // Import the function to get notebook by note title
} from '../controllers/note.controller.js';
import { protectForAPI } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route to create a note and get all notes for the authenticated user
router.route('/')
    .post(protectForAPI, createNote)   // Create a note
    .get(protectForAPI, getNotes);     // Get all notes for the authenticated user

// Route to get, update, and delete a note by its ID
router.route('/:id')
    .get(protectForAPI, getNoteById)   // Get a single note by ID
    .put(protectForAPI, updateNote)    // Update a note by ID
    .delete(protectForAPI, deleteNote); // Delete a note by ID

// Route to get notebook ID by note title
router.get('/note/:noteTitle', protectForAPI, getNotebookByNoteTitle); // Get notebook ID by note title

export default router;
