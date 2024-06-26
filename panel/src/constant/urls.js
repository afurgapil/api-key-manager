import API_URL from "../config";
export const USER_API = {
  SIGNUP: `${API_URL}/auth/signup`,
  SIGNIN: `${API_URL}/auth/signin`,
  VERIFY: `${API_URL}/auth/verify/:id`,
  RESET_REQUEST: `${API_URL}/auth/reset/request`,
  RESET_CHECK: `${API_URL}/auth/reset/check`,
  //endpoint
  ADD_ENDPOINT: `${API_URL}/endpoint/add`,
  GET_ALL_ENDPOINT: `${API_URL}/endpoint/get-all`,
  GET_USAGE: `${API_URL}/endpoint/get-usage`,
  GET_PATH_NAME: `${API_URL}/endpoint/get-path-names`,
  GET_ALL_USAGES_ENDPOINT: `${API_URL}/endpoint/get-all-usages`,
  GET_ENDPOINT: `${API_URL}/endpoint/get`,
  GET_PRICES: `${API_URL}/endpoint/get-prices`,
  EDIT_ENDPOINT: `${API_URL}/endpoint/update`,
  DELETE_ENDPOINT: `${API_URL}/endpoint/delete`,
  //log
  GET_LOGS: `${API_URL}/log/get-all`,
  DELETE_LOG: `${API_URL}/log/delete`,
  DELETE_ALL_LOG: `${API_URL}/log/delete-all`,
  //contact
  SEND_MAIL: `${API_URL}/contact/send-mail`,
};
