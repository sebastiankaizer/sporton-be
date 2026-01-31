import { Router } from "express";
import { signin, initiateAdmin } from "../controllers/auth.controller";

const router = Router();

// Public (no auth)
router.post("/initiate-admin-user", initiateAdmin);
router.post("/signin", signin);

export default router;
