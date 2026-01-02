const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// KAYIT OLMA (Register) ROTASI
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Bu email ile kayıtlı biri var mı?
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Bu email adresi zaten kullanılıyor.' });
    }

    // 2. Yeni kullanıcı oluştur
    user = new User({
      name,
      email,
      password
    });

    // 3. Şifreyi şifrele (Hash)
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4. Veritabanına kaydet
    await user.save();

    // 5. Giriş Token'ı oluştur
    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      "gizliAnahtarKelime",
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