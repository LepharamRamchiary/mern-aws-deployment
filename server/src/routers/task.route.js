import { Router } from "express";
import { createTask, getAllTasks, deleteTask, updateTask } from "../controllers/task.controller.js";

const router = Router();

router.route("/").post(createTask).get(getAllTasks);
router.route("/:id").delete(deleteTask);
router.route("/:id").put(updateTask);

export default router;