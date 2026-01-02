"use client";
import React, { useState, useEffect, FormEvent } from 'react';

// --- STİLLER (Aynı kalıyor) ---
const containerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5', fontFamily: 'Arial, sans-serif' };
const authBoxStyle: React.CSSProperties = { background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '350px', textAlign: 'center' };
const inputStyle: React.CSSProperties = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '100%', marginBottom: '10px' };
const searchInputStyle: React.CSSProperties = { padding: '12px', borderRadius: '25px', border: '1px solid #ccc', width: '100%', marginBottom: '20px', fontSize: '16px', textIndent: '10px', outline: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' };
const primaryBtnStyle: React.CSSProperties = { padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: '100%' };
const linkStyle: React.CSSProperties = { color: '#0070f3', cursor: 'pointer', fontWeight: 'bold' };
const cardStyle: React.CSSProperties = { width: '300px', border: '1px solid #ddd', padding: '15px', borderRadius: '10px', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' };

export default function Home() {
  const [view, setView] = useState<'login' | 'register' | 'dashboard'>('login');
  
  const [listings, setListings] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', description: '', phone: '', location: '' });
  const [image, setImage] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- YENİ: SAYFA YÜKLENİRKEN OTURUM KONTROLÜ ---
  useEffect(() => {
    // Tarayıcı hafızasına bak: Kullanıcı giriş yapmış mı?
    const isLoggedIn = localStorage.getItem('findback_user');
    if (isLoggedIn === 'true') {
      setView('dashboard');
    }
  }, []);

  useEffect(() => {
    if (view === 'dashboard') {
      fetchListings();
    }
  }, [view]);

  const fetchListings = () => {
    fetch('http://localhost:5000/api/listings')
        .then((res) => res.json())
        .then((data) => setListings(data))
        .catch(err => console.error("Veri çekme hatası:", err));
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    // --- YENİ: GİRİŞ YAPINCA HAFIZAYA KAYDET ---
    localStorage.setItem('findback_user', 'true');
    setView('dashboard');
  };

  // --- YENİ: ÇIKIŞ YAPMA FONKSİYONU ---
  const handleLogout = () => {
    localStorage.removeItem('findback_user'); // Hafızayı temizle
    setView('login');
  };

  const handleListingSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('phone', form.phone); 
    formData.append('location', form.location);
    if (image) formData.append('image', image);

    try {
      const res = await fetch('http://localhost:5000/api/listings', {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) {
        alert("✅ İlan başarıyla eklendi!");
        setForm({ title: '', description: '', phone: '', location: '' });
        setImage(null);
        fetchListings(); 
      } else {
        alert("Hata oluştu.");
      }
    } catch (error) {
      console.error("Yükleme hatası:", error);
      alert("Sunucuya bağlanılamadı.");
    }
  };

  const filteredListings = listings.filter((item) => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- 1. GİRİŞ EKRANI ---
  if (view === 'login') {
    return (
      <div style={containerStyle}>
        <div style={authBoxStyle}>
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Giriş Yap</h1>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="E-posta" required style={inputStyle} />
            <input type="password" placeholder="Şifre" required style={inputStyle} />
            <button type="submit" style={primaryBtnStyle}>Giriş Yap</button>
          </form>
          <p style={{ marginTop: '15px', color: '#666' }}>
            Hesabın yok mu? <span onClick={() => setView('register')} style={linkStyle}>Kayıt Ol</span>
          </p>
        </div>
      </div>
    );
  }

  // --- 2. KAYIT EKRANI ---
  if (view === 'register') {
    return (
      <div style={containerStyle}>
        <div style={authBoxStyle}>
          <h1 style={{ color: '#333', marginBottom: '20px' }}>Kayıt Ol</h1>
          <form>
            <input type="text" placeholder="Ad Soyad" required style={inputStyle} />
            <input type="email" placeholder="E-posta" required style={inputStyle} />
            <input type="password" placeholder="Şifre" required style={inputStyle} />
            <button type="button" onClick={() => setView('login')} style={primaryBtnStyle}>Kayıt Ol</button>
          </form>
          <p style={{ marginTop: '15px', color: '#666' }}>
            Zaten üye misin? <span onClick={() => setView('login')} style={linkStyle}>Giriş Yap</span>
          </p>
        </div>
      </div>
    );
  }

  // --- 3. İLAN SAYFASI (DASHBOARD) ---
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <h1 style={{ color: '#0070f3' }}>🏠 FindBack Panel</h1>
        {/* --- YENİ: Logout butonu artık fonksiyon kullanıyor --- */}
        <button onClick={handleLogout} style={{...primaryBtnStyle, width: 'auto', background: '#d9534f'}}>Çıkış Yap</button>
      </div>

      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>Yeni İlan Ekle</h3>
        <form onSubmit={handleListingSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <input name="title" placeholder="İlan Başlığı" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} style={inputStyle} required />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <input name="phone" placeholder="Telefon (05XX...)" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} style={inputStyle} required />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <input name="location" placeholder="Konum" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} style={inputStyle} required />
          </div>
          <div style={{ flex: '1 1 100%' }}>
             <p style={{fontSize: '14px', marginBottom: '5px'}}>Resim Seç:</p>
             <input type="file" onChange={(e) => e.target.files && setImage(e.target.files[0])} style={{ marginBottom: '10px' }} />
          </div>
          <div style={{ flex: '1 1 100%' }}>
            <textarea name="description" placeholder="Açıklama" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} style={{...inputStyle, height: '80px'}} required />
          </div>
          <button type="submit" style={{...primaryBtnStyle, width: '200px'}}>İlanı Yayınla 🚀</button>
        </form>
      </div>

      <h3 style={{ marginBottom: '15px' }}>Güncel İlanlar</h3>

      <input 
        type="text" 
        placeholder="🔍 İlan Ara (Başlık veya Konum yazın...)" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchInputStyle}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {filteredListings.length === 0 ? (
           <p style={{color: '#888', fontStyle: 'italic'}}>Aradığınız kriterlere uygun ilan bulunamadı.</p>
        ) : (
          filteredListings.map((item: any) => (
          <div 
            key={item._id} 
            style={{ ...cardStyle, cursor: 'pointer', transition: 'transform 0.2s' }} 
            onClick={() => window.location.href = `/ilan/${item._id}`}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {item.image ? (
              <img src={`http://localhost:5000/${item.image}`} alt={item.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '5px', marginBottom: '10px' }} />
            ) : (
              <div style={{ width: '100%', height: '180px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '5px', marginBottom: '10px' }}>Resim Yok</div>
            )}
            
            <h4 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{item.title}</h4>
            <p style={{ color: '#0070f3', fontWeight: 'bold', fontSize: '16px', margin: '5px 0' }}>📞 {item.phone}</p>
            <p style={{ fontSize: '14px', color: '#555', margin: '5px 0' }}>📍 {item.location}</p>
            
            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              {item.description.length > 50 ? item.description.substring(0, 50) + '...' : item.description}
            </p>
          </div>
        )))}
      </div>
    </div>
  );
}