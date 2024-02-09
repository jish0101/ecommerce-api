const {
  PORT,
  BASE_URL,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_FROM,
  RAZORPAY_KEYID,
  RAZORPAY_KEYSECRET,
  CLIENT_BASE_URL,
  REFRESH_TOKEN_SEC: refreshTokenSec,
  ACCESS_TOKEN_SEC: accessTokenSec,
} = process.env;

const OTP_REQ_TYPES = {
  forgotPassword: 'forgot-password',
};

const STATUSTYPES = {
  active: 'active',
  inactive: 'inactive',
  deleted: 'deleted',
};

const USER_ROLES = {
  member: 100,
  moderator: 101,
  admin: 103,
  'super-admin': 104,
};

module.exports = {
  accessTokenSec,
  refreshTokenSec,
  PORT,
  BASE_URL,

  SMTP_USERNAME,
  SMTP_PASSWORD,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_FROM,

  RAZORPAY_KEYID,
  RAZORPAY_KEYSECRET,

  CLIENT_BASE_URL,

  STATUSTYPES,
  USER_ROLES,
  OTP_REQ_TYPES,
};
