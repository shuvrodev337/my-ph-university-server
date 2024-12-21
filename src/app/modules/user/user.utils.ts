import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { StudentModel } from '../student/student.model';
import { User } from './user.model';

const findLastStudentId = async () => {
  // findOne() inherently limits the result to the first document that matches the query.
  // Since the .sort() operation ensures that the latest document is at the top, findOne() retrieves only that document.

  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined;
};

export const generateStudentId = async (
  admissionSemester: TAcademicSemester,
) => {
  let currentId = (0).toString();

  const lastStudentId = await findLastStudentId();
  const lastStudentYear = lastStudentId?.substring(0, 4);
  const lastStudentCode = lastStudentId?.substring(4, 6);
  const curretntStudentYear = admissionSemester.year;
  const curretntStudentCode = admissionSemester.code;
  // logic-> we are checkig if the current student year and semester is same,
  // if yes->increment from  last sttudent id.
  // if no-> start again from 0000
  if (
    lastStudentId &&
    lastStudentYear === curretntStudentYear &&
    lastStudentCode === curretntStudentCode
  ) {
    currentId = lastStudentId.substring(6);
  }
  let incrementedId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementedId = `${admissionSemester.year}${admissionSemester.code}${incrementedId}`; // example id 2030 01 0001

  return incrementedId;
};

// padstart -> string method, 1st param-> number of digits, 2nd param-> will be filled with this, before the string that
// it is applied to. example->
// (0).toString().padStart(4, '0') ---->'0000'
// (1).toString().padStart(4, '0') ---->'0001'
// (10).toString().padStart(4, '0') ---->'0010'
