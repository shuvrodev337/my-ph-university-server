export type TUser = {
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
};
export type TNewUser = Partial<TUser>;
