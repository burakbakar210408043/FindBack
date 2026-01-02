import { Link } from 'react-router-dom';

export default function Home() {
  // NOT: Otomatik yönlendirmeyi kaldırdım. Artık herkes önce bu ekranı görecek.
  
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to right, #ece9e6, #ffffff)', // Hafif gri-beyaz geçiş
      textAlign: 'center',
      padding: '20px'
    }}>
      
      {/* BAŞLIK */}
      <h1 style={{ fontSize: '4rem', color: '#333', marginBottom: '10px' }}>
        FindBack
      </h1>

      {/* SLOGAN */}
      <p style={{ fontSize: '1.5rem', color: '#555', marginBottom: '40px', maxWidth: '600px' }}>
        Kayıp eşyalarınızı bildirmeniz yeterli, bulunur.
      </p>

      {/* BUTONLAR (Yan yana) */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/register">
          <button style={{
            padding: '15px 40px',
            fontSize: '1.2rem',
            background: '#2c3e50',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer'
          }}>
            Kayıt Ol
          </button>
        </Link>

        <Link to="/login">
          <button style={{
            padding: '15px 40px',
            fontSize: '1.2rem',
            background: 'transparent',
            color: '#2c3e50',
            border: '2px solid #2c3e50',
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Giriş Yap
          </button>
        </Link>
      </div>

    </div>
  );
}