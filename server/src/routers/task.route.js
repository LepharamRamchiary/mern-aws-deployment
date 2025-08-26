import { Router } from "express";
import { createTask, getAllTasks, deleteTask } from "../controllers/task.controller.js";

const router = Router();

router.route("/").post(createTask).get(getAllTasks);
router.route("/:id").delete(deleteTask);

export default router;