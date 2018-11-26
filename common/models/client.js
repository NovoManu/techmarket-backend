'use strict';

module.exports = function(Client) {
  /**
   * Login an existing user or create a new one
   * @param {object} credentials Credentials for login or sighup
   * @param {Function(Error, object)} callback
   */

  Client.loginOrCreate = function(name = '', email, phone = '', callback) {
    Client.find({
      where: {email},
    }, (err, res) => {
      if (err) {
        callback(err);
      }
      if (res && res.length) {
        callback(null, res[0]);
      } else {
        const refNumber = Math.floor(Math.random() * (9999 - 1000) + 1000);
        Client.create({
          name,
          email,
          password: phone,
          phone,
          address: '',
          'ref_link': `${email}:${refNumber}`,
          'refered_by': '',
        }, (err, result) => {
          // if (err) callback(err);
          if (res) callback(null, result);
        });
      }
    });
  };

};
