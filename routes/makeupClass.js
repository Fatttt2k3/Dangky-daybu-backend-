const express = require('express');
const router = express.Router();
const MakeupClass = require('../models/MakeupClass');
const { verifyToken ,isAdmin, isTeacherOrAdmin, authMiddleware, isTeacher} = require("../middlewares/authMiddleware");
const moment = require("moment");
const mongoose = require('mongoose');



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


  //thời khoá Biểu
  router.get("/thoikhoabieu1",verifyToken, isTeacherOrAdmin, async (req, res) => {
    const { from, to, giaovien, lop, monhoc } = req.query;
  
    if (!from || !to) {
      return res.status(400).json({ success: false, message: "Thiếu ngày bắt đầu hoặc kết thúc" });
    }
  
    try {
      const filter = {
        trangthai: "Dong y",
        songay: {
          $gte: new Date(from),
          $lte: new Date(to),
        },
      };
  
      if (giaovien) filter.giaovien = giaovien;
      if (lop) filter.lop = lop;
      if (monhoc) filter.monhoc = monhoc;
  
      const data = await MakeupClass.find(filter);
      res.json({ success: true, data });
    } catch (err) {
      console.error("Lỗi khi truy vấn:", err);
      res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
  });


// Lấy danh sách lịch dạy bù (có phân quyền)
router.get('/danhsach-daybu',verifyToken,authMiddleware,async (req, res) => {
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

// Lấy danh sách lịch dạy bù (chỉ giáo viên đang đăng nhập xem được lịch của mình)
router.get('/lichdaygiaovien', verifyToken, isTeacher, async (req, res) => {
  try {
      const filter = { giaovien: req.user.ten };

      const classes = await MakeupClass.find(filter);

      res.json({ success: true, data: classes });
  } catch (error) {
      console.error("Lỗi lấy danh sách dạy bù:", error);
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
router.delete('/xoa/:id', verifyToken, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
  
      //  Kiểm tra ID hợp lệ
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'ID không hợp lệ!' });
      }
  
      // Tìm và xoá bản ghi
      const deletedClass = await MakeupClass.findByIdAndDelete(id);
  
      if (!deletedClass) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu!' });
      }
  
      res.json({ success: true, message: 'Yêu cầu đã được xoá thành công!' });
    } catch (error) {
      console.error('Lỗi xoá yêu cầu:', error);
      res.status(500).json({ success: false, message: 'Lỗi server!' });
    }
  });
// router.delete('/xoa/:id', verifyToken, isAdmin, async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Kiểm tra xem ID có đúng định dạng ObjectId không
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ success: false, message: 'ID không hợp lệ!' });
//         }

//         const deletedClass = await MakeupClass.findByIdAndDelete(id);

//         if (!deletedClass) {
//             return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu!' });
//         }

//         res.json({ success: true, message: 'Yêu cầu đã được xoá thành công!' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Lỗi server!' });
//     }
// });

// router.get("/chon-tuan", async (req, res) => {
//     try {
//         const { week } = req.query;
//         if (!week) return res.status(400).json({ message: "Vui lòng chọn tuần" });

//         const schedule = await MakeupClass.find({ sotuan: week, status: "approved" });
//         res.json(schedule);
//     } catch (error) {
//         res.status(500).json({ message: "Lỗi server" });
//     }
// });

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


//thời khoá biểu
router.get("/thoikhoabieu", async (req, res) => {
  try {
    const today = new Date();

    let nam = parseInt(req.query.nam); // Năm học đầu (VD: 2023 của 2023-2024)
    const tuan = parseInt(req.query.tuan); // tuần từ 1 đến 35

    if (!tuan || tuan < 1 || tuan > 35) {
      return res.status(400).json({ success: false, message: "Thiếu hoặc sai tuần học" });
    }

    // Nếu không truyền năm thì tự tính dựa theo ngày hiện tại
    if (!nam) {
      const thang = today.getMonth() + 1; // getMonth từ 0
      const ngay = today.getDate();
      const namNow = today.getFullYear();

      // Nếu hôm nay >= 5/9 => năm học bắt đầu là năm hiện tại
      // Ngược lại => năm học bắt đầu từ năm trước
      if (thang > 9 || (thang === 9 && ngay >= 5)) {
        nam = namNow;
      } else {
        nam = namNow - 1;
      }
    }

    const startDate = new Date(`${nam}-09-05T00:00:00.000Z`);
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + (tuan - 1) * 7);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const result = await MakeupClass.find({
      songay: {
        $gte: weekStart,
        $lte: weekEnd
      },
      trangthai: "Dong y"
    });

    res.json({
      success: true,
      namhoc: `${nam}-${nam + 1}`,
      tuan,
      from: weekStart,
      to: weekEnd,
      data: result
    });

  } catch (error) {
    console.error("Lỗi lọc tuần học:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
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