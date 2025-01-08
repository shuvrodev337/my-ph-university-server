import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'Id is requireed' }),
    password: z.string({ required_error: 'Password is requireed' }),
  }),
});
const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old password is requireed' }),
    newPassword: z.string({ required_error: 'New password is requireed' }),
  }),
});

export const authValidations = {
  loginValidationSchema,
  changePasswordValidationSchema,
};
