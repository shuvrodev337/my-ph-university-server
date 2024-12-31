import { model, Schema } from 'mongoose';
import {
  TCourse,
  TCourseFaculty,
  TPrereQuisiteCourses,
} from './course.interface';

const preRequisiteCourseSchema = new Schema<TPrereQuisiteCourses>(
  {
    course: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Course',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false, //so that $addtoset can work properly. for _id, $addtoset counts same PrereQuisiteCourses as different,and adds duplicate PrereQuisiteCourses.
  },
);
const courseSchema = new Schema<TCourse>(
  {
    prefix: {
      type: String,
      trim: true,
      required: true,
    },
    code: {
      type: Number,
      trim: true,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    credits: {
      type: Number,
      trim: true,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    prereQuisiteCourses: [preRequisiteCourseSchema],
  },
  {
    timestamps: true,
  },
);

export const Course = model<TCourse>('Course', courseSchema);

const courseFacultySchema = new Schema<TCourseFaculty>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    unique: true,
    required: true,
  },
  faculties: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
    },
  ],
});
export const CourseFaculty = model<TCourseFaculty>(
  'CourseFaculty',
  courseFacultySchema,
);
