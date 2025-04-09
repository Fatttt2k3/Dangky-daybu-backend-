const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());


// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Import routes
const authRoutes = require('./routes/auth');
const makeupClassRoutes = require('./routes/makeupClass');
const systemRoutes = require("./routes/system");

app.use('/auth', authRoutes);
app.use('/makeup-class', makeupClassRoutes);
//system
app.use("/api/system", systemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

