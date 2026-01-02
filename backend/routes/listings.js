const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Klasör Kontrolü ve Oluşturma
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// 2. Multer Ayarları (Resim Kayıt Yeri)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) 
  }
})

const upload = multer({ storage: storage });

// 3. İLAN EKLEME ROTASI (DÜZELTİLDİ)
// 'upload.single('image')' ekledik. Bu sayede resim içeri alınır.
router.post('/', upload.single('image'), async (req, res) => {
  
  // Terminale ne geldiğini yazalım
  console.log("------------------------------------------");
  console.log("Gelen Yazılar (Body):", req.body); 
  console.log("Gelen Dosya (File):", req.file); 
  console.log("------------------------------------------");

  try {
    const { title, description, price, location, date } = req.body;

    // Resim yolunu ayarla (Windows/Mac uyumlu olması için replace yapıyoruz)
    let imagePath = null;
    if (req.file) {
      imagePath = req.file.path.replace(/\\/g, "/");
    }

    // Veritabanı Kaydı
    const newListing = new Listing({
      title,
      description,
      price,
      location,
      date,
      image: imagePath, // <--- RESİM YOLUNU ARTIK KAYDEDİYORUZ
      user: null // Şimdilik test için null, sonra auth middleware eklersin
    });

    const listing = await newListing.save();
    res.json(listing);

  } catch (err) {
    console.error("KAYIT HATASI:", err.message);
    res.status(500).send('Sunucu Hatası: ' + err.message);
  }
});

// TÜM İLANLARI GETİRME ROTASI
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ date: -1 });
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

module.exports = router;