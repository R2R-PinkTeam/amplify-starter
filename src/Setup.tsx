function Setup() {
  return (
    <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{
          color: '#FF69B4',
          fontSize: '3rem',
          margin: '0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          🌸 Project Setup 🌸
        </h1>
        <h2 style={{
          color: '#666',
          fontSize: '1.4rem',
          margin: '0.5rem 0',
          fontWeight: 'normal'
        }}>
          Get started with the Pink Team Competition
        </h2>
      </header>

      <section style={{
        background: 'rgba(255, 182, 193, 0.2)',
        padding: '2rem',
        borderRadius: '12px',
        borderLeft: '4px solid #FF69B4',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: '#FF1493', marginTop: 0 }}>Setup Instructions</h3>

        <ol style={{ lineHeight: '2', fontSize: '1.1rem' }}>
          <li>
            <strong>Clone the repository:</strong>
            <pre style={{
              background: '#2d2d2d',
              color: '#f8f8f2',
              padding: '15px',
              borderRadius: '8px',
              overflow: 'auto',
              marginTop: '10px'
            }}>
              <code>git clone git@github.com:R2R-PinkTeam/amplify-starter.git</code>
            </pre>
          </li>

          <li>
            <strong>Navigate to the project directory:</strong>
            <pre style={{
              background: '#2d2d2d',
              color: '#f8f8f2',
              padding: '15px',
              borderRadius: '8px',
              overflow: 'auto',
              marginTop: '10px'
            }}>
              <code>cd amplify-starter</code>
            </pre>
          </li>

          <li>
            <strong>Install dependencies:</strong>
            <pre style={{
              background: '#2d2d2d',
              color: '#f8f8f2',
              padding: '15px',
              borderRadius: '8px',
              overflow: 'auto',
              marginTop: '10px'
            }}>
              <code>npm install</code>
            </pre>
          </li>

          <li>
            <strong>Start the Amplify sandbox:</strong>
            <pre style={{
              background: '#2d2d2d',
              color: '#f8f8f2',
              padding: '15px',
              borderRadius: '8px',
              overflow: 'auto',
              marginTop: '10px'
            }}>
              <code>npx ampx sandbox</code>
            </pre>
          </li>
        </ol>
      </section>

      <section style={{
        background: 'rgba(255, 215, 0, 0.2)',
        padding: '2rem',
        borderRadius: '12px',
        borderLeft: '4px solid #FFD700',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: '#FF8C00', marginTop: 0 }}>What's Next?</h3>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          This setup guide will be updated as we learn more about the hackathon project requirements.
          Stay tuned for more details about what we'll be building!
        </p>
      </section>

      <footer style={{
        marginTop: '3rem',
        textAlign: 'center',
        color: '#666'
      }}>
        <a
          href="/"
          style={{
            color: '#FF1493',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}
        >
          ← Back to Home
        </a>
      </footer>
    </main>
  );
}

export default Setup;
