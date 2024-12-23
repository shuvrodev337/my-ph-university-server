import { ZodError, ZodIssue } from 'zod';
import { TErrorsource } from '../interface/error';

export const handleZodError = (err: ZodError) => {
  const errorSource: TErrorsource = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });
  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error!',
    errorSource,
  };
};
