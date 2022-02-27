import mongoose from "mongoose";

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  like: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
      },
    },
  ],
  coments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = mongoose.model("post", schema);
export default postSchema;
