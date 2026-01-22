import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";


import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for migration");

        const postsCollection = mongoose.connection.db.collection("posts");
        const rawPosts = await postsCollection.find({}).toArray();

        const newLikes = [];
        const newComments = [];
        const postsToClean = [];

        console.log(`Found ${rawPosts.length} posts to process`);

        for (const post of rawPosts) {
            if (Array.isArray(post.likes)) {
                for (const userId of post.likes) {
                    if (!userId) continue;
                    newLikes.push({
                        postId: post._id,
                        userId: userId,
                        type: "like",
                    });
                }
            }

            if (Array.isArray(post.dislikes)) {
                for (const userId of post.dislikes) {
                    if (!userId) continue;
                    newLikes.push({
                        postId: post._id,
                        userId: userId,
                        type: "dislike",
                    });
                }
            }

            if (Array.isArray(post.comments)) {
                for (const comment of post.comments) {
                    if (!comment.user) continue;
                    newComments.push({
                        postId: post._id,
                        userId: comment.user || comment.userId,
                        text: comment.text || comment.content,
                        createdAt: comment.createdAt || new Date(),
                    });
                }
            }

            postsToClean.push(post._id);
        }

        if (newLikes.length > 0) {
            await Like.insertMany(newLikes, { ordered: false });
            console.log(`Migrated ${newLikes.length} likes/dislikes`);
        }

        if (newComments.length > 0) {
            await Comment.insertMany(newComments, { ordered: false });
            console.log(`Migrated ${newComments.length} comments`);
        }

        if (postsToClean.length > 0) {
            await postsCollection.updateMany(
                { _id: { $in: postsToClean } },
                { $unset: { likes: "", dislikes: "", comments: "" } }
            );
            console.log("Removed old likes, dislikes, and comments fields from posts");
        }

        console.log("Migration completed successfully");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

migrate();
