'use strict';

const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://ekadesign.auth0.com/.well-known/jwks.json',
  }),
  getToken(req) {
    if (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.access_token) {
      return req.query.access_token;
    }
    return null;
  },
  audience: 'https://ekacryptosite.herokuapp.com/api',
  issuer: 'https://ekadesign.auth0.com/',
  algorithms: ['RS256'],
});

module.exports = () => jwtCheck;
