import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/task.model.js";

const createTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const task = await Task.create({ title, description });

  res.status(201).json(new ApiResponse(201, task, "Task created"));
});

const getAllTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find();
    if(!tasks){
        throw new ApiError(404, "No tasks found");
    }
    res.status(200).json(new ApiResponse(200, tasks, "Tasks retrieved"));

})

export { createTask , getAllTasks};
