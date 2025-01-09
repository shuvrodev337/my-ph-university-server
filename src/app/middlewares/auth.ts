import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized 3!');
    }

    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    // add the user with req
    req.user = decoded;

    const { userId, iat } = decoded;
    console.log('decoded=>', decoded);
    // validations
    const user = await User.isUserExistsByCustomId(userId);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }

    if (await User.isUserBlocked(userId)) {
      throw new AppError(StatusCodes.FORBIDDEN, 'User is blocked');
    }

    if (await User.isUserDeleted(userId)) {
      throw new AppError(StatusCodes.FORBIDDEN, 'User is deleted');
    }

    //  invalidate a token after password change.

    if (
      user.passwordChangedAt &&
      User.isPasswordChangedAfterJWTissued(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(StatusCodes.FORBIDDEN, 'You are not authorized 1!');
    }

    // Authorization
    const roleInToken = decoded?.role;
    if (requiredRoles && !requiredRoles.includes(roleInToken)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized 2!');
    }

    next();
  });
};
export default auth;

/*
 ** expected value format of decoded = { userId: '...', role: '...' , iat: 1736286687, exp: 1737150687 }
 ** tokens are generated by login (admin/faculty/student) and they include the role of the logged in user.
 ** Explaination by example:  we should not create a student from a student token. 
    A student should always be created by a coming admin token.
    So we check the  role in token exists is the required roles.
 ** requiredRoles are kept in an array , as a route can be permitted for multiple roles.
  
 ** This purpose isPasswordChangedAfterJWTissued method is to invalidate a token after password change.
    user have to re login to get new token to access protected routes. this is to tackle any situation ehen 
    any token gets hacked, then if user reset his password, the hacker can not use the token to access the protected routes.
  
*/
