import API_URL from "./config";
export const USER_API = {
  SIGNUP: `${API_URL}/auth/signup`,
  SIGNIN: `${API_URL}/auth/signin`,
  VERIFY: `${API_URL}/auth/verify/:id`,
  RESET_REQUEST: `${API_URL}/auth/reset/request`,
  RESET_CHECK: `${API_URL}/auth/reset/check`,
};
