// controllers/meetingController.js
const pool = require('../db/pool');
const { cloudinary } = require('../utils/cloudinary');

const uploadMeetingNoteController = async (req, res) => {
  try {
    const { title, group_id, uploaded_by } = req.body;
    const file_url = req.file?.path;
    const cloudinary_public_id = req.file?.filename; 
    // console.log("File received:", req.file);



    if (!file_url || !title || !group_id || !uploaded_by || !cloudinary_public_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
  `INSERT INTO meeting_notes (group_id, uploaded_by, title, file_url, cloudinary_public_id)
   VALUES ($1, $2, $3, $4, $5) RETURNING *`,
  [group_id, uploaded_by, title, file_url, cloudinary_public_id]
);


    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Upload meeting note error:', error);
    res.status(500).json({ error: 'Failed to upload meeting note' });
  }
};

const getMeetingNotesController = async (req, res) => {
  const { groupId } = req.query;

  try {
    const result = await pool.query(
      `SELECT mn.*, u.full_name 
       FROM meeting_notes mn
       JOIN users u ON mn.uploaded_by = u.user_id
       WHERE mn.group_id = $1
       ORDER BY mn.uploaded_at DESC`,
      [groupId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get meeting notes error:', error);
    res.status(500).json({ error: 'Failed to retrieve notes' });
  }
};

const deleteMeetingNoteController = async (req, res) => {
  const { noteId } = req.params;

  try {
    const result = await pool.query(
      'SELECT cloudinary_public_id FROM meeting_notes WHERE note_id = $1',
      [noteId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const publicId = result.rows[0].cloudinary_public_id;

    // Delete from Cloudinary
    if (publicId) {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    }

    // Delete from DB
    await pool.query('DELETE FROM meeting_notes WHERE note_id = $1', [noteId]);

    res.json({ message: 'Meeting note deleted successfully' });
  } catch (err) {
    console.error('Error deleting meeting note:', err);
    res.status(500).json({ error: 'Failed to delete meeting note' });
  }
};
module.exports = {
  uploadMeetingNoteController,
  getMeetingNotesController,
  deleteMeetingNoteController
};
