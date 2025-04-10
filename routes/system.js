const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const Monhoc = require("../models/Monhoc");
const Lop = require("../models/Lop");
const Tiethoc = require("../models/Tiethoc");
const Buoihoc = require("../models/Buoihoc");
const Tuanhoc = require("../models/Tuanhoc");

// Thêm môn học
router.post("/them-monhoc", verifyToken, isAdmin, async (req, res) => {
    try {
        const monhoc = new Monhoc({ name: req.body.name });
        await monhoc.save();
        res.json({ success: true, message: "Thêm môn học thành công!", data: monhoc });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});

// Thêm lớp
router.post("/them-lop", verifyToken, isAdmin, async (req, res) => {
    try {
        const lop = new Lop({ name: req.body.name });
        await lop.save();
        res.json({ success: true, message: "Thêm lớp thành công!", data: lop });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});

// Thêm tiết học
router.post("/them-tiethoc", verifyToken, isAdmin, async (req, res) => {
    try {
        const existingTiet = await Tiethoc.findOne({ number: req.body.number });
        if (existingTiet) {
            return res.status(400).json({ success: false, message: "Tiết học đã tồn tại!" });
        }
        const tiethoc = new Tiethoc({ number: req.body.number });
        await tiethoc.save();
        res.json({ success: true, message: "Thêm tiết học thành công!", data: tiethoc });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});

// Thêm buổi học
router.post("/them-buoihoc", verifyToken, isAdmin, async (req, res) => {
    try {
        const buoihoc = new Buoihoc({ name: req.body.name });
        await buoihoc.save();
        res.json({ success: true, message: "Thêm buổi học thành công!", data: buoihoc });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});

// Thêm tuần học
router.post("/them-tuan", verifyToken, isAdmin, async (req, res) => {
    try {
        const existingTuan = await Tuanhoc.findOne({ number: req.body.number });
        if (existingTuan) {
            return res.status(400).json({ success: false, message: "Tuần đã tồn tại!" });
        }
        const tuanhoc = new Tuanhoc({ number: req.body.number });
        await tuanhoc.save();
        res.json({ success: true, message: "Thêm tuần học thành công!", data: tuanhoc });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});

// Xóa tuần học
router.delete("/xoa-tuan/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const tuanhoc = await Tuanhoc.findById(req.params.id);
        if (!tuanhoc) {
            return res.status(404).json({ success: false, message: "Tuần không tồn tại!" });
        }
        await Tuanhoc.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Xóa tuần học thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});


// API lấy danh sách môn học
router.get("/monhoc", async (req, res) => {
    try {
        const monHocList = await Monhoc.find();
        res.json(monHocList);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// API lấy danh sách lớp
router.get("/lop", async (req, res) => {
    try {
        const lopList = await Lop.find();
        res.json(lopList);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// API lấy danh sách tiết học
router.get("/tiethoc", async (req, res) => {
    try {
        const tietHocList = await Tiethoc.find();
        res.json(tietHocList);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// API lấy danh sách buổi học
router.get("/buoihoc", async (req, res) => {
    try {
        const buoiHocList = await Buoihoc.find();
        res.json(buoiHocList);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// API lấy danh sách tuần học
router.get("/tuanhoc", async (req, res) => {
    try {
        const tuanHocList = await Tuanhoc.find();
        res.json(tuanHocList);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// Sửa môn học
router.put("/sua-monhoc/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const monhoc = await Monhoc.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true }
        );
        if (!monhoc) {
            return res.status(404).json({ success: false, message: "Không tìm thấy môn học!" });
        }
        res.json({ success: true, message: "Cập nhật môn học thành công!", data: monhoc });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});

// Xoá môn học
router.delete("/xoa-monhoc/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const monhoc = await Monhoc.findById(req.params.id);
        if (!monhoc) {
            return res.status(404).json({ success: false, message: "Môn học không tồn tại!" });
        }
        await Monhoc.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Xóa môn học thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});


module.exports = router;
