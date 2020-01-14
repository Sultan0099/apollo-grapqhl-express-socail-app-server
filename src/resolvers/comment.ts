import mongoose from "mongoose";

import { IContext } from "../interfaces/appollo";
import { Post, User } from "../models";
import { UserInputError, AuthenticationError } from "apollo-server-express";
import { checkAuth } from "../utils/verification";
import { IUserPayload } from "../interfaces/user";

export default {

    Mutation: {

        // Create comment Resolver 
        createComment: async (
            _: any,
            { postId, body }: { postId: string, body: string },
            context: IContext
        ) => {
            if (!mongoose.Types.ObjectId.isValid(postId)) {
                throw new UserInputError(`${postId} is not valid id`)
            }

            const userPayload: IUserPayload = checkAuth(context);
            const fetchedPost = await Post.findOne({ _id: postId }).populate('user');
            if (!fetchedPost) {
                throw new Error(`post not found of this ${postId}`)
            }

            const fetchedUser = await User.findOne({ _id: userPayload.id });

            if (!fetchedUser) {
                throw new Error("User not found")
            }

            fetchedPost.comments.push({
                body,
                commentBy: fetchedUser._doc.username,
                userId: fetchedUser._id,
                commentAt: `${Date.now}`

            })



            await fetchedPost.updateOne(fetchedPost);
            return {
                ...fetchedPost._doc,
                id: fetchedPost.id
            }
        },

        // Delete Comment Resolver 
        deleteComment: async (_: any, { postId, commentId }: { postId: string, commentId: string }, context: IContext) => {

            const userPayload: IUserPayload = checkAuth(context)

            if (!mongoose.Types.ObjectId.isValid(postId)) {
                throw new Error(`${postId} is not valid id`)
            }
            if (!mongoose.Types.ObjectId.isValid(commentId)) {
                throw new Error(`${commentId} is not valid id`)
            }

            const fetchedUser = await User.findOne({ _id: userPayload.id });
            if (!fetchedUser) {
                throw new Error(`User not found`)
            }

            const fetchedPost = await Post.findOne({ _id: postId }).populate('user');
            if (!fetchedPost) {
                throw new Error(`post not found of this id : ${postId}`)
            }

            const commentIndex = fetchedPost.comments.findIndex(c => c.commentBy == fetchedUser.username);

            if (commentIndex != -1) {

                const comments = fetchedPost.comments.filter(comment => commentId != comment._id);
                fetchedPost.comments = [...comments]
                await fetchedPost.updateOne(fetchedPost);

            } else {
                throw new AuthenticationError("you cannot delete that comment")
            }




            return {
                ...fetchedPost._doc,
                id: fetchedPost._id
            }

        },

        // Update Comment Resolver 
        updateComment: async (
            _: any,
            { postId, commentId, body }: { postId: string, commentId: string, body: string },
            context: IContext
        ) => {
            const userPayload: IUserPayload = checkAuth(context)

            if (!mongoose.Types.ObjectId.isValid(postId)) {
                throw new Error(`${postId} is not valid id`)
            }
            if (!mongoose.Types.ObjectId.isValid(commentId)) {
                throw new Error(`${commentId} is not valid id`)
            }

            const fetchedUser = await User.findOne({ _id: userPayload.id });
            if (!fetchedUser) {
                throw new Error(`User not found`)
            }

            const fetchedPost = await Post.findOne({ _id: postId }).populate('user');
            if (!fetchedPost) {
                throw new Error(`post not found of this id : ${postId}`)
            }

            const commentIndex = fetchedPost.comments.findIndex(c => c.commentBy == fetchedUser.username);

            if (commentIndex != -1) {
                fetchedPost.comments[commentIndex].body = body;
                await fetchedPost.updateOne(fetchedPost);

            } else {
                throw new AuthenticationError("you cannot update that comment")
            }

            return {
                ...fetchedPost._doc,
                id: fetchedPost._id
            }

        }
    }
}