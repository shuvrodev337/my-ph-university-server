import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import mongoose from 'mongoose';
import { User } from '../user/user.model';
import { Admin } from './admin.model';
import { AdminSearchableFields } from './admin.constant';
import { TAdmin } from './admin.interface';

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find(), query)
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await adminQuery.modelQuery;
  return result;
};

const getSingleAdminFromDB = async (adminId: string) => {
  const result = await Admin.findOne({ id: adminId });
  return result;
};
const updateAdminIntoDB = async (
  adminId: string,
  updateData: Partial<TAdmin>,
) => {
  if (!(await Admin.isUserExists(adminId))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find Admin!');
  }
  const { name, ...remainingAdminData } = updateData;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingAdminData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Admin.findOneAndUpdate(
    { id: adminId, isDeleted: { $ne: true } },
    modifiedUpdatedData,
    { new: true, runValidators: true },
  );

  return result;
};
const deleteAdminFromDB = async (adminId: string) => {
  if (!(await Admin.isUserExists(adminId))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find Admin!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const updatedAdmin = await Admin.findOneAndUpdate(
      { id: adminId },
      { isDeleted: true },
      { new: true, session },
    );
    if (!updatedAdmin) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete Admin!');
    }
    const updatedUser = await User.findOneAndUpdate(
      { id: adminId },
      { isDeleted: true },
      { new: true, session },
    );
    if (!updatedUser) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete user!');
    }

    await session.commitTransaction();
    await session.endSession();
    return updatedAdmin;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to delete Admin!',
    );
  }
};

export const AdminServices = {
  getAllAdminsFromDB,
  getSingleAdminFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
};
