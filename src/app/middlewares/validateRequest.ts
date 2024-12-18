import { AnyZodObject } from 'zod';
import { NextFunction, Request, Response } from 'express';

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('err');
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
