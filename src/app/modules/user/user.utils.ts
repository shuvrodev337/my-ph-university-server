import { TAcademicSemester } from '../academicSemester/academicSemester.interface';

export const generateStudentId = (admissionSemester: TAcademicSemester) => {
  const currentId = (0).toString();
  // padstart -> string method, 1st param-> number of digits, 2nd param-> will be filled with this, before the string that
  // it is applied to. example->
  // (0).toString().padStart(4, '0') ---->'0000'
  // (1).toString().padStart(4, '0') ---->'0001'
  // (10).toString().padStart(4, '0') ---->'0010'
  let incrementedId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementedId = `${admissionSemester.year}${admissionSemester.code}${incrementedId}`; // example id 2030012030

  return incrementedId;
};
