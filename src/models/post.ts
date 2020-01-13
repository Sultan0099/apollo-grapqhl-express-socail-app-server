import mongoose from "mongoose";
import { IPost } from "../interfaces/post";

const Schema = mongoose.Schema;

const postSchema = new Schema({

    body: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    username: {
        type: String,
        required: true
    },
    likes: [
        {
            likedBy: String,
            userId: Schema.Types.ObjectId,
            likedAt: {
                type: Date,
                Default: Date.now()
            }
        }
    ],
    comments: [
        {
            body: String,
            commentBy: String,
            userId: Schema.Types.ObjectId,
            commentAt: {
                type: Date,
                default: Date.now()
            }
        }
    ]

}, { timestamps: true })

const Post = mongoose.model<IPost>("Post", postSchema, "Post");

export default Post;