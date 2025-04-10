const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu!' });
        }

        // Kiểm tra mật khẩu có khớp không
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu!' });
        }

        // Tạo token kèm theo role
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ success: true, token, role: user.role });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server!' });
    }
});

// // Đăng nhập
// router.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = await User.findOne({ username });

//         if (!user || !bcrypt.compareSync(password, user.password)) {
//             return res.status(400).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu!' });
//         }

//         // Tạo token kèm theo thông tin role
//         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         res.json({ success: true, token, role: user.role });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Lỗi server!' });
//     }
// });

// Tạo tài khoản
router.post('/tao-taikhoan', verifyToken, isAdmin, async (req, res) => {
    try {
        const { username, password, role, ten, ngaysinh, email, phone, bomon, zaloID } = req.body;

        // Kiểm tra tài khoản đã tồn tại chưa
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Tài khoản đã tồn tại!' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo tài khoản mới
        const newUser = new User({ username, password: hashedPassword, role, ten, ngaysinh, email, phone, bomon, zaloID });
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
// Xem danh sách giáo viên
router.get('/danhsach-giaovien', verifyToken, isAdmin, async (req, res) => {
    try {
        // Lấy tất cả người dùng có role là 'giaovien'
        const danhSach = await User.find({ role: 'teacher' }).select('-password'); // ẩn password

        res.json({ success: true, data: danhSach });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server!', error: error.message });
    }
});

// PUT: Sửa tài khoản giáo viên
router.put("/sua-taikhoan/:id", verifyToken, isAdmin ,async (req, res) => {
    try {
      const { id } = req.params;
      const {
        username,
        password,
        ten,
        ngaysinh,
        email,
        phone,
        bomon,
      } = req.body;
  
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
  
      // Cập nhật các trường
      user.username = username || user.username;
      user.ten = ten || user.ten;
      user.ngaysinh = ngaysinh || user.ngaysinh;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.bomon = bomon || user.bomon;
  
      // Nếu có password mới thì mã hoá
      if (password && password.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
  
      await user.save();
  
      res.json({ message: "Cập nhật thành công!", data: user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi máy chủ!" });
    }
  });
  
  module.exports = router;
  


module.exports = router;
