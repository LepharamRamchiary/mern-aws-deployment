import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/task.model.js";

const createTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

//   const task = new Task({ title, description });
//   await task.save();

  const task = await Task.create({ title, description });

  res.status(201).json(new ApiResponse(true, task, "Task created"));
});

export { createTask };
