import { AnyZodObject } from 'zod';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';

const validateRequest = (schema: AnyZodObject) => {
  // returned function is a route handler function, which can only receive req,res,next as parameter.
  // so we are returning the function so that we can pass the Zod schema as parameter from routes.
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body, // sending an object to parse to zod, where the 'req.body' is a value of a property 'body'
      cookies: req.cookies,
    });
    next();
  });
};
export default validateRequest;
