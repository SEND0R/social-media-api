import Jwt from "jsonwebtoken";
import { commonValue } from "../config/config.js";

function checktoken(req, res, next) {
  const token = req.header("token_key");
  if (token) {
    try {
      Jwt.verify(token, commonValue.signatureKey, (err, decodedtoken) => {
        if (err) {
          throw err;
        } else {
          req.user = decodedtoken.user;
        }
      });
    } catch (error) {
      return res.status(401).json({ msg: "sesson expired" });
    }
  } else {
    return res.status(401).json({ nsg: "user not authorized" });
  }
  next();
}
export default checktoken;
