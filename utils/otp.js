const speakeasy = require('speakeasy');

const generateOTP = (secret) => {
  return speakeasy.totp({
    secret,
    encoding: 'base32',
    step: 30
  });
};

const validateOTP = (token, secret) => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1
  });
};

module.exports = { generateOTP, validateOTP };