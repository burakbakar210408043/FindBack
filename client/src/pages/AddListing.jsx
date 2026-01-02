import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddListing() {
  const [formData, setFormData] = useState({ title: '', description: '', location: '', date: '' });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // Sayfa açılınca: Giriş yapılmamışsa login sayfasına at
  useEffect(() => {
    const userCheck = localStorage.getItem('user');
    if (!userCheck) {
      alert("Lütfen önce giriş yapın.");
      navigate('/login');
    }
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();

    // 1. TOKEN GÜVENLİĞİ: Kullanıcı bilgisini güvenli şekilde alalım
    const userString = localStorage.getItem('user');
    if (!userString) {
        alert("Oturum süreniz dolmuş, lütfen tekrar giriş yapın.");
        return navigate('/login');
    }
    const user = JSON.parse(userString);

    // 2. FormData Hazırlama (Resim göndermek için şart)
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("location", formData.location);
    data.append("date", formData.date);
    
    // Eğer resim seçildiyse pakete ekle
    if (file) {
        data.append("image", file); 
    }

    try {
      // 3. Sunucuya Gönder
      // NOT: 'Content-Type' yazmıyoruz, axios hallediyor.
      await axios.post('http://localhost:5000/api/listings', data, {
        headers: { 
            "x-auth-token": user.token // Token'ı header'a ekledik
        }
      });

      alert("İlan Başarıyla Yayınlandı! 🎉");
      
      // DÜZELTME BURADA: Artık seni 'İlanlar' sayfasına atacak
      navigate('/listings'); 

    } catch (err) {
      console.error("Yükleme Hatası:", err);
      // Hata detayını gösterelim
      const errorMessage = err.response?.data?.message || err.message;
      alert("Hata oluştu: " + errorMessage);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '30px', background: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Yeni İlan Oluştur</h2>
      
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Başlık (Örn: Cüzdanım Kayıp)" 
           onChange={(e) => setFormData({...formData, title: e.target.value})} 
           style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required />
        
        <textarea placeholder="Açıklama" rows="4"
           onChange={(e) => setFormData({...formData, description: e.target.value})} 
           style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} required />
           
        <input type="text" placeholder="Konum" 
           onChange={(e) => setFormData({...formData, location: e.target.value})} 
           style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} />
           
        <input type="date" 
           onChange={(e) => setFormData({...formData, date: e.target.value})} 
           style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} />
           
        {/* GALERİDEN FOTOĞRAF SEÇME */}
        <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Fotoğraf Ekle:</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <button type="submit" style={{ padding: '12px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}>
            İlanı Yayınla
        </button>
      </form>
    </div>
  );
}