const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true // Başlık olmak zorunda
  },
  description: {
    type: String,
    required: true // Açıklama olmak zorunda
  },
  price: { 
    type: Number, // <--- BUNU EKLEDİM (Route dosyasında kullanıyorsun)
    default: 0
  },
  location: {
    type: String
  },
  date: {
    type: String // Tarih bazen string gelir, hata almamak için String yaptım
  },
  image: {
    type: String // Resim yolu (uploads/resim.jpg gibi)
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: false // Hata almamak için şimdilik zorunlu değil yapalım
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('listing', ListingSchema);