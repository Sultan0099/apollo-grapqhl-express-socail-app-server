import { AuthenticationError, UserInputError } from "apollo-server-express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import {
  IUser,
  IUserRegister,
  IUserSignin,
  IUserPayload
} from "../interfaces/user";
import { User, Post } from "../models";
import { signUpValidator, singInValidator } from "../utils/validation";
import keys from "../config/key";
import { checkAuth } from "../utils/verification";

import { IContext } from "../interfaces/appollo";

//  JWT assign token function
async function assignToken(user: IUser) {
  return await jwt.sign(
    {
      id: user._id,
      username: user.username
    },
    keys.JWT_SECRET || "",
    { expiresIn: "5h" }
  );
}

export default {
  Query: {
    users: async (_: any, __: any, context: IContext) => {
      checkAuth(context);
      const fetchedUsers = await User.find({}).populate("posts"); // fetching all user from database
      return fetchedUsers;
    },
    user: async (_: any, { id }: { id: string }, context: IContext) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError(`${id} is not a valid id`);
      }
      checkAuth(context);
      const fetchedUser = await User.findOne({ _id: id }).populate("posts"); // fetching specific user from database
      if (!fetchedUser) {
        throw new AuthenticationError("user not found");
      }
      const fetchedPosts = await Post.find({ user: fetchedUser._id }).populate(
        "user"
      );
      console.log(fetchedPosts);
      if (fetchedPosts.length >= 1) {
        fetchedUser.posts = [...fetchedPosts];
      }

      return fetchedUser;
    }
  },

  Mutation: {
    register: async (
      _: any,
      { email, username, name, password }: IUserRegister
    ) => {
      const { isValid, errors } = signUpValidator(
        username,
        name,
        email,
        password
      );

      if (!isValid) {
        throw new UserInputError("Signup validation Error", { errors });
      }

      const newUser = new User({
        email,
        username,
        name,
        password
      });

      await newUser.save();
      const token = assignToken(newUser._doc);

      return {
        ...newUser._doc,
        id: newUser._id,
        token
      };
    },
    signIn: async (_: any, { email, password }: IUserSignin) => {
      const { errors, isValid } = singInValidator(email, password);
      if (!isValid)
        throw new UserInputError("Signin validation Error", { errors });

      const user = await User.findOne({ email });

      if (!user) {
        throw new UserInputError(`There is not User of this email : ${email}`, {
          errors: { err: "Email/Password is incorrect" }
        });
      }

      const validPassword = await user.isValidPassword(password);
      if (!validPassword) {
        throw new UserInputError("Email/Password is incorrect", {
          errors: { err: "Email/Password is incorrect" }
        });
      }

      const token = await assignToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
    deleteUser: async (_: any, { id }: { id: string }, context: IContext) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError(`${id} is not a valid id`);
      }

      // id argument will use in future

      const userPayload: IUserPayload = checkAuth(context);

      const fetchedUser = await User.findOneAndDelete({ _id: userPayload.id });
      if (!fetchedUser) {
        throw new Error("User not found");
      }

      await Post.deleteMany({ user: fetchedUser._id });

      return "User successfully deleted";
    }
  }
};
