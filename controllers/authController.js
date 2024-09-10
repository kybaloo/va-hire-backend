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
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
