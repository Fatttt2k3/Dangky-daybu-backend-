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

// Thêm middleware mới để kiểm tra giáo viên hoặc admin
const isTeacherOrAdmin = (req, res, next) => {
    if (req.user.role === "teacher" || req.user.role === "admin") {
        return next();
    }
    return res.status(403).json({ success: false, message: "Bạn không có quyền đăng ký dạy bù!" });
};
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1]; // Lấy token từ header
        if (!token) return res.status(401).json({ message: "Không có token, truy cập bị từ chối!" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token
        req.user = await User.findById(decoded.id).select("ten bomon"); // Lấy tên giáo viên & bộ môn
        if (!req.user) return res.status(404).json({ message: "Người dùng không tồn tại!" });

        next();
    } catch (error) {
        res.status(401).json({ message: "Token không hợp lệ!" });
    }
};

 
module.exports = { verifyToken, isAdmin, isTeacher, isTeacherOrAdmin, authMiddleware };




