import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload; // adding user property to Request Interface of express
    }
  }
}
