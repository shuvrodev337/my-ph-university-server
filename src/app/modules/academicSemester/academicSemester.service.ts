import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterToDb = async (
  academicSemester: TAcademicSemester,
) => {
  // business logic
  if (
    academicSemesterNameCodeMapper[academicSemester.name] !==
    academicSemester.code
  ) {
    throw new Error('Invalid semester code!');
  }
  const newAcademicSemester = await AcademicSemester.create(academicSemester);
  return newAcademicSemester;
};
const getAcademicSemestersFromDb = async () => {
  const academicSemesters = await AcademicSemester.find();
  return academicSemesters;
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
    throw new Error('Invalid Semester Code');
  }

  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterToDb,
  getAcademicSemestersFromDb,
  getSingleAcademicSemesterFromDb,
  updateAcademicSemesterIntoDB,
};
