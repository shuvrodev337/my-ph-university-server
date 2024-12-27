import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import { AdminServices } from './admin.service';

const getAllAdmins = catchAsync(async (req, res) => {
  const query = req.query;
  // console.log(query);
  const result = await AdminServices.getAllAdminsFromDB(query);

  sendResponse(res, {
    success: true,
    message: 'Admins retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const getSingleAdmin = catchAsync(async (req, res) => {
  const { adminID } = req.params;
  const result = await AdminServices.getSingleAdminFromDB(adminID);
  sendResponse(res, {
    success: true,
    message: 'Admin retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const updateAdmin = catchAsync(async (req, res) => {
  const { adminID } = req.params;
  const { admin: updateData } = req.body;
  const result = await AdminServices.updateAdminIntoDB(adminID, updateData);
  sendResponse(res, {
    success: true,
    message: 'Admin updated successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { adminID } = req.params;
  const result = await AdminServices.deleteAdminFromDB(adminID);
  sendResponse(res, {
    success: true,
    message: 'Faculty deleted successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
export const AdminControllers = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
