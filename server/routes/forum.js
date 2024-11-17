const express = require('express');
const Thread = require('../models/Thread');
const authMiddleware = require('../middleware/auth');

const router = express.Router();


// Get all messages for a specific course's discussion thread
router.get('/:courseId/threads', authMiddleware, async (req, res) => {
    try {
      const { courseId } = req.params;
  
      // Find the thread for the given course
      const thread = await Thread.findOne({ courseId });
      
      // If no thread exists yet, return an empty array
      if (!thread) {
        return res.json([]); 
      }
  
      res.json(thread.messages);
    } catch (error) {
      console.error("Error fetching threads:", error);
      res.status(500).json({ message: "Server error while fetching threads." });
    }
  });
  
  // Post a new message to a specific course's discussion thread
  router.post('/:courseId/threads', authMiddleware, async (req, res) => {
    try {
      const { courseId } = req.params;
      const { userName, message } = req.body; // Expect 'userName' and 'message' in request body
  
      // Find the thread by courseId or create a new one if it doesn't exist
      let thread = await Thread.findOne({ courseId });
      if (!thread) {
        thread = new Thread({ courseId, messages: [] });
      }
  
      // Add the new message with userName and message content
      thread.messages.push({ userName, message });
      await thread.save();
  
      res.status(201).json({ userName, message });
    } catch (error) {
      console.error("Error posting message:", error);
      res.status(500).json({ message: "Server error while posting message." });
    }
  });

module.exports = router;