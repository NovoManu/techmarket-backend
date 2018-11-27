'use strict';
const jwtDecode = require('jwt-decode');
// Note: we are adding the same password for all user because we have auth0
const password = 'techMarketuserLogin45372';

function loginClient(Model, {email}, callback) {
  Model.login({
    email,
    password,
  }, 'client', (err, res) => {
    callback(null, res);
  });
}

module.exports = function(Client) {
  /**
   * Login an existing user or create a new one
   * @param {string} body (not required)
   * @param {Function(Error, object)} callback
   */

  Client.loginOrCreate = (
    req, name = '', email = '', phone = '', callback
  ) => {
    const token = req.query['access_token'];
    const decodedToken = jwtDecode(token);
    const sub = decodedToken.sub;
    Client.find({
      where: {sub},
    }, (err, res) => {
      if (err) callback(err);
      if (res && res.length) {
        loginClient(Client, {email: res[0]['email']}, callback);
      } else {
        const randomNumber = Math.floor(Math.random() * (9999 - 1000) + 1000);
        const refNumber = `${email}-${randomNumber}`;
        const params = {
          sub,
          name,
          email,
          password,
          phone,
          address: '',
          'ref_link': refNumber,
          'refered_by': '',
        };
        Client.create(params, (err, result) => {
          if (err) callback(err);
          if (res) loginClient(Client, {email: result.email}, callback);
        });
      }
    });
  };
};
