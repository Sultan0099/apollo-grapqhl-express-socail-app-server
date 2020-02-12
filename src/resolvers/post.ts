import mongoose from "mongoose";
import { UserInputError, AuthenticationError, addErrorLoggingToSchema } from "apollo-server-express";
import { IContext } from "../interfaces/appollo";
import { checkAuth } from "../utils/verification";

import { Post, User } from "../models"
import { IUserPayload } from "../interfaces/user";
import { postValidator } from "../utils/validation";

export default {
  Query: {
    posts: async (_: any, __: any, context: IContext) => {
      checkAuth(context)
      try {
        const fetchedPost = await Post.find({}).populate('user');
        if (!fetchedPost) {
          throw new Error("posts not found")
        }
        const posts = [...fetchedPost];

        return posts;
      } catch (error) {
        throw new Error(error)
      }
    },
    post: async (_: any, { id }: { id: string }, context: IContext) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError(`${id} is not valid id`);
      }
      checkAuth(context)
      try {

        const fetchedPost = await Post.findOne({ _id: id }).populate("user");
        if (!fetchedPost) {
          throw new Error("post not found")
        }

        return fetchedPost;
      } catch (err) {
        throw new Error("Error in server")
      }

    }
  },
  Mutation: {
    createPost: async (_: any, { body }: { body: string }, context: IContext) => {
      const userPayload: IUserPayload = checkAuth(context);


      const { errors, isValid } = postValidator(body);
      if (!isValid) {
        throw new UserInputError("Body validation Error", errors)
      }
      const user = await User.findOne({ _id: userPayload["id"] });
      if (!user) {
        throw new Error("User not found on this id")
      }

      const newPost = new Post({
        body,
        username: user.username,
        user: user._id
      })
      user.posts.push(newPost._id);
      await user.updateOne(user);
      await newPost.save();
      return {
        ...newPost._doc,
        id: newPost._id,
        user: { ...user._doc, id: user._id }
      }
    },
    deletePost: async (_: any, { id }: { id: string }, context: IContext) => {
      const userPayload: IUserPayload = checkAuth(context);

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError(`${id} is not valid id`)
      }

      const fetchedUser = await User.findOne({ _id: userPayload.id });
      if (!fetchedUser) {
        throw new Error("user not found")
      }

      const fetchedPost = await Post.findOne({ _id: id });
      if (!fetchedPost) {
        throw new Error("post not found");
      }

      const postIndexInUser = fetchedUser.posts.findIndex(pId => pId.toString() == fetchedPost._id.toString());
      if (fetchedPost.username == fetchedUser.username) {
        postIndexInUser > -1 && fetchedUser.posts.splice(postIndexInUser, 1); // delete postid from posts array in user
        await fetchedUser.updateOne(fetchedUser);
        await Post.findOneAndDelete({ _id: id });
        return "Post successfully DELETED"
      } else {
        throw new AuthenticationError("you cannot delete that post")
      }


    },
    updatePost: async (_: any, { id, body }: { id: string, body: string }, context: IContext) => {
      const userPayload: IUserPayload = checkAuth(context);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError(`${id} is not valid id`)
      }

      const fetchedUser = await User.findOne({ _id: userPayload.id });
      if (!fetchedUser) {
        throw new Error("user not found")
      }

      const fetchedPost = await Post.findOne({ _id: id }).populate('user');
      if (!fetchedPost) {
        throw new Error("Post not found")
      }

      if (fetchedPost.username != fetchedUser.username) {
        throw new AuthenticationError("You cannot update that post")
      }

      fetchedPost.body = body;
      await fetchedPost.updateOne(fetchedPost);
      return {
        ...fetchedPost._doc,
        id: fetchedPost._id
      }

    }
  }
};
