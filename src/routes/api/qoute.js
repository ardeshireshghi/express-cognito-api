const express = require('express');
const qouteRouter = express.Router();

const { authoriser } = require('../middlewares/authoriser');

qouteRouter.post('/', [authoriser, (req, res, next)  => {
  res.send(`Hi ${res.locals.user.username}, your quote API call is authenticated!`);
  next();
}]);

module.exports = qouteRouter;
