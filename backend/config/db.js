const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/findback');
    console.log('✅ MongoDB Bağlandı...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// BU SATIR ÇOK ÖNEMLİ, FONKSİYONU DIŞARI AKTARIYOR:
module.exports = connectDB;