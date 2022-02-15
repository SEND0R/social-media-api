import express from "express";
import checktoken from "../../middlewares/authmiddleware.js";
import userModel from "../../models/userModel.js";
import bcrypt from "bcrypt";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { commonValue } from "../../config/config.js";

const router = express.Router();

// **************************************************************************

router.get("/", checktoken, async (req, res) => {
  try {
    const userData = await userModel.findById(req.user.id).select("-password");
    return res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
});

//  for login post public route 88****************************************
router.post(
  "/",
  [
    check("email", "email must be exixt").exists(),
    check("password", "password must be exist").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { email, password } = req.body;
      try {
        let user = await userModel.findOne({ email });
        if (user) {
          const pcheck = await bcrypt.compare(password, user.password);
          if (pcheck) {
            const payload = {
              user: { id: user.id },
            };
            jwt.sign(
              payload,
              commonValue.signatureKey,
              { expiresIn: 3600 },
              (err, token) => {
                if (err) {
                  throw err;
                } else {
                  res.json({ token });
                }
              }
            );
          } else {
            return res
              .status(400)
              .json({ msg: "email or password does not exist" });
          }
        } else {
          return res
            .status(400)
            .json({ msg: "email or password does not exist" });
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      return res.status(422).json({ errors: errors.array() });
    }
  }
);

export default router;
