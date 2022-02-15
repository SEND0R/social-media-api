import mongoose from "mongoose";
import { commonValue } from "./config.js";

const db = commonValue.mongourl;

async function connectdb() {
  try {
    await mongoose.connect(db);
    console.log("database connected");
  } catch (err) {
    console.log(err);
  }
}

export default connectdb;
