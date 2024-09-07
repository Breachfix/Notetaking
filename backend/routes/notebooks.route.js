import express from 'express';
import {
    getNotebooks,
    createNotebook,
    getNotesInNotebook,
    createNoteInNotebook,
    getNoteByIdInNotebook,
    updateNoteByIdInNotebook,
    deleteNoteById,
    updateNotebook,
    deleteNotebook,
    getAllNotesFromAllNotebooks,
    getNotebookByNoteTitle
} from '../controllers/notebooks.controller.js';
import { protectForAPI } from '../middleware/auth.middleware.js';

const router = express.Router();

// Notebook routes
router.route('/')
    .get(protectForAPI, getNotebooks)
    .post(protectForAPI, createNotebook);

router.route('/:notebookId')
    .put(protectForAPI, updateNotebook)
    .delete(protectForAPI, deleteNotebook);

    router.route('/all-notes')
    .get(protectForAPI, getAllNotesFromAllNotebooks);

// Note routes within a notebook
router.route('/:notebookId/notes')
    .get(protectForAPI, getNotesInNotebook)
    .post(protectForAPI, createNoteInNotebook);

// Route to get the notebook ID by note title
router.route('/note/:noteTitle')
    .get(protectForAPI, getNotebookByNoteTitle);

router.route('/:notebookId/notes/:noteId')
    .get(protectForAPI, getNoteByIdInNotebook)
    .put(protectForAPI, updateNoteByIdInNotebook)
    .delete(protectForAPI, deleteNoteById);

export default router;
