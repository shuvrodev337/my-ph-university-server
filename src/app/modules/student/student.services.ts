import mongoose from 'mongoose';
import { TStudent } from './student.interface';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { User } from '../user/user.model';
import { studentSearchableFields } from './student.constant';
import QueryBuilder from '../../builder/QueryBuilder';

// const getAllStudentsFromDBWithRawQuery = async (
//   query: Record<string, unknown>,
// ) => {
//   const queryObj = { ...query }; // a copy of base query, to not mutate base query
//   const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
//   // excluding queries that we do not want to exact match-> searchTerm, sort, limit, page, fields queries from queryObj.
//   // filter is exact matching,so we are not excluding filter.
//   excludeFields.forEach((element) => delete queryObj[element]);
//   // searching
//   /*
//   ** Partial match for searchTerm
//   **Traget of $or query operator for searchTerm query, this will return the document that matches the query fields.
//    map will return like this ->
//   find({ $or:  [
//    'email': { $regex: searchTerm, $options: 'i' }
//    'name.midddleName': { $regex: searchTerm, $options: 'i' }
//    'presenrAddress': { $regex: searchTerm, $options: 'i' }
//           ]
//   })
//   */
//   const searchTerm = query?.searchTerm ? query?.searchTerm : '';
//   const studentSearchableFields = ['email', 'name.firstName', 'presenrAddress']; /// on which fields we want to match searchTerm
//   const searchQuery = StudentModel.find({
//     $or: studentSearchableFields.map((field) => {
//       return { [field]: { $regex: searchTerm, $options: 'i' } };
//     }),
//   });

//   // filtering
//   const filterQuery = searchQuery // Method chaining
//     .find(queryObj); // exact match only for filterquery // examplefilter by email:  .find({email: "exampleemail@gmail.com"})

//   // sorting
//   const sort = query?.sort ? (query?.sort as string) : '-createdAt'; //  field : -1 or -field are same
//   const sortQuery = filterQuery.sort(sort);

//   // Pagination & limiting
//   const limit = query?.limit ? Number(query?.limit) : 1;
//   const page = query?.page ? Number(query?.page) : 1;
//   const skip = query?.page ? (page - 1) * limit : 0;
//   const paginateQuery = sortQuery.skip(skip);
//   const limitQuery = paginateQuery.limit(limit);

//   // field limit/select

//   const fields = query?.fields
//     ? (query?.fields as string)?.split(',')?.join(' ')
//     : '-__v';
//   // Example of select query of mongoose -> selecting the `name` and `email` fields => query.select('name email');
//   const fieldLimitQuery = await limitQuery
//     .select(fields)
//     .populate({
//       // populate is giving back the academicDepartment and admissionSemester full information instead of only refferenced objecId
//       path: 'academicDepartment',
//       populate: { path: 'academicFaculty' }, // nested populating
//     })
//     .populate('admissionSemester'); // double field populating with chaining

//   return fieldLimitQuery;
// };

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // creating a QueryBuilder instance and then passing 2 properties it expects.
  // 1. the Mongose Model with the mongoose query/method (find) ,on which all the other query was based.
  // 2. express query
  const studentQuery = new QueryBuilder(
    StudentModel.find()
      // .populate({
      //   path: 'academicDepartment',
      //   populate: { path: 'academicFaculty' }, // nested populating
      // })
      .populate('admissionSemester academicDepartment academicFaculty'),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;
  const meta = await studentQuery.countTotal();
  return { result, meta };
};

const getSingleStudentFromDB = async (_id: string) => {
  const result = await StudentModel.findById(_id) //  using findById of mongoose, cz it finds by _id of mongodb.
    .populate({
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' }, // nested populating
    })
    .populate('admissionSemester');
  return result;
};
const updateSingleStudentFromDB = async (
  _id: string,
  updateData: Partial<TStudent>,
) => {
  if (!(await StudentModel.doesUserExist(_id))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find student!');
  }

  // to update primitive and non-primitive data, without mutation issue on non primitive data.
  const { name, guardian, localGuardian, ...remainingStudentData } = updateData;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  /*
Example data format for non primitive datas:

This format will mutate guardian obj->
  guardain: {
    fatherOccupation:"Teacher"
  }
This format will not mutate guardian obj, rather update only the fatherOccupation field->
  guardian.fatherOccupation = Teacher

So we are formating the data so that we do not mutate non primitive data. Another example format->
  name.firstName = 'Mezba'

*/

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  /*
Object.entries(name)) will convert ->
  {
            "firstName": "Sophia",
            "middleName": "Ann",
            "lastName": "Williams"
  }
To this->
  [
    ["firstName", "Sophia"],
    ["middleName", "Ann"],
    ["lastName", "Williams"]
  ]
we are deconstructing each array by [key, value] and then manipulating the modifiedUpdatedData with our desired data format for 
incoming non primitive field or fields.
*/
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await StudentModel.findByIdAndUpdate(
    // using findByIdAndUpdate of mongoose, cz it is not _id of mongodb.
    { _id, isDeleted: { $ne: true } },
    modifiedUpdatedData,
    { new: true, runValidators: true }, //returns new modified document // mongoose validaions run again
  );

  return result;
};
const deleteSingleStudentFromDB = async (_id: string) => {
  if (!(await StudentModel.doesUserExist(_id))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find student!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //delete from student collection

    const deletedStudent = await StudentModel.findByIdAndUpdate(
      _id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete student!');
    }

    //delete from user collection
    const user_id = deletedStudent.user;
    const deletedUser = await User.findByIdAndUpdate(
      user_id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete user!');
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to delete student!',
    );
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateSingleStudentFromDB,
  deleteSingleStudentFromDB,
};
