const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Đăng nhập
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu!' });
        }

        // Tạo token kèm theo thông tin role
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ success: true, token, role: user.role });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server!' });
    }
});

// Tạo tài khoản
router.post('/tao-taikhoan', verifyToken, isAdmin, async (req, res) => {
    try {
        const { username, password, role, ten, ngaysinh, email, phone, bomon } = req.body;

        // Kiểm tra tài khoản đã tồn tại chưa
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Tài khoản đã tồn tại!' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo tài khoản mới
        const newUser = new User({ username, password: hashedPassword, role, ten, ngaysinh, email, phone, bomon });
        await newUser.save();

        res.json({ success: true, message: 'Tạo tài khoản thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server!' });
    }
});

// Xóa tài khoản (chỉ Admin mới có quyền)
router.delete('/xoa-taikhoan/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại!' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Xóa tài khoản thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server!', error: error.message });
    }
});

module.exports = router;
