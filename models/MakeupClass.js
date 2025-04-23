

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

