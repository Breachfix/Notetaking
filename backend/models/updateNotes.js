import Note from './note.model.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI; // Ensure this is correctly set in your .env file

async function updateNotesWithNotebookId() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');

    // Replace these IDs with the actual valid IDs from your MongoDB
    const validNotebookId = '66ce9fd287d4c5fdb4c67a32'; // Example notebookId from your MongoDB
    const validUserId = '66ce9fd287d4c5fdb4c67a32'; // Example userId from your MongoDB

    // Ensure the ObjectIds are valid
    const notebookId = new mongoose.Types.ObjectId(validNotebookId);
    const userId = new mongoose.Types.ObjectId(validUserId);

    // Update notes with the notebookId
    const updatedNotes = await Note.updateMany(
      { notebookId: { $exists: false } }, // Update notes where notebookId is missing
      {
        $set: {
          notebookId: notebookId,
          user: userId, // Assuming you want to update the user field as well
        },
      }
    );

    console.log(`Updated ${updatedNotes.nModified} notes with notebookId.`);
  } catch (error) {
    console.error('Error updating notes:', error);
  } finally {
    await mongoose.connection.close();
  }
}

updateNotesWithNotebookId();