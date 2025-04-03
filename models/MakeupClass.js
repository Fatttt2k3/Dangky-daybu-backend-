// const mongoose = require('mongoose');

// const MakeupClassSchema = new mongoose.Schema({
//     sotuan: { type: Number, required: true, min: 1, max: 35 },
//     monhoc: { type: String, required: true },
//     tiethoc: { type: [Number], required: true }, // Mảng chứa các tiết học
//     buoihoc: { type: String, required: true },
//     lop: { type: String, required: true },
//     lido: { type: String, required: true },
//     giaovien: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Liên kết với giáo viên
//     trangthai: { type: String, enum: ['Chờ duyệt', 'Đã duyệt', 'Bị từ chối'], default: 'Chờ duyệt' } // Trạng thái duyệt
// });

// module.exports = mongoose.model('MakeupClass', MakeupClassSchema);



const mongoose = require('mongoose');

const MakeupClassSchema = new mongoose.Schema({
    songay: { type: String, required: true },
    monhoc: { type: String, required: true },
    tiethoc: { type: [Number], required: true }, // Mảng chứa các tiết học
    buoihoc: { type: String, required: true },
    lop: { type: String, required: true },
    giaovien: { type: String, required: true },  // <-- Thêm giáo viên vào schema
    bomon: { type: String, required: true },     // <-- Thêm bộ môn vào schema
    lido: { type: String, required: true },
    trangthai: { type: String, enum: ['Cho duyet', 'Dong y', 'Tu choi'], default: 'Cho duyet' }
});

module.exports = mongoose.model('MakeupClass', MakeupClassSchema);

// const MakeupClassSchema = new mongoose.Schema({
//     weekNumber: { type: Number, required: true, min: 1, max: 35 },
//     subject: { type: String, required: true },
//     lesson: { type: [Number], required: true, min:1 , max:5 }, // Mảng chứa các tiết học
    
//     teacherName: { type: String, required: true },
//     department: { type: String, required: true },
//     className: { type: String, required: true },
//     lido: {type: String, require: true },
//     status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
// });
