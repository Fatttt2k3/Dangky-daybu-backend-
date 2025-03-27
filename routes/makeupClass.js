const express = require('express');
const router = express.Router();
const MakeupClass = require('../models/MakeupClass');
const { verifyToken, isTeacher, isAdmin } = require("../middlewares/authMiddleware");

// Đăng ký dạy bù 
router.post("/dangky-daybu", verifyToken, isTeacher, async (req, res) => {
    try {
        const { sotuan, monhoc, tiethoc, buoihoc, lop, lido } = req.body;

        // Kiểm tra trùng lịch dạy bù
        const existingClass = await MakeupClass.findOne({
            sotuan,
            lop,
            buoihoc, // Kiểm tra buổi học
            tiethoc: { $in: tiethoc } // Kiểm tra tiết bị trùng
        });

        if (existingClass) {
            return res.status(400).json({ success: false, message: "Trùng lịch dạy, vui lòng chọn tiết khác!" });
        }

        // Tạo lịch dạy bù, tự động lấy tên giáo viên & bộ môn từ tài khoản đăng nhập
        const newMakeupClass = new MakeupClass({
            sotuan,
            monhoc,
            tiethoc,
            buoihoc,
            lop,
            lido,
            giaovien: req.user.ten,  // Lấy tên giáo viên từ tài khoản đăng nhập
            bomon: req.user.bomon,   // Lấy bộ môn từ tài khoản đăng nhập
            status: "pending"        // Mặc định trạng thái chờ duyệt
        });

        await newMakeupClass.save();
        res.json({ success: true, message: "Đăng ký dạy bù thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});



// Lấy danh sách lịch dạy bù (có phân quyền)
router.get('/danhsach-daybu', verifyToken, async (req, res) => {
    try {
        let filter = {};
        
        // Nếu là giáo viên, chỉ lấy lịch của họ
        if (req.user.role === 'teacher') {
            filter = { giaovien: req.user.ten };
        }

        // Lấy danh sách từ MongoDB
        const classes = await MakeupClass.find(filter);
        
        res.json({ success: true, data: classes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server!' });
    }
});


// Admin duyệt lịch dạy bù
router.put('/duyet-daybu/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;

        // Kiểm tra trạng thái hợp lệ
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ!' });
        }

        // Cập nhật trạng thái trong DB
        const updatedClass = await MakeupClass.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedClass) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy lịch dạy bù!' });
        }

        res.json({ success: true, message: `Lịch dạy bù đã ${status === 'approved' ? 'được duyệt' : 'bị từ chối'}!` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server!' });
    }
});




// Xoá đăng ký dạy bù theo ID

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra xem ID có đúng định dạng ObjectId không
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID không hợp lệ!' });
        }

        const deletedClass = await MakeupClass.findByIdAndDelete(id);

        if (!deletedClass) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu!' });
        }

        res.json({ success: true, message: 'Yêu cầu đã được xoá thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server!' });
    }
});

router.get("/chon-tuan", async (req, res) => {
    try {
        const { week } = req.query;
        if (!week) return res.status(400).json({ message: "Vui lòng chọn tuần" });

        const schedule = await MakeupClass.find({ sotuan: week, status: "approved" });
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
});

router.get("/", async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
});


router.get("/requests", async (req, res) => {
    try {
        const requests = await MakeupClass.find({ status: "pending" });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
});


router.put("/update/:id", async (req, res) => {
    try {
        const { status } = req.body;
        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ" });
        }

        const updatedClass = await MakeupClass.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedClass) {
            return res.status(404).json({ message: "Không tìm thấy yêu cầu" });
        }

        res.json({ message: "Cập nhật thành công", updatedClass });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
});


// router.delete("/delete/:id", async (req, res) => {
//     try {
//         const deletedClass = await MakeupClass.findByIdAndDelete(req.params.id);
//         if (!deletedClass) {
//             return res.status(404).json({ message: "Không tìm thấy lịch dạy bù" });
//         }

//         res.json({ message: "Xóa thành công" });
//     } catch (error) {
//         res.status(500).json({ message: "Lỗi server" });
//     }
// });


module.exports = router;
