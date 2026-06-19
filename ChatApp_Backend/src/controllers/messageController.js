const sendMessageService = require('../services/messages/sendMessageService');
const getMessagesService = require('../services/messages/getMessagesService');
const markMessageReadService = require('../services/messages/markMessageReadService');

const sendMessage = async (req, res) => {
  try {
    await sendMessageService(req, res);
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    await getMessagesService(req, res);
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const markMessageRead = async (req, res) => {
  try {
    await markMessageReadService(req, res);
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markMessageRead,
};
