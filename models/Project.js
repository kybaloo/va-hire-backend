const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    enum: ["en cours", "terminé"],
    default: "en cours"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

ProjectSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Project", ProjectSchema);
