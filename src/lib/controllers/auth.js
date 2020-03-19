const idService = require('../services/identity');

function responseFromError(err) {
  return {
    error: true,
    code: err.code,
    message: err.message,
    status: 403
  };
}

module.exports.createToken = async (req, res) => {
  const { username, password } = req.body;

  try {
    const idResponse = await idService.authenticate({username, password});
    res.json(idResponse);
  } catch(err) {
    res.status(403).json(responseFromError(err));
  }
};

module.exports.renewToken = async (req, res) => {
  const { username, refreshToken } = req.body;

  try {
    const idResponse = await idService.renew({username, refreshToken});
    res.json(idResponse);
  } catch(err) {
    res.status(403).json(responseFromError(err));
  }
};
