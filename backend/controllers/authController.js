const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Đăng ký user mới
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Validate input
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin: name, email, password, phone'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

    if (!email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Email không hợp lệ'
      });
    }

    // Create user
    const result = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      address
    });

    // Tạo token
    const token = generateToken(result.insertedId);

    // Lấy thông tin user vừa tạo (không bao gồm password)
    const newUser = await User.findById(result.insertedId);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công!',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    
    if (error.message === 'Email đã được sử dụng') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
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
        message: 'Vui lòng nhập email và mật khẩu'
      });
    }

    // Find user
    const user = await User.findByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Tạo token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

// Lấy thông tin user
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

// Cập nhật thông tin user
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    await User.updateProfile(req.user._id, updateData);
    
    // Lấy thông tin user đã cập nhật
    const updatedUser = await User.findById(req.user._id);

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công!',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
        avatar: updatedUser.avatar
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};