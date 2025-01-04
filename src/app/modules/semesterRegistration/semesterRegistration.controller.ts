import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { SemesterRegistrationServices } from './semesterRegistration.service';

const createSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await SemesterRegistrationServices.createSemesterRegistrationIntoDb(
        req.body,
      );

    sendResponse(res, {
      sttatusCode: StatusCodes.OK,
      success: true,
      message: 'Semester Registration is created successfully!',
      data: result,
    });
  },
);
const getAllSemesterRegistrations = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await SemesterRegistrationServices.getAllSemesterRegistrationsFromDB(
        req.query,
      );

    sendResponse(res, {
      sttatusCode: StatusCodes.OK,
      success: true,
      message: 'Registered Semisters are retrieved successfully !',

      data: result,
    });
  },
);

const getSingleSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result =
      await SemesterRegistrationServices.getSingleSemesterRegistrationsFromDB(
        id,
      );

    sendResponse(res, {
      sttatusCode: StatusCodes.OK,
      success: true,
      message: 'Registered Semister is retrieved successfully',
      data: result,
    });
  },
);
/*


const updateSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await SemesterRegistrationService.updateSemesterRegistrationIntoDB(
        id,
        req.body,
      );

    sendResponse(res, {
      sttatusCode: StatusCodes.OK,
      success: true,
      message: 'Semester Registration is updated successfully',
      data: result,
    });
  },
);

const deleteSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await SemesterRegistrationService.deleteSemesterRegistrationFromDB(id);

    sendResponse(res, {
      sttatusCode: StatusCodes.OK,
      success: true,
      message: 'Semester Registration is updated successfully',
      data: result,
    });
  },
);
*/
export const SemesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  //   updateSemesterRegistration,
  //   deleteSemesterRegistration,
};
