const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const getUploader = require('../middleware/upload');
const { getUser, getUserById, updateUser, getAllUsers } = require('../controllers/userController');

const upload = getUploader('profiles');


router.get('/get-user', isAuthenticated, getUser);
router.get('/get-user/:userId', isAuthenticated, getUserById);
router.get('/get-all-user', isAuthenticated, getAllUsers);
router.put('/update-user/:userId', isAuthenticated,upload.single('profileImage'), updateUser);


module.exports =router