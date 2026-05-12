import { Router } from "express";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  getCurrentUser,
  login,
  registerUser,
  logoutUser,
} from "../controllers/auth.controllers.js";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { authLimiter } from "../middlewares/rateLimit.js";

const router = Router();

router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(authLimiter, userLoginValidator(), validate, login);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);

export default router;
