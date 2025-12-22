import { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AcademicFaculty',
    },
  },
  {
    timestamps: true,
  },
);

// additional validation on top of -> unique : true
academicDepartmentSchema.pre('save', async function (next) {
  const doesAcademicDepartmentExist = await AcademicDepartment.findOne({
    name: this.name,
  });
  if (doesAcademicDepartmentExist) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Academic department already exist!',
    );
  }

  next();
});
// fix bug of giving success response to  update request with wrong id.
academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery(); // query will get the query  -> { _id: 'example _id'}
  const doesAcademicDepartmentExist = await AcademicDepartment.findOne(query);

  if (!doesAcademicDepartmentExist) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Academic department does not exist!',
    );
  }

  next();
});

export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
