'use strict';
const jwtDecode = require('jwt-decode');
// Note: we are adding the same password for all user because we have auth0
const password = 'techMarketuserLogin45372';

function loginClient(Model, {email}, callback) {
  Model.login({
    email,
    password,
  }, 'client', (err, res) => {
    if (err) return callback(err);
    Model.findById(res.userId, (error, response) => {
      if (error) return callback(error);
      response['access_token'] = res.id;
      response['id'] = res.userId;
      return callback(null, response);
    });
  });
}

module.exports = function(Client) {
  /**
   * Login an existing user or create a new one
   * @param {string} name (not required)
   * @param {string} email (not required)
   * @param {string} phone (not required)
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
      if (res && res.length) {
        loginClient(Client, {email: res[0]['email']}, callback);
      } else {
        let randomNumber = Math.floor(Math.random() *
          (999999 - 100000) + 100000);
        const refNumber = sub.split('|')[1] + randomNumber;
        const params = {
          sub,
          name: name || decodedToken.nickname,
          email: email || decodedToken.email,
          password,
          phone,
          // eslint-disable-next-line
          avatar_link: null,
          address: null,
          'ref_link': refNumber,
          'refered_by': null,
          role: null,
        };
        Client.create(params, (err, result) => {
          if (err) callback(err);
          if (result) loginClient(Client, {email: result.email}, callback);
        });
      }
    });
  };
};
