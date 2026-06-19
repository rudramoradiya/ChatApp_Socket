const createOneToOneChatService = require('../services/private_chat/createOneToOneChatService');
const getAllChatsService = require('../services/private_chat/getAllChatsService');
const getSingleChatService = require('../services/private_chat/getSingleChatService');
const deleteChatService = require('../services/private_chat/deleteChatService');

const createGroupChatService = require('../services/group_chat/createGroupChatService');
const editGroupService = require('../services/group_chat/editGroupService');
const addParticipantsService = require('../services/group_chat/addParticipantsService');
const removeParticipantService = require('../services/group_chat/removeParticipantService');
const deleteOrLeaveGroupService = require('../services/group_chat/deleteOrLeaveGroupService');
const getGroupByIdService = require('../services/group_chat/getGroupByIdService');

// 1:1 Chat Controllers
const createOneToOneChat = async (req, res) => {
  try {
    await createOneToOneChatService(req, res);
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getAllChats = async (req, res) => {
  try {
    await getAllChatsService(req, res);
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getSingleChat = async (req, res) => {
  try {
    await getSingleChatService(req, res);
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const deleteChat = async (req, res) => {
  try {
    await deleteChatService(req, res);
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

// Group Chat Controllers
const createGroupChat = async (req, res) => {
  try {
    await createGroupChatService(req, res);
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const editGroup = async (req, res) => {
  try {
    await editGroupService(req, res);
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const addParticipants = async (req, res) => {
  try {
    await addParticipantsService(req, res);
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const removeParticipant = async (req, res) => {
  try {
    await removeParticipantService(req, res);
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const deleteOrLeaveGroup = async (req, res) => {
  try {
    await deleteOrLeaveGroupService(req, res);
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getGroupById = async (req, res) => {
  try {
    await getGroupByIdService(req, res);
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

// Remove member by body payload (groupId + memberId)
const removeMemberByBody = async (req, res) => {
  try {
    // support receiving groupId and memberId in the body
    const { groupId, memberId } = req.body || {};
    if (groupId) req.params.id = groupId;
    if (memberId) req.body.userId = memberId;

    await removeParticipantService(req, res);
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  createOneToOneChat,
  getAllChats,
  getSingleChat,
  deleteChat,
  createGroupChat,
  editGroup,
  addParticipants,
  removeParticipant,
  deleteOrLeaveGroup,
  getGroupById,
  removeMemberByBody,
};
