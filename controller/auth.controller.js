class AuthController {
  constructor() {
    this.validation = require('../validation/user.validation');
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await this.authService.login(username, password);
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async logout(req, res) {
    try {
      await this.authService.logout(req.user);
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


  const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // adjust path
const config = require('../config');

// async function signup(req, res) {
//   try {
//     const { name, email, password, role_id } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ status: false, message: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role_id
//     });

//     return res.status(201).json({
//       status: true,
//       message: "Signup successful",
//       user: {
//         id: newUser._id,
//         name: newUser.name,
//         email: newUser.email
//       }
//     });

//   } catch (err) {
//     console.error("Signup error:", err);
//     return res.status(500).json({ status: false, message: "Internal server error" });
//   }
// }

// async function login(req, res) {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email }).populate("role_id");
//     if (!user) {
//       return res.status(401).json({ status: false, message: "Invalid email or password" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ status: false, message: "Invalid email or password" });
//     }

//     if (user.is_active === 0) {
//       return res.status(403).json({ status: false, message: "User is inactive" });
//     }

//     const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
//       expiresIn: config.JWT_EXPIRES_IN
//     });

//     return res.status(200).json({
//       status: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role_id?.name,
//         access_modules: user.role_id?.access_module || []
//       }
//     });

//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({ status: false, message: "Internal server error" });
//   }
// }


}