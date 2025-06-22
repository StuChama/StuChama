// controllers/meetingController.js
const db = require('../db/pool');

const uploadMeetingNoteController = async (req, res) => {
  try {
    const fileUrl = req.file.path;
    const { group_id, uploaded_by, title } = req.body;

    if (!group_id || !uploaded_by || !title || !fileUrl) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    await db.query(
      'INSERT INTO meeting_notes (group_id, uploaded_by, title, file_url) VALUES ($1, $2, $3, $4)',
      [group_id, uploaded_by, title, fileUrl]
    );

    res.status(201).json({ message: 'File uploaded successfully', fileUrl });
  } catch (error) {
    console.error('Error uploading meeting note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getMeetingNotesController = async (req, res) => {
  try {
    const { group_id } = req.query;

    if (!group_id) {
      return res.status(400).json({ message: 'Group ID is required' });
    }

    const result = await db.query(
      'SELECT * FROM meeting_notes WHERE group_id = $1 ORDER BY uploaded_at DESC',
      [group_id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching meeting notes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  uploadMeetingNoteController,
  getMeetingNotesController
};
