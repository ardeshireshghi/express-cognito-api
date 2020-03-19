const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoExpress = require('cognito-express');
const AuthToken = require('../models/auth-token');

require('dotenv').config();

global.fetch = require('node-fetch');

const { CognitoUserPool } = AmazonCognitoIdentity;

const poolData = {
  UserPoolId : process.env.COGNITO_USER_POOL_ID,
  ClientId : process.env.COGNITO_APP_CLIENT_ID
};

const cognitoExpress = new CognitoExpress({
  region: 'eu-west-1',
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID || 'eu-west-1_QrtJjYOkV',
  tokenUse: 'access', //Possible Values: access | id
  tokenExpiration: 3600000 // Up to default expiration of 1 hour (3600000 ms)
});

const userPool = new CognitoUserPool(poolData);

function cognitoUser({username, userPool}) {
  const userData = {
    Username: username,
    Pool: userPool
  };

  return new AmazonCognitoIdentity.CognitoUser(userData);
}

const identityService = {
  async authenticate({username, password}) {
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: username,
      Password: password
    });

    const user = cognitoUser({username, userPool});

    return new Promise((resolve, reject) => {
      user.authenticateUser(authenticationDetails, {
        onSuccess(result) {
          resolve(AuthToken.fromCognitoSession(result).toJson());
        },
        onFailure(err) {
          reject(err);
        },
        newPasswordRequired() {
          const err = new Error('New password is required to replace temporary password');
          err.code = 'NewPasswordRequiredError';
          reject(err);
        }
      });
    });
  },
  async renew({ username, refreshToken }) {
    const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({
      RefreshToken: refreshToken
    });

    const user = cognitoUser({username, userPool});

    return new Promise((resolve, reject) => {
      user.refreshSession(RefreshToken, (err, session) => {
        if (err) {
          reject(err);
        } else {
          resolve(AuthToken.fromCognitoSession(session).toJson());
        }
      });
    });
  },
  async authorize({accessToken}) {
    return new Promise((resolve, reject) => {
      cognitoExpress.validate(accessToken, (err, response) => {
        if (err) {
          const newError = new Error('Invalid or expired access token');
          newError.code = err.code;

          reject(newError);

          return;
        }

        resolve(response);
      });
    });
  }
};

module.exports = identityService;
