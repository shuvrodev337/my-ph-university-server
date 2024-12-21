import z from 'zod';
const createAcademivFacultyValidationSchema = z.object({
  name: z.string({ invalid_type_error: 'Name must be string' }),
});
const updateAcademivFacultyValidationSchema = z.object({
  name: z.string({ invalid_type_error: 'Name must be string' }),
});
export const academivFacultyValidation = {
  createAcademivFacultyValidationSchema,
  updateAcademivFacultyValidationSchema,
};
