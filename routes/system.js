const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const Monhoc = require("../models/Monhoc");
const Lop = require("../models/Lop");
const Tiethoc = require("../models/Tiethoc");
const Buoihoc = require("../models/Buoihoc");
const Tuanhoc = require("../models/Tuanhoc");
const Bomon = require("../models/Bomon")

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

// === LỚP ===

// Sửa lớp
router.put("/sua-lop/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const updated = await Lop.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: "Không tìm thấy lớp!" });
        res.json({ success: true, message: "Cập nhật lớp thành công!", data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});

// Xóa lớp
router.delete("/xoa-lop/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const deleted = await Lop.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy lớp!" });
        res.json({ success: true, message: "Xóa lớp thành công!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});


// === TIẾT HỌC ===

// Sửa tiết học
router.put("/sua-tiethoc/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const updated = await Tiethoc.findByIdAndUpdate(req.params.id, { number: req.body.number }, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: "Không tìm thấy tiết học!" });
        res.json({ success: true, message: "Cập nhật tiết học thành công!", data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});

// Xóa tiết học
router.delete("/xoa-tiethoc/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const deleted = await Tiethoc.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy tiết học!" });
        res.json({ success: true, message: "Xóa tiết học thành công!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});


// === BUỔI HỌC ===

// Sửa buổi học
router.put("/sua-buoihoc/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const updated = await Buoihoc.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: "Không tìm thấy buổi học!" });
        res.json({ success: true, message: "Cập nhật buổi học thành công!", data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});

// Xóa buổi học
router.delete("/xoa-buoihoc/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const deleted = await Buoihoc.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy buổi học!" });
        res.json({ success: true, message: "Xóa buổi học thành công!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});


// === TUẦN HỌC ===

// Sửa tuần học
router.put("/sua-tuan/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const updated = await Tuanhoc.findByIdAndUpdate(req.params.id, { number: req.body.number }, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: "Không tìm thấy tuần học!" });
        res.json({ success: true, message: "Cập nhật tuần học thành công!", data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});

// Lấy danh sách bộ môn
router.get("/bomon", verifyToken, isAdmin, async (req, res) => {
    const list = await Bomon.find();
    res.json({ success: true, data: list });
  });
  
  // Thêm bộ môn
  router.post("/them-bomon", verifyToken, isAdmin, async (req, res) => {
    const { ten } = req.body;
    const existed = await Bomon.findOne({ ten });
    if (existed)
      return res.status(400).json({ success: false, message: "Đã tồn tại!" });
  
    const newOne = new Bomon({ ten });
    await newOne.save();
    res.json({ success: true, message: "Đã thêm!" });
  });
  
  // Xoá bộ môn
  router.delete("/xoa-bomon/:id", verifyToken, isAdmin, async (req, res) => {
    await Bomon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Đã xoá!" });
  });



  
module.exports = router;
