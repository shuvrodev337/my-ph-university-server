import mongoose, { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchableFields } from './course.constant';
import { TCourse, TCourseFaculty } from './course.interface';
import { Course, CourseFaculty } from './course.model';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const createCourseIntoDb = async (courseData: TCourse) => {
  const result = await Course.create(courseData);
  return result;
};
const getAllCoursesFromDb = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('prereQuisiteCourses.course'), // the reffered objectId field
    query,
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await courseQuery.modelQuery;
  const meta = await courseQuery.countTotal();

  return {
    meta,
    result,
  };
};
const getSingleCourseFromDb = async (id: string) => {
  const result = await Course.findById(id).populate(
    'prereQuisiteCourses.course',
  );

  return result;
};
const updateCourseIntoDb = async (id: string, courseData: Partial<TCourse>) => {
  const { prereQuisiteCourses, ...basicUpdateCourseData } = courseData;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const updateBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      basicUpdateCourseData,
      { new: true, runValidators: true, session },
    );
    if (!updateBasicCourseInfo) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Course Update failed!');
    }

    if (prereQuisiteCourses && prereQuisiteCourses.length > 0) {
      // getting the ids of deletable courses from course fields
      const deleteAblePrereQuisiteCourses = prereQuisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);
      // remove the courses
      const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            prereQuisiteCourses: {
              course: { $in: deleteAblePrereQuisiteCourses },
            },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!deletedPreRequisiteCourses) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update course');
      }
      // getting the  new courses to add to prereQuisiteCourses field.
      const newPrerequisites = prereQuisiteCourses.filter(
        (el) => el.course && !el.isDeleted,
      );

      // update the courses
      const updatedPrerequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { prereQuisiteCourses: { $each: newPrerequisites } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!updatedPrerequisiteCourses) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update course');
      }
    }

    await session.commitTransaction();
    await session.endSession();
    const result = await Course.findById(id).populate(
      'prereQuisiteCourses.course',
    );
    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update course');
  }
};
const deleteCourseFromoDb = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  return result;
};

const assignFacultiesWithCourseIntoDB = async (
  courseId: string, // Course ID from the route parameter
  facultiesData: Types.ObjectId[], // Array of faculty ObjectIds
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    courseId, // if we want same  value for _id and course field.us findByIdAndUpdate then. or,
    // { course: courseId }, // Match document( or create new doc if not matched) by course field if we want different value for _id and course field.
    {
      course: courseId,
      // $set: { course: courseId }, // Or , Explicitly set course ID
      $addToSet: { faculties: { $each: facultiesData } }, // Add faculties to the array
    },
    {
      upsert: true, // Create a document if none exists
      new: true, // Return the updated document
      runValidators: true,
    },
  );

  return result;
};

const getFacultiesOfCourseFromDB = async (
  courseId: string, // Course ID from the route parameter
) => {
  const result = await CourseFaculty.findOne({ course: courseId }).populate(
    'faculties',
  );

  return result;
};

const removeFacultiesFromCourseFromDB = async (
  courseId: string,
  faculties: Types.ObjectId[],
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    courseId, // same  value for _id and course field , that is why findByIdAndUpdate will work
    // if  value for _id and course field are different, we would have to us findOneAndUpdate, by course field value.
    {
      $pull: { faculties: { $in: faculties } },
    },
    {
      new: true,
    },
  );
  return result;
};

export const CourseServices = {
  createCourseIntoDb,
  getAllCoursesFromDb,
  getSingleCourseFromDb,
  updateCourseIntoDb,
  deleteCourseFromoDb,
  assignFacultiesWithCourseIntoDB,
  getFacultiesOfCourseFromDB,
  removeFacultiesFromCourseFromDB,
};
