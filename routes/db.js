const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const MakeupClass = require("../models/MakeupClass");

// ====================== BACKUP ======================

// Backup một bảng theo tên
router.get("/backup/:collection", verifyToken, isAdmin, async (req, res) => {
  try {
    const name = req.params.collection;
    const model = mongoose.model(name);
    const data = await model.find({});
    const filePath = path.join(__dirname, `../backup/${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.download(filePath, `${name}.json`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi backup bảng!" });
  }
});

// Backup toàn bộ cơ sở dữ liệu
router.get("/backup-all", verifyToken, isAdmin, async (req, res) => {
  try {
    const allModels = mongoose.modelNames();
    const allData = {};

    for (const name of allModels) {
      const model = mongoose.model(name);
      allData[name] = await model.find({});
    }

    const filePath = path.join(__dirname, `../backup/backup_all.json`);
    fs.writeFileSync(filePath, JSON.stringify(allData, null, 2));
    res.download(filePath, `backup_all.json`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi backup toàn bộ!" });
  }
});

// ====================== IMPORT ======================

// Import bảng cụ thể từ file JSON upload
router.post("/import/:collection", verifyToken, isAdmin, async (req, res) => {
  try {
    const name = req.params.collection;
    const clearBefore = req.query.clear === "true";
    const model = mongoose.model(name);

    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "Không có file tải lên!" });
    }

    const fileData = req.files.file.data.toString("utf-8");

    let jsonData;
    try {
      jsonData = JSON.parse(fileData);
    } catch (err) {
      return res.status(400).json({ message: "File không hợp lệ! Không thể parse JSON." });
    }

    if (!Array.isArray(jsonData)) {
      return res.status(400).json({ message: "Dữ liệu không phải mảng!" });
    }

    if (clearBefore) {
      await model.deleteMany({});
    }

    await model.insertMany(jsonData);
    res.json({ message: `Import dữ liệu vào bảng ${name} thành công!` });
  } catch (err) {
    console.error("Import error:", err);
    res.status(500).json({ message: "Lỗi server khi import dữ liệu!" });
  }
});

// Import toàn bộ từ backup_all.json
router.post("/import-all", verifyToken, isAdmin, async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "Không có file tải lên!" });
    }

    const jsonData = JSON.parse(req.files.file.data.toString());

    // Duyệt tất cả các model và import dữ liệu tương ứng
    for (const [collectionName, data] of Object.entries(jsonData)) {
      const model = mongoose.model(collectionName);
      await model.deleteMany({}); // Xóa dữ liệu cũ (nếu có)
      await model.insertMany(data); // Thêm dữ liệu mới
    }

    res.json({ message: "Đã import toàn bộ dữ liệu thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi import toàn bộ dữ liệu!" });
  }
});

// ====================== XÓA DỮ LIỆU DẠY BÙ ======================

router.delete("/makeup-class/delete-all", verifyToken, isAdmin, async (req, res) => {
  try {
    await MakeupClass.deleteMany({});
    res.json({ message: "Đã xoá toàn bộ đăng ký dạy bù!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi xoá dữ liệu dạy bù!" });
  }
});

module.exports = router;
