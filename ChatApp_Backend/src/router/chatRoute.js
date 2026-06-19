const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const {
  createOneToOneChat,
  getAllChats,
  getSingleChat,
  deleteChat,
  createGroupChat,
  editGroup,
  addParticipants,
  removeParticipant,
  removeMemberByBody,
  deleteOrLeaveGroup,
  getGroupById,
} = require('../controllers/chatController');
const getUploader = require('../middleware/upload');

const upload = getUploader('groups');


// 1:1 Chat
router.post('/one-to-one', isAuthenticated, createOneToOneChat);
router.get('/', isAuthenticated, getAllChats);
 // Group Chat
 router.post('/group', isAuthenticated, upload.single("groupImage"), createGroupChat);
 router.put('/group/:id', isAuthenticated, upload.single("groupImage"), editGroup);
 router.put('/group/:id/add', isAuthenticated, addParticipants);
 router.put('/group/:id/remove', isAuthenticated, removeParticipant);
 router.patch('/group/remove-member', isAuthenticated, removeMemberByBody);
 router.delete('/group/:id', isAuthenticated, deleteOrLeaveGroup);
 router.get('/group/:groupId', isAuthenticated, getGroupById);

 // 1:1 Chat
router.get('/:id', isAuthenticated, getSingleChat);
router.delete('/:id', isAuthenticated, deleteChat);

module.exports = router;
