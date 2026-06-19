const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const {
  sendMessage,
  getMessages,
  markMessageRead,
} = require('../controllers/messageController');

// Message APIs
router.post('/', isAuthenticated, sendMessage);
router.get('/:chatId', isAuthenticated, getMessages);
router.put('/:id/read', isAuthenticated, markMessageRead);

module.exports = router; 