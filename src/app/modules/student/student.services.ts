import { TStudent } from './student.interface';
import { StudentModel } from './student.model';

const getAllStudentsFromDB = async () => {
  const result = await StudentModel.find();
  return result;
};
const getSingleStudentFromDB = async (studentID: string) => {
  const result = await StudentModel.find({ id: studentID });
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
