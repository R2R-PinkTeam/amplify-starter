function Presentation() {
  // Use the static HTML presentation via iframe to avoid React re-rendering issues with Reveal.js
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <a
        href="/"
        style={{
          position: "fixed",
          top: "1em",
          left: "1em",
          zIndex: 1000,
          color: "#FF69B4",
          textDecoration: "none",
          fontSize: "0.9em",
          padding: "8px 16px",
          border: "2px solid #FF69B4",
          borderRadius: "6px",
          background: "rgba(0,0,0,0.7)",
        }}
      >
        ← Back to App
      </a>
      <iframe
        src="/presentations/pink-team-hackathon.html"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="Pink Team Hackathon Presentation"
      />
    </div>
  );
}

export default Presentation;
