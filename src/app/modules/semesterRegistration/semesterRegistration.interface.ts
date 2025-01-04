import { Types } from 'mongoose';

// 0 [] {}
export type TSemesterRegistration = {
  academicSemester: Types.ObjectId; // the semester that is  registered
  status: 'UPCOMING' | 'ONGOING' | 'ENDED';
  startDate: Date;
  endDate: Date;
  minCredit: number;
  maxCredit: number;
};
