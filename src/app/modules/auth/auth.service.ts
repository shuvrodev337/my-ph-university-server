//  {} ? [] 0

import { TLoginUser } from './auth.interface';

const loginUser = async (payload: TLoginUser) => {
  const { id, password } = payload;
  console.log(id, password);
  return {};
};

export const AuthServices = { loginUser };
