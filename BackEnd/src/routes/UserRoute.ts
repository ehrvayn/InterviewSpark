import { Router } from "express";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { registerUserCon, loginController, retrieveUserCon } from "../controllers/UserController";

const router = Router();

router.post("/register", registerUserCon);
router.post("/login", loginController);
router.get("/retrieve", authMiddleware, retrieveUserCon);

export default router;