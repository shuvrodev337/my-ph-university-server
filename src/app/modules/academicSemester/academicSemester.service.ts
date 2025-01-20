import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import {
  academicSemesterNameCodeMapper,
  AcademicSemesterSearchableFields,
} from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createAcademicSemesterToDb = async (
  academicSemester: TAcademicSemester,
) => {
  // business logic
  if (
    academicSemesterNameCodeMapper[academicSemester.name] !==
    academicSemester.code
  ) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Invalid semester code!');
  }
  const newAcademicSemester = await AcademicSemester.create(academicSemester);
  return newAcademicSemester;
};
const getAllAcademicSemestersFromDb = async (
  query: Record<string, unknown>,
) => {
  const academicSemesterQuery = new QueryBuilder(AcademicSemester.find(), query)
    .search(AcademicSemesterSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await academicSemesterQuery.modelQuery;
  const meta = await academicSemesterQuery.countTotal();

  return {
    meta,
    result,
  };
};
const getSingleAcademicSemesterFromDb = async (_id: string) => {
  const academicSemester = await AcademicSemester.findById(_id); // findById automatically searches by the _id field,no need to explicitly specify { _id }.
  return academicSemester;
};
const updateAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Invalid semester code!');
  }

  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterToDb,
  getAllAcademicSemestersFromDb,
  getSingleAcademicSemesterFromDb,
  updateAcademicSemesterIntoDB,
};
