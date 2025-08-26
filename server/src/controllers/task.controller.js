import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/task.model.js";
import mongoose from "mongoose";

const createTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const task = await Task.create({ title, description });

  res.status(201).json(new ApiResponse(201, task, "Task created"));
});

const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find();
  if (!tasks) {
    throw new ApiError(404, "No tasks found");
  }
  res.status(200).json(new ApiResponse(200, tasks, "Tasks retrieved"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  res.status(200).json(new ApiResponse(200, task, "Task deleted"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  const task = await Task.findByIdAndUpdate(
    id,
    { title, description, completed },
    { new: true }
  );
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  res.status(200).json(new ApiResponse(200, task, "Task updated"));
});

export { createTask, getAllTasks, deleteTask, updateTask };
