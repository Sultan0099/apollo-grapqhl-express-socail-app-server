import mongoose from "mongoose";
import { IPost } from "./post";
export interface IUser extends mongoose.Document {
  id: string;
  email: string;
  username: string;
  name: string;
  password: string;
  createdAt: string;
  isValidPassword(password: string): boolean;
  _doc: IUser;
  posts: IPost[];
}

export interface IUserRegister {
  email: string;
  username: string;
  name: string;
  password: string
}

export interface IUserSignin {
  email: string;
  password: string;
}

export interface IUserValidation {
  email?: string;
  username?: string;
  name?: string;
  password?: string;
}


export interface IUserPayload {
  id?: string,
  iat?: number,
  exp?: number
}