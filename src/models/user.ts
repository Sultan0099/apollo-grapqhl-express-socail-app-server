import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { IUser } from "../interfaces/user";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post"
      }
    ]
  },
  { timestamps: true }
);

userSchema.path("username").validate(async function(username: string) {
  console.log("validates runs", username);
  return (await User.countDocuments({ username })) === 0;
}, "username already taken");

userSchema.path("email").validate(async function(email: string) {
  console.log("validates runs", email);
  return (await User.countDocuments({ email })) === 0;
}, "This email already register");

userSchema.pre<IUser>("save", async function(next) {
  try {
    const user = this;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);

    user.password = hashPassword;

    next();
  } catch (err) {
    throw new Error(err);
  }
});

userSchema.methods.isValidPassword = async function(
  newPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(newPassword, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

const User = mongoose.model<IUser>("User", userSchema, "User");

export default User;
