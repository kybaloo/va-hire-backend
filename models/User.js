const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() {
      // Password only required if not using social login
      return this.socialProviders.length === 0;
    },
  },
  auth0Id: {
    type: String,
    sparse: true,
    unique: true
  },
  role: {
    type: String,
    enum: ["user", "admin", "professional", "recruiter"],
    default: "user",
  },
  profile: {
    title: String,
    skills: [String],
    experience: String,
    portfolio: String,
    bio: String,
    location: String
  },
  profileImage: {
    type: String,
    default: null
  },
  resume: {
    type: String,
    default: null
  },
  receiveEmails: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  socialProviders: [
    {
      provider: {
        type: String,
        enum: ["google", "linkedin", "github", "facebook"]
      },
      id: String,
      profile: Object // Store additional profile data from social provider
    },
  ],
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;
