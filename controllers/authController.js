const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Méthode d'inscription de l'utilisateur
exports.register = async (req, res) => {
  try {
    const {
      email,
      name,
      title,
      password,
      passwordConfirm,
      receiveEmails,
      role,
    } = req.body;

    // Vérification si les mots de passe correspondent
    if (password !== passwordConfirm) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Création d'un nouvel utilisateur
    const user = new User({
      name,
      email,
      password,
      role,
      profile: { title },
      receiveEmails,
    });

    // Enregistrement de l'utilisateur
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err.code === 11000) {
      // Erreur de duplicata d'email unique
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};

// Méthode de connexion de l'utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Méthode de connexion sociale
exports.socialRegister = async (req, res) => {
  try {
    const { email, name, socialProvider, socialId } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // Link social account to existing user
      user.socialProviders.push({ provider: socialProvider, id: socialId });
      await user.save();
    } else {
      // Create new user with social registration
      user = new User({
        name,
        email,
        socialProviders: [{ provider: socialProvider, id: socialId }],
        role: 'user', // Default role for social registrations
        isProfileComplete: false,
      });
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ 
      token, 
      role: user.role, 
      isProfileComplete: user.isProfileComplete 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Méthode de complétion du profil
exports.completeProfile = async (req, res) => {
  try {
    const { title, receiveEmails } = req.body;
    const userId = req.user.id; // Assuming you have authentication middleware

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        'profile.title': title, 
        receiveEmails, 
        isProfileComplete: true 
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile completed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
