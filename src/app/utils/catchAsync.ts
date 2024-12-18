// This catchAsync is a higher order function. purpose: DRY. to avoid trycatch block repeatation.
// It receives an asynchronous function, resolves it an catches and error if found.

import { NextFunction, Request, RequestHandler, Response } from 'express';

// it is returning the function, not the value we get after calling the async function.
const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};
export default catchAsync;
