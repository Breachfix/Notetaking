import Notebook from '../models/notebooks.model.js';
import Note from '../models/note.model.js';


// Fetch all notebooks for the authenticated user
export const getNotebooks = async (req, res) => {
    try {
        const notebooks = await Notebook.find({ user: req.user._id });
        res.status(200).json({ success: true, notebooks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new notebook
export const createNotebook = async (req, res) => {
    try {
        const notebook = new Notebook({
            name: req.body.name,
            user: req.user._id,
        });

        const createdNotebook = await notebook.save();
        res.status(201).json({ success: true, notebook: createdNotebook });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Fetch all notes within a specific notebook
export const getNotesInNotebook = async (req, res) => {
    try {
      const notebook = await Notebook.findById(req.params.notebookId).populate('notes');
      if (!notebook) {
        return res.status(404).json({ success: false, message: 'Notebook not found' });
      }
      res.status(200).json({ success: true, notes: notebook.notes });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

// Create a note within a specific notebook
// Create a note within a specific notebook
export const createNoteInNotebook = async (req, res) => {
    try {
      const notebook = await Notebook.findById(req.params.notebookId);
      if (!notebook) {
        return res.status(404).json({ success: false, message: 'Notebook not found' });
      }
  
      // Include the notebookId in the note creation process
      const note = new Note({
        title: req.body.title,
        content: req.body.content,
        notebookId: req.params.notebookId,  // Make sure notebookId is passed
        user: req.user._id,
      });
  
      const createdNote = await note.save();
      notebook.notes.push(createdNote._id);
      await notebook.save();
  
      res.status(201).json({ success: true, note: createdNote });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  

// Update an existing notebook
export const updateNotebook = async (req, res) => {
    try {
        const { notebookId } = req.params;
        const { name } = req.body;

        const notebook = await Notebook.findById(notebookId);
        if (!notebook) {
            return res.status(404).json({ success: false, message: 'Notebook not found' });
        }

        if (notebook.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        notebook.name = name || notebook.name;
        const updatedNotebook = await notebook.save();

        res.status(200).json({ success: true, notebook: updatedNotebook });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a note by its ID within a specific notebook
export const deleteNoteById = async (req, res) => {
    try {
        const { notebookId, noteId } = req.params;

        const notebook = await Notebook.findById(notebookId);
        if (!notebook) {
            return res.status(404).json({ success: false, message: 'Notebook not found' });
        }

        if (notebook.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        // Remove the note from the notebook's notes array
        notebook.notes = notebook.notes.filter(note => note.toString() !== noteId);
        await notebook.save();

        // Delete the note document itself
        const deletedNote = await Note.findByIdAndDelete(noteId);
        if (!deletedNote) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        }

        res.status(200).json({ success: true, message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Delete an existing notebook and its notes
export const deleteNotebook = async (req, res) => {
    try {
        const { notebookId } = req.params;

        const notebook = await Notebook.findById(notebookId);
        if (!notebook) {
            return res.status(404).json({ success: false, message: 'Notebook not found' });
        }

        if (notebook.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        // Delete all notes in this notebook
        await Note.deleteMany({ _id: { $in: notebook.notes } });

        // Delete the notebook
        await Notebook.deleteOne({ _id: notebookId });

        res.status(200).json({ success: true, message: 'Notebook and its notes deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateNoteByIdInNotebook = async (req, res) => {
    try {
        const { notebookId, noteId } = req.params;
        const { title, content } = req.body;

        const notebook = await Notebook.findById(notebookId);
        if (!notebook) {
            return res.status(404).json({ success: false, message: 'Notebook not found' });
        }

        const note = await Note.findOneAndUpdate(
            { _id: noteId, _id: { $in: notebook.notes } },
            { title, content, updatedAt: Date.now() },
            { new: true }
        );

        if (!note) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        }

        res.status(200).json({ success: true, note });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getNoteByIdInNotebook = async (req, res) => {
    try {
        const { notebookId, noteId } = req.params;

        const notebook = await Notebook.findById(notebookId);
        if (!notebook) {
            return res.status(404).json({ success: false, message: 'Notebook not found' });
        }

        const note = await Note.findOne({ _id: noteId, _id: { $in: notebook.notes } });
        if (!note) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        }

        res.status(200).json({ success: true, note });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Fetch all notes from all notebooks for the authenticated user
export const getAllNotesFromAllNotebooks = async (req, res) => {
    try {
        // Find all notebooks for the authenticated user
        const notebooks = await Notebook.find({ user: req.user._id }).populate('notes');

        // Extract all notes from the user's notebooks
        const allNotes = notebooks.reduce((acc, notebook) => {
            return acc.concat(notebook.notes);
        }, []);

        res.status(200).json({ success: true, notes: allNotes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get the notebook ID by note title
export const getNotebookByNoteTitle = async (req, res) => {
    try {
      const { noteTitle } = req.params;
      
      // Find the note by title and populate the associated notebook
      const note = await Note.findOne({ title: noteTitle }).populate('notebookId');
      
      if (!note) {
        return res.status(404).json({ success: false, message: 'Note not found' });
      }
  
      // Return the notebook ID the note belongs to
      res.status(200).json({ success: true, notebookId: note.notebookId });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

  
  
  
