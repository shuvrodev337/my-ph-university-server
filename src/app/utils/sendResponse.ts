import { Response } from 'express';

type TResponseData<T> = {
  success: boolean;
  sttatusCode: number;
  message: string;
  data: T;
};
const sendResponse = <T>(res: Response, data: TResponseData<T>) => {
  res.status(data.sttatusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
  });
};
export default sendResponse;
