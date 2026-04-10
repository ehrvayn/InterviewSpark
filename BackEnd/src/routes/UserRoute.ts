import { Router } from "express";
import { registerUserCon } from "../controllers/UserControllers";
import { loginController } from "../controllers/UserControllers";

const router = Router();

router.post("/register", registerUserCon);
router.post("/login", loginController);

export default router;