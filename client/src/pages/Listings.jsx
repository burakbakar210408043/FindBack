import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/listings');
        setListings(res.data);
      } catch (err) {
        console.error("Hata:", err);
      }
    };
    fetchListings();
  }, []);

  // Filtreleme Fonksiyonu
  const filtered = listings.filter(item => 
    (item.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.location || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div style={{ padding: '40px' }}>
      
      {/* Üst Kısım: Başlık ve Arama */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>📋 Kayıp & Buluntu İlanları</h2>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Anahtar, Cüzdan, İstanbul..." 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <Link to="/create">
            <button style={{ padding: '10px 20px', background: '#2980b9', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              + İLAN VER
            </button>
          </Link>
        </div>
      </div>

      {/* İlan Kartları Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filtered.length > 0 ? filtered.map((item) => (
          <div key={item._id} style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            
            {/* Varsa Resmi Göster */}
            {item.image ? (
               <img src={`http://localhost:5000/${item.image}`} alt="ilan" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            ) : (
               <div style={{ width: '100%', height: '200px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>Resim Yok</div>
            )}

            <div style={{ padding: '15px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{item.title}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>{item.description}</p>
              
              <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                <span>📍 {item.location}</span>
                <span>📅 {new Date(item.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )) : <p>Aradığınız kriterde ilan yok.</p>}
      </div>
    </div>
  );
}