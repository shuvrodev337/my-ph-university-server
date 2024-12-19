import { AnyZodObject } from 'zod';
import { NextFunction, Request, Response } from 'express';

const validateRequest = (schema: AnyZodObject) => {
  // returned function is a route handler function, which can only receive req,res,next as parameter.
  // so we are returning the function so that we can pass the Zod schema as parameter from routes.
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body, // sending an object to parse to zod, where the 'req.body' is a value of a property 'body'
      });
      next();
    } catch (err) {
      next(err);
    }
  };
};
export default validateRequest;
