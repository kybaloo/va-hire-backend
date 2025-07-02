const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Méthode d'inscription de l'utilisateur
exports.register = async (req, res) => {
  try {
    const {
      email,
      firstname,
      lastname,
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
      firstname,
      lastname,
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

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Méthode de connexion sociale - for use with traditional JWT system
exports.socialRegister = async (req, res) => {
  try {
    const {
      email,
      firstname,
      lastname,
      socialProvider,
      socialId,
      profileData,
    } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // Check if this social provider is already linked
      const existingProvider = user.socialProviders.find(
        (p) => p.provider === socialProvider && p.id === socialId
      );

      if (!existingProvider) {
        // Link new social account to existing user
        user.socialProviders.push({
          provider: socialProvider,
          id: socialId,
          profile: profileData || {},
        });
        await user.save();
      }
    } else {
      // Create new user with social registration
      user = new User({
        firstname: firstname || profileData?.given_name || "User",
        lastname: lastname || profileData?.family_name || "User",
        email,
        socialProviders: [
          {
            provider: socialProvider,
            id: socialId,
            profile: profileData || {},
          },
        ],
        role: "user", // Default role for social registrations
        isProfileComplete: false,
      });
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      token,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Handle Auth0 social login - used with Auth0 integration
exports.handleAuth0Login = async (req, res) => {
  try {
    // The auth0 user data comes from the req.auth object set by the checkJwt middleware
    const auth0User = req.auth;

    if (!auth0User || !auth0User.sub) {
      return res.status(400).json({ error: "Invalid Auth0 token" });
    }

    // The sub property contains the unique Auth0 user ID
    const auth0Id = auth0User.sub;
    const email = auth0User.email || "";

    // Look for existing user by Auth0 ID first, then by email
    let user = await User.findOne({ auth0Id });

    if (!user && email) {
      // Try to find by email as a fallback
      user = await User.findOne({ email });
    }

    if (user) {
      // Update existing user with Auth0 info if needed
      if (!user.auth0Id) {
        user.auth0Id = auth0Id;
      }

      // Determine social provider from the auth0Id
      // Auth0 uses identifiers like: google-oauth2|123456789
      const providerMatch = auth0Id.match(/^([^|]+)/);
      const provider = providerMatch ? providerMatch[1] : "auth0";

      // Add or update social provider if it's a social login
      if (provider !== "auth0") {
        const socialProviderId = auth0Id.split("|")[1];
        const normalizedProvider =
          provider === "google-oauth2" ? "google" : provider;

        // Check if this social provider is already linked
        const existingProviderIndex = user.socialProviders.findIndex(
          (p) => p.provider === normalizedProvider && p.id === socialProviderId
        );

        if (existingProviderIndex === -1) {
          // Add new provider
          user.socialProviders.push({
            provider: normalizedProvider,
            id: socialProviderId,
            profile: {
              name: auth0User.name,
              picture: auth0User.picture,
              email: auth0User.email,
              // Add any other fields from auth0User
            },
          });
        } else {
          // Update existing provider info
          user.socialProviders[existingProviderIndex].profile = {
            name: auth0User.name,
            picture: auth0User.picture,
            email: auth0User.email,
            // Add any other fields from auth0User
          };
        }
      }

      // Update user data from Auth0 profile if it's incomplete
      if (!user.firstname && auth0User.given_name) {
        user.firstname = auth0User.given_name;
      }

      if (!user.lastname && auth0User.family_name) {
        user.lastname = auth0User.family_name;
      }

      if (!user.profileImage && auth0User.picture) {
        user.profileImage = auth0User.picture;
      }

      // Update last login timestamp
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user with Auth0 data
      // Determine provider from auth0Id
      const providerMatch = auth0Id.match(/^([^|]+)/);
      const provider = providerMatch ? providerMatch[1] : "auth0";
      const socialProviderId = auth0Id.split("|")[1] || "";
      const normalizedProvider =
        provider === "google-oauth2" ? "google" : provider;

      // Create new user
      user = new User({
        firstname:
          auth0User.given_name || auth0User.name?.split(" ")[0] || "User",
        lastname:
          auth0User.family_name ||
          auth0User.name?.split(" ").slice(1).join(" ") ||
          "",
        email: auth0User.email,
        auth0Id,
        profileImage: auth0User.picture,
        socialProviders:
          provider !== "auth0"
            ? [
                {
                  provider: normalizedProvider,
                  id: socialProviderId,
                  profile: {
                    name: auth0User.name,
                    picture: auth0User.picture,
                    email: auth0User.email,
                  },
                },
              ]
            : [],
        role: "user",
        isProfileComplete: false,
      });

      await user.save();
    }

    // Return user data to the client
    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        profileImage: user.profileImage,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (err) {
    console.error("Auth0 login error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Méthode de complétion du profil
exports.completeProfile = async (req, res) => {
  try {
    const { title, skills, experience, portfolio, receiveEmails } = req.body;

    // Get user from the database (populated by getUserData middleware)
    const user = req.dbUser;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user profile
    user.profile.title = title || user.profile.title;
    user.profile.skills = skills || user.profile.skills;
    user.profile.experience = experience || user.profile.experience;
    user.profile.portfolio = portfolio || user.profile.portfolio;
    user.receiveEmails =
      receiveEmails !== undefined ? receiveEmails : user.receiveEmails;
    user.isProfileComplete = true;

    await user.save();

    res.status(200).json({
      message: "Profile completed successfully",
      user: {
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        profile: user.profile,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (err) {
    console.error("Error completing profile:", err);
    res.status(500).json({ error: err.message });
  }
};
