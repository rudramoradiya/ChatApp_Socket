const { Router } = require('express');
const healthCheckRoute = require('./healthCheckRoute');
const authRoute = require('./authRoute');
const userRoute = require('./userRoute')
const chatRoute = require('./chatRoute');
const messagesRoute = require('./messagesRoute');

const router = Router();

router.use('/', healthCheckRoute)
router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/chats', chatRoute);
router.use('/messages', messagesRoute);

module.exports = router;
