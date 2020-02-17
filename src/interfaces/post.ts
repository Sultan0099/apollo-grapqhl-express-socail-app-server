import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IUser } from "./user";

export interface IPost extends mongoose.Document {
  id: string;
  body: string;
  createdAt: string;
  user: IUser | object;
  username: string;
  likes: Like[];
  comments: Comment[];
  _doc: object;
}

interface Comment {
  _id?: string;
  body: string;
  commentBy: string;
  userId: string;
  commentAt: string;
}

interface Like {
  _id?: string;
  userId: string;
  likedBy: string;
  likedAt: string;
}

export interface IPostValidation {
  body?: string;
}
