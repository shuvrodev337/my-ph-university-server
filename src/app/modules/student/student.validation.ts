import { z } from 'zod';

// Zod validations
const userNameValidationSchema = z.object({
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

const guardianZodValidationSchema = z.object({
  fatherName: z.string().trim().max(30),
  fatherOccupation: z.string().trim().max(30),
  fatherContactNo: z
    .string()
    .trim()
    .regex(/^\+?\d{10,15}$/, { message: 'Invalid contact number' }),
  motherName: z.string().trim().max(30),
  motherOccupation: z.string().trim().max(30),
  motherContactNo: z
    .string()
    .trim()
    .regex(/^\+?\d{10,15}$/, { message: 'Invalid contact number' }),
});

const localGuardianValidationSchema = z.object({
  name: z.string().trim().max(30),
  occupation: z.string().trim().max(30),
  contactNo: z
    .string()
    .trim()
    .regex(/^\+?\d{10,15}$/, { message: 'Invalid contact number' }),
  address: z.string().trim().max(100),
});

const studentValidationSchema = z.object({
  id: z.string().trim().max(10),
  password: z.string().min(8),
  name: userNameValidationSchema,
  email: z.string().trim().email(),
  gender: z.enum(['male', 'female', 'other']),
  age: z.number().min(1).max(150),
  dateOfBirth: z.string().trim(),
  avatar: z.string().trim().optional(),
  contactNo: z
    .string()
    .trim()
    .regex(/^\+?\d{10,15}$/, { message: 'Invalid contact number' }),
  bloodGroup: z
    .enum(['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'])
    .optional(),
  emmergencyContactNo: z
    .string()
    .trim()
    .regex(/^\+?\d{10,15}$/, { message: 'Invalid emergency contact number' }),
  presentAddress: z.string().trim().max(100),
  guardian: guardianZodValidationSchema,
  localGuardian: localGuardianValidationSchema,
  profileImg: z.string().trim().optional(),
  isActive: z.enum(['active', 'blocked']),
  isDeleted: z.boolean().optional().default(false),
});

export const updateStudentSchema = studentValidationSchema.partial();

export default studentValidationSchema;
