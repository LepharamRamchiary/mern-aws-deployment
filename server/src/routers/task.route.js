import { Router } from "express";
import { createTask, getAllTasks } from "../controllers/task.controller.js";

const router = Router();

router.route("/").post(createTask).get(getAllTasks);

export default router;