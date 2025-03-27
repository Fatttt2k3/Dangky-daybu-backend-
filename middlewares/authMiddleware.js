const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ success: false, message: "Không có token, từ chối truy cập!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password"); // Lấy thông tin user, bỏ password

        if (!user) {
            return res.status(404).json({ success: false, message: "Người dùng không tồn tại!" });
        }

        req.user = user; // Lưu thông tin user vào request
        next();
    } catch (error) {
        res.status(403).json({ success: false, message: "Token không hợp lệ!" });
    }
};

// Middleware kiểm tra quyền Admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Không có quyền truy cập!" });
    }
    next();
};

// Middleware kiểm tra quyền giáo viên
const isTeacher = (req, res, next) => {
    if (req.user.role !== "teacher") {
        return res.status(403).json({ success: false, message: "Chỉ giáo viên mới có thể đăng ký dạy bù!" });
    }
    next();
};

module.exports = { verifyToken, isAdmin, isTeacher };
