import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';
const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

//mongodb middlewares
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ id }).select('+password');
};

userSchema.statics.isUserBlocked = async function (id: string) {
  const user = await User.findOne({ id }).select('+password');
  if (user?.status === 'blocked') {
    return true;
  }
  return false;
};
userSchema.statics.isUserDeleted = async function (id: string) {
  const user = await User.findOne({ id }).select('+password');

  return user?.isDeleted;
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};
userSchema.statics.isPasswordChangedAfterJWTissued = function (
  passwordChangedAt,
  jwtIssuedAt,
) {
  // This purpose of this method is to invalidate a token after password change.
  const passwordChangedTime = new Date(passwordChangedAt).getTime() / 1000;

  return passwordChangedTime > jwtIssuedAt;
};

/*
// Query middlewares
userSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } }).select('-password'); // Exclude password field
  next();
});

userSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } }).select('-password'); // Exclude password field
  next();
});

userSchema.pre('aggregate', function (next) {
  this.pipeline().unshift(
    { $match: { isDeleted: { $ne: true } } }, // Filter deleted students
    { $unset: 'password' }, // Remove password field from results
  );
  next();
});
*/
export const User = model<TUser, UserModel>('User', userSchema);
