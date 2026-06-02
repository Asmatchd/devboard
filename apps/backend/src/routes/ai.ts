import { Router } from "express";
import { generateTaskDescription, breakdownTask } from "../controllers/aiController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.post("/generate-description", generateTaskDescription);
router.post("/breakdown", breakdownTask);

export default router;
