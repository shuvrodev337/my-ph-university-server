import { Schema, model } from 'mongoose';

import bcrypt from 'bcrypt';
import {
  StudentModelForMethods,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interface';
import config from '../../config';
const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
  },
  fatherOccupation: {
    type: String,
  },
  fatherContactNo: {
    type: String,
  },
  motherName: {
    type: String,
  },
  motherOccupation: {
    type: String,
  },
  motherContactNo: {
    type: String,
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
  },
  occupation: {
    type: String,
  },
  contactNo: {
    type: String,
  },
  address: {
    type: String,
  },
});

const studentSchema = new Schema<TStudent, StudentModelForMethods>(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      unique: true,
      ref: 'User',
    },
    name: {
      type: userNameSchema,
      required: [true, 'Name is required'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not a valid gender',
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    contactNo: { type: String, required: [true, 'Contact number is required'] },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
    },
    bloogGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not a valid blood group',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian information is required'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local guardian information is required'],
    },
    profileImg: { type: String, default: '' },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
  },
);
// Kept the trim, unique, and default properties where applicable since they are still useful for schema integrity.
export default studentSchema;

// //virtuals
// studentSchema.virtual('fullNAme').get(function () {
//   return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
// });

// //mongodb middlewares
// studentSchema.pre('save', async function (next) {
//   // eslint-disable-next-line @typescript-eslint/no-this-alias
//   const user = this;
//   user.password = await bcrypt.hash(
//     user.password,
//     Number(config.bcrypt_salt_rounds),
//   );
//   next();
// });
// studentSchema.post('save', function (doc, next) {
//   doc.password = '';
//   console.log(doc);
//   next();
// });

// // Query middlewares
// studentSchema.pre('find', function (next) {
//   this.find({ isDeleted: { $ne: true } }).select('-password'); // Exclude password field
//   next();
// });

// studentSchema.pre('findOne', function (next) {
//   this.find({ isDeleted: { $ne: true } }).select('-password'); // Exclude password field
//   next();
// });

// studentSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift(
//     { $match: { isDeleted: { $ne: true } } }, // Filter deleted students
//     { $unset: 'password' }, // Remove password field from results
//   );
//   next();
// });

// creeating custom static method
studentSchema.statics.doesUserExist = async function (id: string) {
  const result = await StudentModel.findOne({ id });
  return result;
};

// // creeating custom instance method
// studentSchema.methods.doesUserExist = async function (id: string) {
//   const result = await StudentModel.findOne({ id });
//   return result;
// };
// model
export const StudentModel = model<TStudent, StudentModelForMethods>(
  'Student',
  studentSchema,
);
