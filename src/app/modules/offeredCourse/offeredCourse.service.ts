import { StatusCodes } from 'http-status-codes';

import AppError from '../../errors/AppError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { OfferedCourse } from './offeredCourse.model';
import { hasTimeConflict } from './offeredCourse.utils';
import QueryBuilder from '../../builder/QueryBuilder';
import {
  RegistrationStatus,
  SemesterRegistrationStatus,
} from '../semesterRegistration/semesterRegistration.constant';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicDepartment,
    academicFaculty,
    course,
    faculty,
    section,
    startTime,
    endTime,
    days,
  } = payload;
  /**
   * Step 1: check if the semester registration id is exists!
   * Step 2: check if the academic faculty id is exists!
   * Step 3: check if the academic department id is exists!
   * Step 4: check if the course id is exists!
   * Step 5: check if the faculty id is exists!
   * Step 6: check if the department is belong to the  faculty
   * Step 7: check if the same offered course same section in same registered semester exists
   * Step 8: get the schedules of the faculties
   * Step 9: check if the faculty is available at that time. If not then throw error
   * Step 10: create the offered course
   */
  // semester registration check
  const doesSemesterRegistrationExist =
    await SemesterRegistration.findById(semesterRegistration);
  if (!doesSemesterRegistrationExist) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'This semester is not registered!',
    );
  }

  // get the academicSemester from the registerd semester
  const academicSemester = doesSemesterRegistrationExist.academicSemester;

  // academicFaculty check
  const doesAcademicFacultyExist =
    await AcademicFaculty.findById(academicFaculty);
  if (!doesAcademicFacultyExist) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'This Academic department does not exist!',
    );
  }

  // academicDepartment check
  const doesAcademicDepartmentExist =
    await AcademicDepartment.findById(academicDepartment);
  if (!doesAcademicDepartmentExist) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'This Academic department does not exist!',
    );
  }
  //  check if the department belongs to the faculty
  const doesDepartmentBelongToAcademicFaculty =
    await AcademicDepartment.findOne({
      _id: academicDepartment,
      academicFaculty,
    });
  if (!doesDepartmentBelongToAcademicFaculty) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `The ${doesAcademicDepartmentExist.name} department does not belong to the ${doesAcademicFacultyExist.name} academic faculty!`,
    );
  }

  // course check
  const doesCourseExist = await Course.findById(course);
  if (!doesCourseExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This course does not exist!');
  }
  // faculty check
  const doesfacultyExist = await Faculty.findById(faculty);
  if (!doesfacultyExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This faculty does not exist!');
  }

  // check if the same  course is offered to  same section in same registered semester
  const sameSectionCheckForSameCourseAndSameRegisterdSemester =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });
  if (sameSectionCheckForSameCourseAndSameRegisterdSemester) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Section ${section} is already booked for this course.`,
    );
  }

  // get the schedules of the faculties
  const assignedSchedules = await OfferedCourse.find({
    //    semesterRegistration,  // faculty can be busy for another course for another registerd semester(even two ONGOING semester is logically not possible according to our business logic, I excluded semesterRegistration from find, cz common logic. )
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');
  // for $in , we can check if time conflict appears in even for one day of that days arrays.
  // as example if the requested time conflicts only with "Fri" from  ["Fri","Mon"], it will conflict.
  const newSchedule = {
    days,
    startTime,
    endTime,
  };
  // check if the faculty is available at that time. If not then throw error

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      StatusCodes.CONFLICT,
      `This faculty is not available at that time ! Choose another time or day`,
    );
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await offeredCourseQuery.modelQuery;
  return result;
};
const getSingleOfferedCourseFromDB = async (id: string) => {
  const offeredCourse = await OfferedCourse.findById(id);
  if (!offeredCourse) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Course not found!');
  }

  return offeredCourse;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the faculty exists
   * Step 3: check if the semester registration status is upcoming
   * Step 4: check if the faculty is available at that time. If not then throw error
   * Step 5: update the offered course
   */
  const { faculty, days, startTime, endTime } = payload;

  const offeredCourse = await OfferedCourse.findById(id);
  if (!offeredCourse) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Course not found!');
  }
  const doesfacultyExist = await Faculty.findById(payload.faculty);
  if (!doesfacultyExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This faculty does not exist!');
  }

  const semesterRegistrationOfOfferedCourse =
    await SemesterRegistration.findById(offeredCourse.semesterRegistration);
  if (
    semesterRegistrationOfOfferedCourse?.status !== RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `This registered semister is ${semesterRegistrationOfOfferedCourse?.status}!`,
    );
  }

  // get the schedules of the faculties
  const assignedSchedules = await OfferedCourse.find({
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  // check if the faculty is available at that time. If not then throw error

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      StatusCodes.CONFLICT,
      `This faculty is not available at that time ! Choose another time or day`,
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};
const deleteOfferedCourseFromDB = async (id: string) => {
  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the semester registration status is upcoming
   * Step 3: delete the offered course
   */
  const offeredCourse = await OfferedCourse.findById(id);
  if (!offeredCourse) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Course not found!');
  }
  const semesterRegistrationOfOfferedCourse =
    await SemesterRegistration.findById(offeredCourse.semesterRegistration);
  if (
    semesterRegistrationOfOfferedCourse?.status !== RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Can not delete this course, the registered semister is ${semesterRegistrationOfOfferedCourse?.status}!`,
    );
  }

  const result = await OfferedCourse.findByIdAndDelete(id);
  return result;
};
export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  //  getMyOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  deleteOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
};
