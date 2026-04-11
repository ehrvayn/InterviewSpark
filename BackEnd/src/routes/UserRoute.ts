import { Router } from "express";
import { registerUserCon } from "../controllers/UserController";
import { loginController } from "../controllers/UserController";

const router = Router();

router.post("/register", registerUserCon);
router.post("/login", loginController);

export default router;