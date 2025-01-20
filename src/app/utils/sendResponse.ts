import { Response } from 'express';
type TMeta = {
  page: number;
  limit: number;
  totalDocuments: number;
  totalPage: number;
};
type TResponseData<T> = {
  success: boolean;
  sttatusCode: number;
  message?: string;
  data: T;
  meta?: TMeta;
};
const sendResponse = <T>(res: Response, data: TResponseData<T>) => {
  res.status(data.sttatusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
};
export default sendResponse;
