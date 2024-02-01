const accessTokenSec = process.env.ACCESS_TOKEN_SEC;
const refreshTokenSec = process.env.REFRESH_TOKEN_SEC;
const { PORT, BASE_URL, SMTP_USERNAME, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT, SMTP_FROM } =
  process.env;

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
};
