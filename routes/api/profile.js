import express from "express";
import checktoken from "../../middlewares/authmiddleware.js";
import userModel from "../../models/userModel.js";
import bcrypt from "bcrypt";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { commonValue } from "../../config/config.js";
import profileModel from "../../models/profilemodel.js";

const router = express.Router();

// **************************************************************************
//  route for  making profile and it is post request
router.post(
  "/",
  checktoken,
  [check("status", "your current status is required").notEmpty()],
  async (req, res) => {
    let error = validationResult(req);
    if (error) {
      return res.status(400).json({ error: error.array() });
    } else {
      const {
        status,
        summary,
        skills,
        title,
        company,
        location,
        degree,
        college,
        address,
      } = req.body;
      // make the profile object first
      const profileData = {};
      profileData.user = req.user.id;
      profileData.status = status;
      if (summary) {
        profileData.summary = summary;
      }
      if (skills) {
        profileData.skills = skills.map((value) => {
          value.trim();
        });
      }

      try {
        let profile = await profileModel.findOne({ user: req.user.id });
        if (profile) {
          profile = await profileModel.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileData },
            { new: true }
          );
          return res.json({ profile });
        } else {
          profile = new profileModel(profileData);
          await profile.save();
          return res.json({ profile });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send("server error");
      }
    }
  }
);

//  route for sending profile data and it is get request

router.get("/myprofile", checktoken, async (req, res) => {
  try {
    const profile = await profileModel
      .findOne({ userId: req.user.id })
      .populate("userModel", ["name", "avatar"]);
    if (profile) {
      res.json({ profile });
    } else {
      res.status(500).json({ msg: "server error" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "server error" });
  }
});

//  get all profiles
router.get("/userlist", async (req, res) => {
  try {
    const allprofile = await profileModel
      .find()
      .populate("user", ["name", "avatar"]);
    res.json({ allprofile });
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
});

//  get one profile profiles
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await profileModel
      .findOne({ user: req.params.user_id })
      .populate("user", ["name", "avatar"]);
    if (!profile) {
      res.status(404).json({ nsg: "no profile for this user" });
    }
    res.json({ profile });
  } catch (error) {
    if (error.kind == "ObjectId") {
      res.status(404).json({ nsg: "no profile for this user" });
    }
    console.error(error);
    res.status(500).send("server error");
  }
});

//  updating profile data( education)

router.put(
  "/experience",
  checktoken,
  [check("title", "title must be present").notEmpty()],
  async (req, res) => {
    const error = validationResult(req);
    if (error) {
      return res.json({ error: error.array() });
    } else {
      try {
        const { title, company, location } = req.body;
        const profile = await profileModel.findOne({ user: req.user.id });
        profile.experience = {};

        if (title) {
          profile.experience.title = title;
        }
        if (company) {
          profile.experience.company = company;
        }
        if (location) {
          profile.experience.location = location;
        }
        await profile.save();
        return res.json({ profile });
      } catch (error) {
        res.status(500).send("server error");
      }
    }
  }
);

// add education

router.put(
  "/education",
  checktoken,
  [check("degree", "degree must be present").notEmpty()],
  async (req, res) => {
    const error = validationResult(req);
    if (error) {
      return res.json({ error: error.array() });
    } else {
      try {
        const { title, company, location } = req.body;
        const profile = await profileModel.findOne({ user: req.user.id });

        // make education object
        profile.education = {};
        if (degree) {
          profile.education.degree = degree;
        }
        if (college) {
          profile.education.college = college;
        }
        if (address) {
          profile.education.address = address;
        }
        await profile.save();
        return res.json({ profile });
      } catch (error) {
        res.status(500).send("server error");
      }
    }
  }
);

export default router;
