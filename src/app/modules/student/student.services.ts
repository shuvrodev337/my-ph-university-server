import { TStudent } from './student.interface';
import { StudentModel } from './student.model';

const getAllStudentsFromDB = async () => {
  const result = await StudentModel.find()
    .populate({
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' }, // multiple layered populating
    })
    .populate('admissionSemester'); // double field populating with chaining
  return result;
  // populate is giving back the academicDepartment and admissionSemester full information instead of only refferenced objecId
};
const getSingleStudentFromDB = async (studentID: string) => {
  const result = await StudentModel.find({ id: studentID })
    .populate({
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' },
    })
    .populate('admissionSemester');
  return result;
};
const updateSingleStudentFromDB = async (
  studentID: string,
  updateData: Partial<TStudent>,
) => {
  const result = await StudentModel.findOneAndUpdate(
    { id: studentID, isDeleted: { $ne: true } },
    { $set: updateData },
    { new: true }, //returns new modified document
  );

  return result;
};
const deleteSingleStudentFromDB = async (studentID: string) => {
  const result = await StudentModel.updateOne(
    { id: studentID },
    { isDeleted: true },
  );
  return result;
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateSingleStudentFromDB,
  deleteSingleStudentFromDB,
};
