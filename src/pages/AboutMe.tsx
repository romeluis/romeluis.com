import '../global.css';

function AboutMe() {
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
      <h1>About Me</h1>
      <p>This is the About Me page. Content coming soon!</p>
    </div>
  );
}

export default AboutMe;
