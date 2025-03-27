const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Mô hình dữ liệu hệ thống
const Monhoc = mongoose.model("monhoc", new mongoose.Schema({ name: { type: String, unique: true } }));
// const Giaovien = mongoose.model("giaovien", new mongoose.Schema({ 
//     name: String, 
//     email: { type: String, unique: true }, 
//     phone: String, 
//     subject: String 
// }));
const Lop = mongoose.model("lop", new mongoose.Schema({ name: { type: String, unique: true } }));
const Tiethoc = mongoose.model("tiethoc", new mongoose.Schema({ number: { type: Number, unique: true } }));
const Buoihoc = mongoose.model("buoihoc", new mongoose.Schema({ name: { type: String, unique: true } }));

//   THÊM DỮ LIỆU HỆ THỐNG

// Thêm môn học
router.post("/them-monhoc", verifyToken, isAdmin, async (req, res) => {
    try {
        const existing = await Monhoc.findOne({ name: req.body.name });
        if (existing) return res.status(400).json({ success: false, message: "Môn học đã tồn tại!" });

        const monhoc = new Monhoc({ name: req.body.name });
        await monhoc.save();
        res.json({ success: true, message: "Thêm môn học thành công!", data: monhoc });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server!", error: error.message });
    }
});

// // Thêm giáo viên
// router.post("/them-giaovien", verifyToken, isAdmin, async (req, res) => {
//     try {
//         const existing = await Giaovien.findOne({ email: req.body.email });
//         if (existing) return res.status(400).json({ success: false, message: "Giáo viên đã tồn tại!" });

//         const giaovien = new Giaovien(req.body);
//         await giaovien.save();
//         res.json({ success: true, message: "Thêm giáo viên thành công!", data: giaovien });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Lỗi server!", error: error.message });
//     }
// });

// Thêm lớp
router.post("/them-lop", verifyToken, isAdmin, async (req, res) => {
    try {
        const existing = await Lop.findOne({ name: req.body.name });
        if (existing) return res.status(400).json({ success: false, message: "Lớp đã tồn tại!" });

        const lop = new Lop({ name: req.body.name });
        await lop.save();
        res.json({ success: true, message: "Thêm lớp thành công!", data: lop });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server!", error: error.message });
    }
});

// Thêm tiết học
router.post("/them-tiethoc", verifyToken, isAdmin, async (req, res) => {
    try {
        const existing = await Tiethoc.findOne({ number: req.body.number });
        if (existing) return res.status(400).json({ success: false, message: "Tiết học đã tồn tại!" });

        const tiethoc = new Tiethoc({ number: req.body.number });
        await tiethoc.save();
        res.json({ success: true, message: "Thêm tiết học thành công!", data: tiethoc });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server!", error: error.message });
    }
});

// Thêm buổi học
router.post("/them-buoihoc", verifyToken, isAdmin, async (req, res) => {
    try {
        const existing = await Buoihoc.findOne({ name: req.body.name });
        if (existing) return res.status(400).json({ success: false, message: "Buổi học đã tồn tại!" });

        const buoihoc = new Buoihoc({ name: req.body.name });
        await buoihoc.save();
        res.json({ success: true, message: "Thêm buổi học thành công!", data: buoihoc });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server!", error: error.message });
    }
});

//   XÓA DỮ LIỆU HỆ THỐNG

// Xóa môn học
router.delete("/xoa-monhoc/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        await Monhoc.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Xóa môn học thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server!", error: error.message });
    }
});

// // Xóa giáo viên
// router.delete("/xoa-giaovien/:id", verifyToken, isAdmin, async (req, res) => {
//     try {
//         await Giaovien.findByIdAndDelete(req.params.id);
//         res.json({ success: true, message: "Xóa giáo viên thành công!" });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Lỗi server!", error: error.message });
//     }
// });

// Xóa lớp
router.delete("/xoa-lop/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        await Lop.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Xóa lớp thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server!", error: error.message });
    }
});

// Xóa tiết học
router.delete("/xoa-tiethoc/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        await Tiethoc.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Xóa tiết học thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server!", error: error.message });
    }
});

// Xóa buổi học
router.delete("/xoa-buoihoc/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        await Buoihoc.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Xóa buổi học thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server!", error: error.message });
    }
});

module.exports = router;
