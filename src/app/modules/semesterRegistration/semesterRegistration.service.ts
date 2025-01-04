// 0 [] {} ?

import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { RegistrationStatus } from './semesterRegistration.constant';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createSemesterRegistrationIntoDb = async (
  payload: TSemesterRegistration,
) => {
  // * Step1: Check if there any registered semester that is already 'UPCOMING'|'ONGOING'
  const upcomingOrOngoingSemester = await SemesterRegistration.findOne({
    $or: [
      { status: RegistrationStatus.UPCOMING },
      { status: RegistrationStatus.ONGOING },
    ],
  });
  if (upcomingOrOngoingSemester) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `There is aready an ${upcomingOrOngoingSemester?.status} registered semester !`,
    );
  }
  // * Step2: Check if the semester  exists on Academic semester collection
  const academicSemester = payload?.academicSemester;
  const doesAcademicSemesterExist =
    await AcademicSemester.findById(academicSemester);

  if (!doesAcademicSemesterExist) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Academic Semester Not Found !`,
    );
  }

  // * Step3: Check if the semester is already registered!
  const isAcademicSemesterAlreadyRegisterd = await SemesterRegistration.findOne(
    { academicSemester },
  );

  if (isAcademicSemesterAlreadyRegisterd) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `This Academic Semester is already registered !`,
    );
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};
const getSingleSemesterRegistrationsFromDB = async (id: string) => {
  const result =
    await SemesterRegistration.findById(id).populate('academicSemester');

  return result;
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDb,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationsFromDB,
};
