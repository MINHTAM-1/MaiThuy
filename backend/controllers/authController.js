// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Đăng ký user mới
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Validation
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin: name, email, password, phone",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu phải có ít nhất 6 ký tự",
      });
    }

    // Create user
    const result = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      address,
    });

    console.log("🔍 User creation result:", result);

    if (!result || !result.insertedId) {
      console.error("User creation failed - no insertedId:", result);
      return res.status(500).json({
        success: false,
        message: "Lỗi tạo tài khoản: Không thể lấy ID người dùng",
      });
    }

    const token = generateToken(result.insertedId);

    const newUser = await User.findById(result.insertedId);
    if (!newUser) {
      console.error("User not found after creation:", result.insertedId);
      return res.status(500).json({
        success: false,
        message: "Lỗi tạo tài khoản: Không thể tìm thấy người dùng sau khi tạo",
      });
    }

    console.log("New user created:", newUser);

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công!",
      data: {
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          address: newUser.address,
          role: newUser.role,
        },
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    if (error.message === "Email đã được sử dụng") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập email và mật khẩu",
      });
    }

    // Find user
    const user = await User.findByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    // Tạo token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Đăng nhập thành công!",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

// Lấy thông tin user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy user",
      });
    }

    res.json({
      success: true,
      message: "Lấy thông tin thành công",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin profile: " + error.message,
    });
  }
};
