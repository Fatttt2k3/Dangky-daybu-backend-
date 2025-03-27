const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { string } = require("prop-types");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "teacher"], default: "teacher" }, // Admin hoặc giáo viên
    ten: { type: String, required: true }, // Tên giáo viên
    ngaysinh:{ type: String , require:true  },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    bomon: { type: String, required: true } // Bộ môn
    
});

// Trước khi lưu user, mã hóa mật khẩu
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model("User", UserSchema);
    