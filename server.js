const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const dbRoutes = require("./routes/db");

dotenv.config();

const app = express();

// 👉 Thêm ở đây, ngay sau khi tạo app:
const fileUpload = require("express-fileupload");
app.use(fileUpload());

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/db", dbRoutes);

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  // thêm config nếu cần
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Import routes
const authRoutes = require('./routes/auth');
const makeupClassRoutes = require('./routes/makeupClass');
const systemRoutes = require("./routes/system");

app.use('/auth', authRoutes);
app.use('/makeup-class', makeupClassRoutes);
app.use("/api/system", systemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
