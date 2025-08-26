import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

taskSchema.pre(
  ["findOneAndUpdate", "updateOne", "updateMany"],
  function (next) {
    this.set({ updatedAt: Date.now() });
    next();
  }
);
taskSchema.methods.toggleComplete = function () {
  this.completed = !this.completed;
  return this.save();
};
taskSchema.statics.getByPriority = function (priority) {
  return this.find({ priority: priority });
};

taskSchema.statics.getCompleted = function () {
  return this.find({ completed: true });
};

taskSchema.statics.getPending = function () {
  return this.find({ completed: false });
};

taskSchema.virtual("ageInDays").get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

taskSchema.index({ createdAt: -1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ completed: 1 });

export const Task = mongoose.model("Task", taskSchema);
