import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterToDb = async (
  academicSemester: TAcademicSemester,
) => {
  const newAcademicSemester = await AcademicSemester.create(academicSemester);
  return newAcademicSemester;
};
export const AcademicSemesterServices = {
  createAcademicSemesterToDb,
};
