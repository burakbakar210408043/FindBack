import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('user', JSON.stringify(res.data)); // Token'ı kaydet
      navigate('/listings'); // Başarılı olunca ilanlara git
    } catch (err) {
      alert("Giriş başarısız! Bilgileri kontrol edin.");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-box">
        <h2>Giriş Yap</h2>
        <form onSubmit={onSubmit}>
          <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Şifre" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <button type="submit" className="btn-submit">Giriş</button>
        </form>
      </div>
    </div>
  );
}