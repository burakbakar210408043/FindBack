"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ListingDetail() {
  const { id } = useParams(); // URL'den ID'yi al
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/listings/${id}`)
        .then(res => res.json())
        .then(data => setListing(data))
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleDelete = async () => {
    if (confirm("Bu ilanı silmek istediğine emin misin?")) {
      await fetch(`http://localhost:5000/api/listings/${id}`, { method: 'DELETE' });
      alert("İlan silindi!");
      router.push('/'); // Anasayfaya dön
    }
  };

  if (!listing) return <div style={{padding: '50px', textAlign: 'center'}}>Yükleniyor...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <button onClick={() => router.push('/')} style={{ marginBottom: '20px', cursor: 'pointer', background: 'none', border: 'none', color: '#0070f3', fontSize: '16px' }}>← Geri Dön</button>
      
      <div style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        {listing.image ? (
          <img src={`http://localhost:5000/${listing.image}`} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
        ) : (
          <div style={{ height: '300px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Resim Yok</div>
        )}

        <div style={{ padding: '30px' }}>
          <h1 style={{ fontSize: '32px', color: '#333', marginBottom: '10px' }}>{listing.title}</h1>
          <p style={{ fontSize: '18px', color: '#555', marginBottom: '20px' }}>📍 {listing.location}</p>
          
          <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <p style={{ fontWeight: 'bold', color: '#0070f3', fontSize: '20px', margin: 0 }}>📞 {listing.phone}</p>
          </div>

          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Açıklama</h3>
          <p style={{ lineHeight: '1.6', color: '#444', fontSize: '16px' }}>{listing.description}</p>

          <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <button 
              onClick={handleDelete} 
              style={{ background: '#d9534f', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
            >
              🗑️ İlanı Kaldır
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}