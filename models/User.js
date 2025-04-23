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
module.exports = mongoose.model("User", UserSchema);


    