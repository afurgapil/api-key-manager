import API_URL from "./config";
export const USER_API = {
  SIGNUP: `${API_URL}/auth/signup`,
  SIGNIN: `${API_URL}/auth/signin`,
  VERIFY: `${API_URL}/auth/verify/:id`,
  RESET_REQUEST: `${API_URL}/auth/reset/request`,
  RESET_CHECK: `${API_URL}/auth/reset/check`,
  ADD_ENDPOINT: `${API_URL}/endpoint/add`,
  GET_ALL_ENDPOINT: `${API_URL}/endpoint/get-all`,
  GET_ALL_USAGES_ENDPOINT: `${API_URL}/endpoint/get-all-usages`,
  GET_ENDPOINT: `${API_URL}/endpoint/get`,
  EDIT_ENDPOINT: `${API_URL}/endpoint/update`,
  DELETE_ENDPOINT: `${API_URL}/endpoint/delete`,
};
