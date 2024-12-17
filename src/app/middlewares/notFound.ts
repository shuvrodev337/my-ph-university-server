/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
const notFound = (req: Request, res: Response, next: NextFunction) => {
  const message = 'API not found!';
  return res.status(StatusCodes.NOT_FOUND).json({
    successs: false,
    message,
    error: '',
  });
};
export default notFound;
