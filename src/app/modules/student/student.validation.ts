import { z } from 'zod';

// Zod validations
const createUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(20)
    .regex(/^[A-Z][a-z]*$/, { message: 'First name must be capitalized' }),
  middleName: z.string().trim().max(20).optional(),
  lastName: z
    .string()
    .trim()
    .regex(/^[A-Za-z]+$/, { message: 'Last name must contain only letters' }),
});

const createGuardianValidationSchema = z.object({
  fatherName: z.string(),
  fatherOccupation: z.string(),
  fatherContactNo: z.string(),
  motherName: z.string(),
  motherOccupation: z.string(),
  motherContactNo: z.string(),
});

const createLocalGuardianValidationSchema = z.object({
  name: z.string().trim().max(30),
  occupation: z.string().trim().max(30),
  contactNo: z
    .string()
    .trim()
    .regex(/^\+?\d{10,15}$/, { message: 'Invalid contact number' }),
  address: z.string().trim().max(100),
});

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    student: z.object({
      name: createUserNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      guardian: createGuardianValidationSchema,
      localGuardian: createLocalGuardianValidationSchema,
    }),
  }),
});

const updateStudentSchema = createStudentValidationSchema.partial();

export const studentValidation = {
  createStudentValidationSchema,
  updateStudentSchema,
};
