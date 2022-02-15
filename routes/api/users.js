import express from "express";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import { commonValue } from "../../config/config.js";
import bcrypt from "bcrypt";
import { check, validationResult } from "express-validator";
import userModel from "../../models/userModel.js";

const router = express.Router();

// **************************************************************************

router.post(
  "/",
  [
    check("name", "name is not valid").notEmpty(),
    check("email", "email is not valid").isEmail(),
    check("password", "password must be atleast 8 character").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, password, email } = req.body;
    try {
      let user = await userModel.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: "user is exist" }] });
      } else {
        const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
        user = new userModel({ name, email, password, avatar });
        const sault = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, sault);
        await user.save();
        const payload = {
          id: user.id,
        };
        jwt.sign(
          payload,
          commonValue.signatureKey,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) {
              throw err;
            } else {
              return res.json({ token });
            }
          }
        );
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("server error");
    }
  }
);

export default router;
