import { get, post } from "_axios/request";

import { AUTH } from "./url";

export const getProfile = async () => {
  return await get(AUTH.PROFILE);
};

export const tryLogin = async (body) => {
  return await post(AUTH.LOGIN, body);
};
