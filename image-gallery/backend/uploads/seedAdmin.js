// run with: node seedAdmin.js (after setting .env)
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const email = 'admin@example.com';
    let admin = await User.findOne({ email });
    if (admin) {
      console.log('Admin already exists');
      process.exit(0);
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt);

    admin = new User({ name: 'Admin', email, password: hash, role: 'admin' });
    await admin.save();
    console.log('Admin created: email=admin@example.com password=admin123');
    process.exit(0);
  })
  .catch(err => console.error(err));