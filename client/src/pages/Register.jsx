import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("Kayıt Başarılı! Şimdi giriş yapabilirsiniz.");
      navigate('/login');
    } catch (err) {
      alert("Kayıt başarısız. Email kullanılıyor olabilir.");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-box">
        <h2>Kayıt Ol</h2>
        <form onSubmit={onSubmit}>
          <input type="text" placeholder="Kullanıcı Adı" onChange={(e) => setFormData({...formData, username: e.target.value})} required />
          <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Şifre" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <button type="submit" className="btn-submit">Kayıt Ol</button>
        </form>
      </div>
    </div>
  );
}