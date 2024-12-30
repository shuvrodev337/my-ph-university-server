import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchableFields } from './course.constant';
import { TCourse } from './course.interface';
import { Course } from './course.model';
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
  return result;
};
const getSingleCourseFromDb = async (_id: string) => {
  const result = await Course.findById(_id).populate(
    'prereQuisiteCourses.course',
  );

  return result;
};
const updateCourseIntoDb = async (
  _id: string,
  courseData: Partial<TCourse>,
) => {
  const { prereQuisiteCourses, ...basicUpdateCourseData } = courseData;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const updateBasicCourseInfo = await Course.findByIdAndUpdate(
      _id,
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
        _id,
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
        _id,
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
    const result = await Course.findById(_id).populate(
      'prereQuisiteCourses.course',
    );
    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update course');
  }
};
const deleteCourseFromoDb = async (_id: string) => {
  const result = await Course.findByIdAndUpdate(
    _id,
    { isDeleted: true },
    { new: true },
  );

  return result;
};

export const CourseServices = {
  createCourseIntoDb,
  getAllCoursesFromDb,
  getSingleCourseFromDb,
  updateCourseIntoDb,
  deleteCourseFromoDb,
};
