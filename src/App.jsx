export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#18181b', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontSize: 32, marginBottom: 32 }}>App is working</h1>
      <div style={{ display: 'flex', gap: 40 }}>
        <div style={{ width: 220, height: 128, border: '3px solid #00fff7', borderRadius: 16, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
          Audio Container
        </div>
        <div style={{ width: 220, height: 128, border: '3px solid #ff00ea', borderRadius: 16, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
          Image Container
        </div>
      </div>
    </div>
  );
}
