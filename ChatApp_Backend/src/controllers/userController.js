const getUserService = require("../services/user/getUserService");
const updateUserService = require("../services/user/updateUserService");
const getAllUsersService = require("../services/user/getAllUserService");
const getUserByIdService = require("../services/user/getUserByIdService");

// Get User Details
const getUser = async (req, res) => {
    try {
        await getUserService(req, res);
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

// Get User by ID (for profile viewing)
const getUserById = async (req, res) => {
    try {
        await getUserByIdService(req, res);
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

// Update User Details
const updateUser = async (req, res) => {
    try {
        await updateUserService(req, res);
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

// Get ALl User Details
const getAllUsers = async (req, res) => {
    try {
        await getAllUsersService(req, res);
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

module.exports = {
    getUser,
    getUserById,
    updateUser,
    getAllUsers
  };