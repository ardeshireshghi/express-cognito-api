const express = require('express');
const qouteRouter = require('./api/qoute');
const authenticationController = require('../lib/controllers/auth');

const apiRouter = express.Router();

// Authentication
apiRouter.post('/api/auth/token', authenticationController.createToken);
apiRouter.post('/api/auth/token/renew', authenticationController.renewToken);

apiRouter.use('/api/quote', qouteRouter);

module.exports = apiRouter;
