const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Giriş Yapma Rotası
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Kullanıcı var mı?
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Kullanıcı bulunamadı!' });
    }

    // 2. Şifre doğru mu?
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Şifre hatalı!' });
    }

    // 3. Token oluştur (Basit ve garantili yöntem)
    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      "gizliAnahtarKelime", // Burayı basitleştirdik
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

module.exports = router;