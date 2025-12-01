import { useAuthenticator } from "@aws-amplify/ui-react";

function App() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  return (
    <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <span style={{ color: '#666', marginRight: '1rem', alignSelf: 'center' }}>
            {user?.signInDetails?.loginId}
          </span>
          <button
            onClick={signOut}
            style={{
              background: 'transparent',
              color: '#FF1493',
              border: '2px solid #FF69B4',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            Sign Out
          </button>
        </div>
        <h1 style={{
          color: '#FF69B4',
          fontSize: '3rem',
          margin: '0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          🎨 GumWall.ai
        </h1>
        <h2 style={{
          color: '#666',
          fontSize: '1.4rem',
          margin: '0.5rem 0',
          fontWeight: 'normal'
        }}>
          AI-Powered Gum Wall Planning Platform
        </h2>
      </header>

      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '2rem' }}>
          Upload wall photos, get AI analysis, and plan your gum wall masterpiece!
        </p>
        <div style={{
          background: 'rgba(255, 105, 180, 0.1)',
          padding: '2rem',
          borderRadius: '12px',
          border: '2px solid #FF69B4'
        }}>
          <h3 style={{ color: '#FF1493', marginBottom: '1rem' }}>Coming Soon</h3>
          <ul style={{ listStyle: 'none', padding: 0, color: '#666' }}>
            <li style={{ marginBottom: '0.5rem' }}>🎯 Site Selection Analysis (Gordon Ramsay personality)</li>
            <li style={{ marginBottom: '0.5rem' }}>📋 City Council Proposal Generator (HOA president personality)</li>
            <li style={{ marginBottom: '0.5rem' }}>📊 Progress Tracking (Gen-Z hype beast personality)</li>
            <li style={{ marginBottom: '0.5rem' }}>💬 Conversational AI Chat</li>
          </ul>
        </div>
      </div>

      <footer style={{
        marginTop: '4rem',
        textAlign: 'center',
        color: '#666',
        borderTop: '1px solid #FFB6C1',
        paddingTop: '2rem'
      }}>
        <div>
          🚀 GumWall.ai - Powered by AWS Amplify & Amazon Bedrock
          <br />
          <small>Built with Strands SDK, AgentCore Runtime, and Claude Sonnet 4</small>
        </div>
      </footer>
    </main>
  );
}

export default App;
