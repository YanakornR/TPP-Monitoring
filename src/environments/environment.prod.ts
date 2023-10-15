
const BASE_URL = 'http://203.150.220.146:8103';
export const environment = {
  production: true,
  httpRequestTimeout: 30000, // ms
  baseUrl: BASE_URL,
  loginUrl: BASE_URL + '/login',
  resetUrl: BASE_URL + '/reset-password'
};
