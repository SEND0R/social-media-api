import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
  },
  status: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
  },
  skills: {
    type: [String],
  },
  experience: {
    type: {
      title: {
        type: String,
        required: true,
      },
      company: {
        type: String,
      },
      location: {
        type: String,
      },
    },
  },
  education: {
    type: {
      degree: {
        type: String,
        required: true,
      },
      college: {
        type: String,
      },
      address: {
        type: String,
      },
    },
  },
});

const profileModel = mongoose.model("profile", profileSchema);

export default profileModel;
