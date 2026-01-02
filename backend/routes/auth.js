const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Giriş Yapma Rotası
// DİKKAT: Buradaki 'image' kelimesi Frontend'deki ile aynı olmalı
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // 1. Gelen yazıları al
    const { title, description, location, date } = req.body;
    
    // 2. Resim yüklendiyse yolunu al, yüklenmediyse boş geç
    // Windows'ta ters slaş (\) sorunu olmasın diye replace yapıyoruz
    let imagePath = null;
    if (req.file) {
      imagePath = req.file.path.replace(/\\/g, "/");
    }

    // 3. Veritabanına kaydet (Senin Model ismin neyse onu kullan, genelde Listing veya Post)
    // NOT: Aşağıdaki 'Listing' kelimesi senin model isminle aynı olmalı!
    // Eğer dosyanın tepesinde "const Post = require..." varsa burayı "new Post" yap.
    const newListing = new Listing({
      title,
      description,
      location,
      date,
      image: imagePath // Resim yolunu veritabanına yazıyoruz
    });

    const savedListing = await newListing.save();
    res.json(savedListing);

  } catch (err) {
    console.error("Kayıt Hatası:", err);
    res.status(500).json({ message: "Sunucu hatası oluştu" });
  }
});

module.exports = router;