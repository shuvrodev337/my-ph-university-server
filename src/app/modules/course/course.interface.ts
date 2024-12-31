import { Types } from 'mongoose';

export type TPrereQuisiteCourses = {
  course: Types.ObjectId;
  isDeleted: boolean;
};

export type TCourse = {
  prefix: string;
  code: number;
  title: string;
  credits: number;
  isDeleted?: boolean;
  prereQuisiteCourses?: TPrereQuisiteCourses[];
};
export type TCourseFaculty = {
  course: Types.ObjectId;
  faculties: Types.ObjectId[];
};
