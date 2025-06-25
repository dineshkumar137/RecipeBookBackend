const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const createdRoutes = require('./routes/created');
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use('/api', createdRoutes);
app.use('/api', authRoutes);


// mongoose.connect('mongodb://localhost:27017/recipebook', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log('MongoDB connected');
// }).catch((err) => {
//   console.error('MongoDB error:', err);
// });

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
