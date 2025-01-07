import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'Id is requireed' }),
    password: z.string({ required_error: 'Password is requireed' }),
  }),
});

export const authValidations = { loginValidationSchema };
