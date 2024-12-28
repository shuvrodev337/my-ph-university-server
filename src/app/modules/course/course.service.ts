import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchableFields } from './course.constant';
import { TCourse } from './course.interface';
import { Course } from './course.model';

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
  const result = await Course.findById(_id);

  return result;
};
const updateCourseIntoDb = async () => {};
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
