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
  // Check if the error has a custom message
  //  console.log(err);
  const message = err.message || 'Something went wrong!';
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR; // statusCode is from custom Class AppError

  return res.status(statusCode).json({
    success: false,
    message,
    error: err, // Optionally include full error details for debugging
  });
};

export default globalErrorHandler;
