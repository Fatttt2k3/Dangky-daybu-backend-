const express = require('express');
const router = express.Router();
const MakeupClass = require('../models/MakeupClass');
const { verifyToken ,isAdmin, isTeacherOrAdmin, authMiddleware} = require("../middlewares/authMiddleware");

// Đăng ký lịch dạy bù (Chỉ giáo viên đăng nhập mới có thể đăng ký)
router.post("/dangky-daybu", verifyToken, authMiddleware, async (req, res) => {
    try {
        const { songay, monhoc, tiethoc, buoihoc, lop, lido } = req.body;

        const newMakeupClass = new MakeupClass({
            songay,
            monhoc,
            tiethoc,
            buoihoc,
            lop,
            lido,
            giaovien: req.user.ten,  // Lấy từ người dùng đăng nhập
            bomon: req.user.bomon,   // Lấy từ người dùng đăng nhập
            trangthai: "Cho duyet"
        });

        await newMakeupClass.save();
        res.status(201).json({ message: "Đăng ký dạy bù thành công!", data: newMakeupClass });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





// Lấy danh sách lịch dạy bù (có phân quyền)
router.get('/danhsach-daybu', verifyToken,isTeacherOrAdmin, async (req, res) => {
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


// PUT /makeup-class/duyet-daybu/:id
router.put('/duyet-daybu/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { trangthai } = req.body;

        if (!['Dong y', 'Tu choi'].includes(trangthai)) {
            return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ!' });
        }

        const updated = await MakeupClass.findByIdAndUpdate(
            req.params.id,
            { trangthai },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy lịch dạy bù!' });
        }

        res.json({ success: true, message: `Lịch đã được cập nhật trạng thái: ${trangthai}` });
    } catch (err) {
        console.error(err);
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


// router.put("/update/:id", async (req, res) => {
//     try {
//         const { status } = req.body;
//         if (!["approved", "rejected"].includes(status)) {
//             return res.status(400).json({ message: "Trạng thái không hợp lệ" });
//         }

//         const updatedClass = await MakeupClass.findByIdAndUpdate(
//             req.params.id,
//             { status },
//             { new: true }
//         );

//         if (!updatedClass) {
//             return res.status(404).json({ message: "Không tìm thấy yêu cầu" });
//         }

//         res.json({ message: "Cập nhật thành công", updatedClass });
//     } catch (error) {
//         res.status(500).json({ message: "Lỗi server" });
//     }
// });


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