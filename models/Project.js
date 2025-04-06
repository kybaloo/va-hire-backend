const mongoose = require("mongoose");

const AttachmentSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const ProjectSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  skillsRequired: {
    type: [String],
    default: []
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
    enum: ["en cours", "terminé", "payé"],
    default: "en cours"
  },
  attachments: {
    type: [AttachmentSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

ProjectSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Project", ProjectSchema);
