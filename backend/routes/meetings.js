// routes/meetingRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { pdfStorage } = require('../utils/cloudinary');
const {
  uploadMeetingNoteController,
  getMeetingNotesController
} = require('../controllers/meetingController');

const upload = multer({ storage: pdfStorage });

// Upload a new meeting note (PDF)
router.post('/upload-note', upload.single('file'), uploadMeetingNoteController);

// Get all notes for a specific group
router.get('/', getMeetingNotesController);

module.exports = router;
