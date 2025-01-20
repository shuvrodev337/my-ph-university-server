/* eslint-disable @typescript-eslint/no-explicit-any */
// ? { }  [] 0_

import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { StudentModel } from '../student/student.model';
import EnrolledCourse from './enrolledCourse.model';
import mongoose from 'mongoose';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { calculateGradeAndPoints } from './enrolledCourse.utils';
import QueryBuilder from '../../builder/QueryBuilder';

const createEnrolledCourseIntoDb = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  const { offeredCourse } = payload;

  // Check if the offered course exists
  const isOfferedCourseExist = await OfferedCourse.findById(
    payload.offeredCourse,
  );

  if (!isOfferedCourseExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Offered course do not exist!');
  }
  // Check if the offered course capacity is full

  if (isOfferedCourseExist.maxCapacity <= 0) {
    throw new AppError(StatusCodes.BAD_GATEWAY, 'Room is full !');
  }

  // Check if the student exists

  const student = await StudentModel.findOne({ id: userId }, { _id: 1 });

  if (!student) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Student not found!');
  }

  // Check if the student already enrolled in the same offered course in the same semester

  const isStudentEnrolledAlready = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExist?.semesterRegistration,
    offeredCourse: offeredCourse,
    student: student._id,
  });
  if (isStudentEnrolledAlready) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Student is already enrolled in this course!',
    );
  }

  // ***  Check the credits will exceed the max credit*** //

  // get the maximum Credit for this semester
  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExist.semesterRegistration,
  );

  if (!semesterRegistration) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Semester Registration course do not exist!',
    );
  }
  const maxCreditForThisSemester = semesterRegistration.maxCredit;

  // Operate aggregation to get the credits already taken by the student in this semester

  const totalCreditsData = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExist?.semesterRegistration,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: 'courses', // In which collection we want to lookup
        localField: 'course',
        foreignField: '_id',
        as: 'courseData', // we want the data in this field
      },
    },
    {
      $unwind: '$courseData', // unwind bcz the courseData is initially an array of objects
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$courseData.credits' },
      },
    },
    {
      $project: { _id: 0, totalEnrolledCredits: 1 },
    },
  ]);
  console.log(totalCreditsData);

  // get the credit of the requested course
  const course = await Course.findById(isOfferedCourseExist.course);

  if (!course) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Course do not exist!');
  }

  // calculate total requested credit
  const totalRequestedCredit =
    totalCreditsData.length > 0
      ? totalCreditsData[0].totalEnrolledCredits + course.credits // already taken credits + requested course credit
      : 0;

  // if  total requested credit is more than the maximum Credit For This Semester throw error
  if (
    totalCreditsData &&
    maxCreditForThisSemester &&
    totalRequestedCredit > maxCreditForThisSemester
  ) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'You have exceeded maximum number of credits !',
    );
  }

  // create enrolled course and  decrease max capacity of offeredCourse inside transaction and rollback

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // crate enrolledCourse
    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExist.semesterRegistration,
          academicSemester: isOfferedCourseExist.academicSemester,
          academicFaculty: isOfferedCourseExist.academicFaculty,
          academicDepartment: isOfferedCourseExist.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExist.course,
          student: student._id,
          faculty: isOfferedCourseExist.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    if (!result) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Failed to enroll in this cousre !',
      );
    }

    // decrease max capacity of offeredCourse

    const maxCapacity = isOfferedCourseExist.maxCapacity;

    await OfferedCourse.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    });

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const getAllEnrolledCoursesFromDB = async (
  facultyId: string,
  query: Record<string, unknown>,
) => {
  const faculty = await Faculty.findOne({ id: facultyId });

  if (!faculty) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Faculty not found !');
  }

  const enrolledCourseQuery = new QueryBuilder(
    EnrolledCourse.find({
      faculty: faculty._id, // faculty will get the curses assigned to him that are enrolled by students
    }).populate(
      'semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty',
    ),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await enrolledCourseQuery.modelQuery;
  const meta = await enrolledCourseQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getMyEnrolledCoursesFromDB = async (
  studentId: string,
  query: Record<string, unknown>,
) => {
  const student = await StudentModel.findOne({ id: studentId });

  if (!student) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Student not found !');
  }

  const enrolledCourseQuery = new QueryBuilder(
    EnrolledCourse.find({ student: student._id }).populate(
      'semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty',
    ),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await enrolledCourseQuery.modelQuery;
  const meta = await enrolledCourseQuery.countTotal();

  return {
    meta,
    result,
  };
};

const updateEnrolledCourseMarksIntoDb = async (
  facultyId: string,
  payload: TEnrolledCourse,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;
  console.log(
    facultyId,
    semesterRegistration,
    offeredCourse,
    student,
    courseMarks,
  );

  // Check if the offered course exists
  const isOfferedCourseExist = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Offered course do not exist!');
  }
  // Check if the semester registration exists
  const isSemesterRegistrationExist =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExist) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Semester Registration do not exist!',
    );
  }
  // Check if the student exists

  const isStudentExist = await StudentModel.findById(student);

  if (!isStudentExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Student not found!');
  }
  // Check if the Faculty exists

  const faculty = await Faculty.findOne({ id: facultyId });
  if (!faculty) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Faculty not found!');
  }

  // check if the course belongs to this faculty

  const isCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    faculty: faculty._id,
  });
  if (!isCourseBelongToFaculty) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Faculty not authorized!');
  }

  // create modifiedDate Object to assign broken down courseMarks , and grade details
  const modifiedData: Record<string, unknown> = { ...courseMarks };

  // If the reault of the finalTerm is given , calculate grade, gradPoints
  if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm } =
      isCourseBelongToFaculty.courseMarks;

    const totalMarks =
      Math.ceil(classTest1) +
      Math.ceil(midTerm) +
      Math.ceil(classTest2) +
      Math.ceil(courseMarks?.finalTerm);

    const result = calculateGradeAndPoints(totalMarks);

    modifiedData.grade = result.grade;
    modifiedData.gradePoints = result.gradePoints;
    modifiedData.isCompleted = true;
  }

  // update nested object
  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }
  // console.log(modifiedData);

  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedData,
    {
      new: true,
    },
  );

  return result;
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDb,
  updateEnrolledCourseMarksIntoDb,
  getAllEnrolledCoursesFromDB,
  getMyEnrolledCoursesFromDB,
};
