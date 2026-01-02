const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// --- AYARLAR ---
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- VERİTABANI BAĞLANTISI ---
mongoose.connect("mongodb://127.0.0.1:27017/findback")
  .then(() => console.log("✅✅✅ VERİTABANI BAĞLANDI! ✅✅✅"))
  .catch((err) => console.error("Veritabanı Hatası:", err));

// --- MODEL (GÜNCELLENDİ: Price yerine Phone geldi) ---
const ListingSchema = new mongoose.Schema({
  title: String,
  description: String,
  phone: String, // <--- ARTIK TELEFON NUMARASI TUTUYORUZ
  location: String,
  image: String,
});
const Listing = mongoose.model("Listing", ListingSchema);

// --- RESİM YÜKLEME ---
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage: storage });

// --- ROTALAR ---

// 1. İlan Ekle
app.post("/api/listings", upload.single("image"), async (req, res) => {
  try {
    // Price yerine phone alıyoruz
    const { title, description, phone, location } = req.body;
    const imagePath = req.file ? `uploads/${req.file.filename}` : "";
    
    const newListing = new Listing({ title, description, phone, location, image: imagePath });
    await newListing.save();
    console.log("📸 Yeni İlan (Tel no ile):", title);
    res.status(201).json(newListing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Hata" });
  }
});

// 2. İlanları Getir
app.get("/api/listings", async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Veri çekilemedi" });
  }
});
// --- YENİ EKLENEN KISIM: TEK İLAN GETİR ---
app.get('/api/listings/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "İlan bulunamadı" });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: "Hata oluştu" });
  }
});

// --- YENİ EKLENEN KISIM: İLAN SİL ---
app.delete('/api/listings/:id', async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: "İlan başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ error: "Silme hatası" });
  }
});
// --- BAŞLAT ---
app.listen(5000, () => console.log("🚀 Sunucu 5000 portunda çalışıyor..."));