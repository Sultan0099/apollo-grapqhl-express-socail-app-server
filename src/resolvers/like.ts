import mongoose from "mongoose";


import { IContext } from "../interfaces/appollo";
import { Post, User } from "../models";
import { checkAuth } from "../utils/verification";
import { IUserPayload } from "../interfaces/user";
import { AuthenticationError } from "apollo-server-express";

export default {

    Mutation: {
        likePost: async (_: any, { postId }: { postId: string }, context: IContext) => {
            if (!mongoose.Types.ObjectId.isValid(postId)) {
                throw new Error(`${postId} is not valid mongoose Id`)
            }

            const userPayload: IUserPayload = checkAuth(context);
            const fetchedUser = await User.findOne({ _id: userPayload.id });
            if (!fetchedUser) {
                throw new Error("User not found")
            }

            const fetchedPost = await Post.findOne({ _id: postId })
            if (!fetchedPost) {
                throw new Error("Post not found")
            }
            const likeIndex = fetchedPost.likes.findIndex(l => l.likedBy == fetchedUser.username);

            if (likeIndex == -1) {
                fetchedPost.likes.push({
                    likedBy: fetchedUser.username,
                    userId: fetchedUser._id,
                    likedAt: `${Date.now()}`
                })
            } else {
                fetchedPost.likes.splice(likeIndex, 1);
            }



            await fetchedPost.updateOne(fetchedPost);



            return {
                ...fetchedPost._doc,
                id: fetchedPost.id
            }

        }
    }
}