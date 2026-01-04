import '../global.css';

function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: 'var(--spacing-2xl)',
      textAlign: 'center'
    }}>
      <h1>Site Under Construction</h1>
      <p>We're working hard to bring you something amazing. Check back soon!</p>
    </div>
  );
}

export default Home;
