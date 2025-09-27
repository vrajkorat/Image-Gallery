const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
const authRoutes = require('./routes/auth');
const imageRoutes = require('./routes/images');

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);

// serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongo connected');
    app.listen(PORT, () => console.log('Server started on', PORT));
  })
  .catch(err => console.error(err));