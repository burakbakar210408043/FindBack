import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload(); // Menüyü sıfırlamak için
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 50px',
      backgroundColor: '#333',
      color: 'white'
    }}>
      {/* Sol Logo - Tıklayınca Ana Sayfaya atar */}
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>
        FindBack 📦
      </Link>

      {/* Sağ Linkler */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/listings" style={{ color: 'white', textDecoration: 'none' }}>İlanlar</Link>
            <Link to="/create" style={{ 
              background: '#e67e22', color: 'white', padding: '8px 15px', borderRadius: '5px', textDecoration: 'none' 
            }}>+ İlan Ver</Link>
            <button onClick={handleLogout} style={{ 
              background: '#c0392b', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' 
            }}>Çıkış</button>
          </>
        ) : (
          <>
             {/* Giriş yapmamışsa Navbar'da buton göstermeyelim, zaten Home sayfasında kocaman var */}
          </>
        )}
      </div>
    </nav>
  );
}