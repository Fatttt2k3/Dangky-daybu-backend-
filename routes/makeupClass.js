const express = require('express');
const router = express.Router();
const MakeupClass = require('../models/MakeupClass');
const { verifyToken ,isAdmin, isTeacherOrAdmin, authMiddleware, isTeacher} = require("../middlewares/authMiddleware");
const moment = require("moment");
const mongoose = require('mongoose');
const sendEmail = require("../routes/sendEmail");



// Đăng ký lịch dạy bù (Chỉ giáo viên đăng nhập mới có thể đăng ký)
router.post("/dangky-daybu", verifyToken, authMiddleware, async (req, res) => {
  try {
    const { songay, monhoc, tiethoc, buoihoc, lop, lido } = req.body;

    // Kiểm tra trùng lịch
    const existing = await MakeupClass.find({
      songay: new Date(songay),
      buoihoc,
      lop,
      tiethoc: { $in: tiethoc }, // chỉ cần trùng 1 tiết là báo trùng
    });

    if (existing.length > 0) {
      return res.status(403).json({
        message: "Lịch dạy bù bị trùng với giáo viên khác đã đăng ký!",
        conflicts: existing,
      });
    }

    // Tạo bản ghi mới
    const newMakeupClass = new MakeupClass({
      songay,
      monhoc,
      tiethoc,
      buoihoc,
      lop,
      lido,
      giaovien: req.user.ten,
      bomon: req.user.bomon,
      trangthai: "Cho duyet",
    });

    await newMakeupClass.save();

    // Gửi email cho giáo viên
    if (req.user.email) {
      const subjectTeacher = "Xác nhận đăng ký dạy bù";
      const htmlTeacher = `
        <p>Chào thầy/cô <b>${req.user.ten}</b>,</p>
        <p>Thầy/cô đã đăng ký lịch dạy bù với các thông tin sau:</p>
        <ul>
            <li><b>Ngày:</b> ${new Date(songay).toLocaleDateString("vi-VN")}</li>
            <li><b>Lớp:</b> ${lop}</li>
            <li><b>Môn:</b> ${monhoc}</li>
            <li><b>Buổi:</b> ${buoihoc}</li>
            <li><b>Tiết:</b> ${tiethoc.join(", ")}</li>
            <li><b>Lý do:</b> ${lido}</li>
        </ul>
        <p>Hệ thống đã ghi nhận yêu cầu của thầy/cô và đang chờ duyệt.</p>
        <p>Trân trọng,<br/>Hệ thống hỗ trợ dạy bù</p>
      `;
      await sendEmail(req.user.email, subjectTeacher, htmlTeacher);
    }

    // Gửi email cho admin
    const adminEmail = "tanphatvipnet@gmail.com";
    const subjectAdmin = "Yêu cầu đăng ký dạy bù mới";
    const htmlAdmin = `
      <p>Chào Admin,</p>
      <p>Có một giáo viên đã đăng ký yêu cầu dạy bù với các thông tin sau:</p>
      <ul>
          <li><b>Giáo viên:</b> ${req.user.ten}</li>
          <li><b>Ngày:</b> ${new Date(songay).toLocaleDateString("vi-VN")}</li>
          <li><b>Lớp:</b> ${lop}</li>
          <li><b>Môn:</b> ${monhoc}</li>
          <li><b>Buổi:</b> ${buoihoc}</li>
          <li><b>Tiết:</b> ${tiethoc.join(", ")}</li>
          <li><b>Lý do:</b> ${lido}</li>
      </ul>
      <p>Hãy kiểm tra và duyệt yêu cầu này.</p>
      <p>Trân trọng,<br/>Hệ thống hỗ trợ dạy bù</p>
    `;
    await sendEmail(adminEmail, subjectAdmin, htmlAdmin);

    res.status(201).json({
      message: "Đăng ký dạy bù thành công và thông báo đã gửi!",
      data: newMakeupClass,
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server khi đăng ký dạy bù!" });
  }
});
//lấy tất cả lịch dạy
router.get('/lichdaytatca', verifyToken, authMiddleware, async (req, res) => {
  try {
    // Optional: Giới hạn nếu bạn muốn chỉ cho admin
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Không có quyền truy cập." });
    // }

    const allSchedules = await MakeupClass.find({});
    res.json({ success: true, data: allSchedules });
  } catch (error) {
    console.error("Lỗi lấy toàn bộ lịch dạy bù:", error);
    res.status(500).json({ success: false, message: 'Lỗi server!' });
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
         // Nếu là admin, chỉ lấy lịch của họ
        if (req.user.role === 'admin') {
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
router.get('/lichdaygiaovien', verifyToken,authMiddleware, async (req, res) => {
  try {
      const filter = { giaovien: req.user.ten };

      const classes = await MakeupClass.find(filter);

      res.json({ success: true, data: classes });
  } catch (error) {
      console.error("Lỗi lấy danh sách dạy bù:", error);
      res.status(500).json({ success: false, message: 'Lỗi server!' });
  }
});



// Duyệt Dạy bù
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

      // 🔍 Tìm giáo viên theo tên để lấy email
      const giaovien = await require("../models/User").findOne({ ten: updated.giaovien });

      if (giaovien?.email) {
          // Soạn nội dung email
          const subject = trangthai === 'Dong y' ? 'Lịch dạy bù đã được duyệt' : 'Lịch dạy bù bị từ chối';
          const body = `
              <p>Chào thầy/cô <b>${giaovien.ten}</b>,</p>
              <p>Yêu cầu đăng ký dạy bù với thông tin sau đã được cập nhật:</p>
              <ul>
                  <li><b>Ngày:</b> ${new Date(updated.songay).toLocaleDateString("vi-VN")}</li>
                  <li><b>Lớp:</b> ${updated.lop}</li>
                  <li><b>Môn:</b> ${updated.monhoc}</li>
                  <li><b>Buổi:</b> ${updated.buoihoc}</li>
                  <li><b>Tiết:</b> ${updated.tiethoc.join(', ')}</li>
                  <li><b>Trạng thái:</b> <span style="color:${trangthai === 'Dong y' ? 'green' : 'red'}">${trangthai}</span></li>
              </ul>
              <p>${trangthai === 'Dong y' 
                  ? 'Vui lòng chuẩn bị bài giảng và lên lớp đúng giờ.' 
                  : 'Nếu có thắc mắc, vui lòng liên hệ quản trị viên: 0915393154'}
              </p>
              <p>Trân trọng,<br/>Hệ thống hỗ trợ  đăng ký dạy bù</p>
          `;

          // Gửi email
          await sendEmail(giaovien.email, subject, body);
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
  





// router.get("/requests", async (req, res) => {
//     try {
//         const requests = await MakeupClass.find({ status: "pending" });
//         res.json(requests);
//     } catch (error) {
//         res.status(500).json({ message: "Lỗi server" });
//     }
// });


//thời khoá biểu
// router.get("/thoikhoabieu", async (req, res) => {
//   try {
//     const today = new Date();

//     let nam = parseInt(req.query.nam); // Năm học đầu (VD: 2023 của 2023-2024)
//     const tuan = parseInt(req.query.tuan); // tuần từ 1 đến 35

//     if (!tuan || tuan < 1 || tuan > 35) {
//       return res.status(400).json({ success: false, message: "Thiếu hoặc sai tuần học" });
//     }

//     // Nếu không truyền năm thì tự tính dựa theo ngày hiện tại
//     if (!nam) {
//       const thang = today.getMonth() + 1; // getMonth từ 0
//       const ngay = today.getDate();
//       const namNow = today.getFullYear();

//       // Nếu hôm nay >= 5/9 => năm học bắt đầu là năm hiện tại
//       // Ngược lại => năm học bắt đầu từ năm trước
//       if (thang > 9 || (thang === 9 && ngay >= 5)) {
//         nam = namNow;
//       } else {
//         nam = namNow - 1;
//       }
//     }

//     const startDate = new Date(`${nam}-09-05T00:00:00.000Z`);
//     const weekStart = new Date(startDate);
//     weekStart.setDate(startDate.getDate() + (tuan - 1) * 7);

//     const weekEnd = new Date(weekStart);
//     weekEnd.setDate(weekStart.getDate() + 6);

//     const result = await MakeupClass.find({
//       songay: {
//         $gte: weekStart,
//         $lte: weekEnd
//       },
//       trangthai: "Dong y"
//     });

//     res.json({
//       success: true,
//       namhoc: `${nam}-${nam + 1}`,
//       tuan,
//       from: weekStart,
//       to: weekEnd,
//       data: result
//     });

//   } catch (error) {
//     console.error("Lỗi lọc tuần học:", error);
//     res.status(500).json({ success: false, message: "Lỗi server" });
//   }
// });




module.exports = router;
