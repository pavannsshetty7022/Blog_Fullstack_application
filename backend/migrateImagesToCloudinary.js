import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import Post from "./models/Post.js";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected");

const uploadsDir = path.resolve("./uploads");


const migrateImages = async () => {
  const posts = await Post.find({
  uploadImage: { $regex: "^uploads" }
});


  console.log(`Found ${posts.length} images to migrate`);

  for (const post of posts) {
    const localPath = path.join(uploadsDir, path.basename(post.uploadImage));

    if (!fs.existsSync(localPath)) {
      console.log(`File missing: ${localPath}`);
      continue;
    }

    const result = await cloudinary.v2.uploader.upload(localPath, {
      folder: "blog"
    });

    post.uploadImage = result.secure_url;
    await post.save();

    console.log(`Migrated: ${localPath}`);
  }

  console.log("Migration complete");
  process.exit();
};

migrateImages();
