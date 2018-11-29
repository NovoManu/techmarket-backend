'use strict';

let server = require('./server');
let ds = server.dataSources['mysql'];
let lbTables = ['User', 'Client', 'AccessToken', 'ACL', 'RoleMapping', 'Role',
  'Vehicle', 'Vehicle_Model', 'Vehicle_Subtype', 'Vehicle_Type'];
ds.automigrate(lbTables, (er) => {
  if (er) throw er;
  console.log('Loopback tables [' - lbTables - '] created in ', ds.adapter.name);
  ds.disconnect();
});
