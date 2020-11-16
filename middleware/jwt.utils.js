// Imports
var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'f5ki85fd29h645fhggtnwa68lmp320178zzsddf5f8e2d0zcl8xcv';

// Exported functions
module.exports = {
  generateTokenForUser: function(userData) {
    return jwt.sign({
      userId: userData.username,
      isAdmin: userData.email,
      pass : userData.password
      
    },
    JWT_SIGN_SECRET,
    { })
  }
 
}