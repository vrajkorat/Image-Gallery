const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Image = require('../models/Image');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// multer config
const storage = multer.diskStorage({
  destination: function(req, file, cb) { cb(null, uploadDir); },
  filename: function(req, file, cb) { cb(null, Date.now() + '-' + file.originalname); }
});
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) cb(null, true);
  else cb(new Error('Only image files allowed'));
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// upload by authenticated user
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });
    const caption = req.body.caption || '';
    const img = new Image({
      filename: req.file.filename,
      caption,
      uploaderId: req.user.id,
      uploaderName: req.user.name,
      uploaderEmail: req.user.email
    });
    await img.save();
    res.json({ msg: 'Uploaded: awaiting admin approval', image: img });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// public gallery: only approved images
router.get('/public', async (req, res) => {
  try {
    const images = await Image.find({ approved: true }).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// admin: list pending
router.get('/pending', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });
    const pending = await Image.find({ approved: false }).sort({ createdAt: -1 });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// admin: approve
router.post('/:id/approve', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });
    const img = await Image.findById(req.params.id);
    if (!img) return res.status(404).json({ msg: 'Not found' });
    img.approved = true;
    await img.save();
    res.json({ msg: 'Image approved', img });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// admin: delete (remove file + db doc)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });
    const img = await Image.findById(req.params.id);
    if (!img) return res.status(404).json({ msg: 'Not found' });
    const filepath = path.join(uploadDir, img.filename);
    fs.unlink(filepath, err => { if (err) console.warn('file delete error', err); });
    await img.remove();
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;