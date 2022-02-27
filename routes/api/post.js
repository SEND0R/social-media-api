import express from "express";
import checktoken from "../../middlewares/authmiddleware.js";
import userModel from "../../models/userModel.js";
import bcrypt from "bcrypt";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { commonValue } from "../../config/config.js";
import profileModel from "../../models/profilemodel.js";
import postModel from "../../models/postmodel.js";

const router = express.Router();

router.post(
  "/",
  checktoken,
  [check("text", "text is required").notEmpty()],
  async (req, res) => {
    const error = validationResult(req);
    if (error) {
      return res.status(500).json({ error: error.array() });
    } else {
      try {
        const user = await userModel.findById(req.user.id).select("-password");
        const mypost = new new postModel(
          {
            Text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id,
          }()
        )();
        const post = await mypost.save();
        return res.json({ post });
      } catch (error) {
        return res.status(500).send("server error");
      }
    }
  }
);
router.get("/", checktoken, async (req, res) => {
  try {
    const posts = await postModel.find().sort({ date: -1 });
  } catch (error) {
    return res.status(500).send("server error");
  }
});

router.get("/:id", checktoken, async (req, res) => {
  try {
    const post = await postModel.findById(req.user.id).sort({ date: -1 });
    if (post) {
      return res.json({ post });
    } else {
      return res.status(404).json({ msg: "post not found" });
    }
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    return res.status(500).send("server error");
  }
});

//  delete request

router.delete("/:id", checktoken, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (post.user.toString === req.user.id) {
      if (post) {
        await post.remove();
        return res.json({ msg: "post deleted" });
      } else {
        return res.status(404).json({ msg: "post not found" });
      }
    } else {
      return res.status(401).json({ msg: "user  not authroized" });
    }
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    return res.status(500).send("server error");
  }
});

// for like post
router.put("/post/like/:id", checktoken, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json({ likes: post.likes });
  } catch (error) {
    return res.status(500).send("server error");
  }
});

//  add comment on post

router.post(
  "/comment/:id",
  checktoken,
  [check("text", "text is required").notEmpty()],
  async (req, res) => {
    const error = validationResult(req);
    if (error) {
      return res.status(500).json({ error: error.array() });
    } else {
      try {
        const post = await postModel.findById(req.params.id);
        const user = await userModel.findById(req.user.id).select("-password");
        const mycomment = {
          Text: req.body.text,
          name: user.name,
          avatar: user.avatar,
          user: req.user.id,
        }();
        post.comment.push(mycomment);
        post = await post.save();

        return res.json({ post });
      } catch (error) {
        return res.status(500).send("server error");
      }
    }
  }
);

//  delete comment
router.delete("/comment/:id/:comment_id", checktoken, async (req, res) => {
  try {
    const pos = await postModel.findById(req.params.id);
    const comment = post.comment.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (comment) {
      if (comment.user.id.toString === req.user.id) {
        const rmcomment = post.comments
          .map((comment) => comment.user.toString())
          .indexOf(req.user.id);
        post.comments.splice(rmcomment, 1);
        res.json(post.comments);
      } else {
        return req.json({ msg: "user not arthroized" });
      }
    } else {
      res.status(404).json({ msg: "comment not found" });
    }
  } catch (error) {}
});

export default router;
