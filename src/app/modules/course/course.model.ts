import { model, Schema } from 'mongoose';
import { TCourse, TPrereQuisiteCourses } from './course.interface';

const preRequisiteCourseSchema = new Schema<TPrereQuisiteCourses>({
  course: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Course',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
const courseSchema = new Schema<TCourse>({
  prefix: {
    type: String,
    trim: true,
    required: true,
    unique: true,
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
});

export const Course = model<TCourse>('Course', courseSchema);
