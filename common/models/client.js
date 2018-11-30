'use strict';
const jwtDecode = require('jwt-decode');
// Note: we are adding the same password for all user because we have auth0
const password = 'techMarketuserLogin45372';

function loginClient(Model, {username}, callback) {
  Model.login({
    username,
    password,
  }, 'client', (err, res) => {
    if (err) return callback(err);
    Model.findById(res.userId, (error, response) => {
      if (error) return callback(error);
      response['access_token'] = res.id;
      response['id'] = res.userId;
      delete response.username;
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
    const username = decodedToken.sub;
    Client.find({
      where: {username},
    }, (err, res) => {
      if (res && res.length) {
        loginClient(Client, {username}, callback);
      } else {
        let randomNumber = Math.floor(Math.random() *
          (999999 - 100000) + 100000);
        const refNumber = username.split('|')[1] + randomNumber;
        const params = {
          username,
          name: name || decodedToken.nickname || decodedToken.name,
          email: email || decodedToken.email,
          password,
          phone,
          'avatar_link': null,
          'birth_date': null,
          address: null,
          'ref_link': refNumber,
          'refered_by': null,
          role: null,
        };
        Client.create(params, (err, result) => {
          if (err) callback(err);
          if (result) loginClient(Client, {username}, callback);
        });
      }
    });
  };
};
