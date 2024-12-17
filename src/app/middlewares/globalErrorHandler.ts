/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const message = 'Something went wrong!';
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    successs: false,
    message,
    error: err,
  });
};
export default globalErrorHandler;
