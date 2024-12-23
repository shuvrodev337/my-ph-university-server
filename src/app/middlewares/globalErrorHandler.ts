/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError, ZodIssue } from 'zod';
import { TErrorsource } from '../interface/error';
import { handleZodError } from '../errors/handleZodError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // setting default statusCode, message, errorSource.
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR; // statusCode is from custom Class AppError
  let message = err.message || 'Something went wrong!'; // Check if the error has a custom message
  let errorSource: TErrorsource = [
    {
      path: '',
      message: 'Something went wrong!',
    },
  ];
  // Converting differnt errors into our desired error response format.
  if (err instanceof ZodError) {
    // zod provides a subclass of Error called ZodError
    const simplifiedError = handleZodError(err);
    //overwriting default error responses
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSource;
  }

  // ultimate errorr return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    //  error: err, // Optionally include full error details for debugging
  });
};

export default globalErrorHandler;

//our error response pattern
/*
success: ...,
message: ...,
errorSources:[
 
],
stack: ...   // stack is given only in development environment , not in production environment.
*/
