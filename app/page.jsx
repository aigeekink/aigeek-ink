export default function Home() {
  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '680px', margin: '0 auto', padding: '0 1.5rem' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: '1px solid #f0f0f0' }}>
        <span style={{ fontWeight: '600', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>aigeek.ink</span>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <a href="/pricing" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none' }}>Pricing</a>
          <span style={{ fontSize: '0.8rem', color: '#888', background: '#f5f5f5', padding: '4px 12px', borderRadius: '999px' }}>Coming soon</span>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '3.5rem 0 2.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontSize: '0.75rem', letterSpacing: '0.08em', color: '#666', background: '#f5f5f5', padding: '4px 14px', borderRadius: '999px', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
          AI Tattoo Planning Tool
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '700', lineHeight: '1.2', letterSpacing: '-0.03em', marginBottom: '1.25rem', color: '#111' }}>
          Generate your tattoo.<br />
          <span style={{ fontStyle: 'italic', fontWeight: '400' }}>See it on your skin.</span><br />
          Walk in prepared.
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#555', lineHeight: '1.7', maxWidth: '480px', margin: '0 auto 2rem' }}>
          Describe any tattoo, see it rendered on your actual skin, download a printable stencil to take to your artist. No subscription. No commitment.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f5f5f5', borderRadius: '8px', padding: '8px 20px', marginBottom: '2rem' }}>
          <span style={{ fontSize: '1.3rem', fontWeight: '700', color: '#111' }}>$1.99</span>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>once — generate, preview, stencil, done</span>
        </div>

        {/* Waitlist form */}
        <div style={{ display: 'flex', gap: '8px', maxWidth: '420px', margin: '0 auto' }}>
          <input
            type="email"
            placeholder="your@email.com"
            style={{ flex: 1, height: '44px', padding: '0 14px', fontSize: '0.95rem', border: '1px solid #ddd', borderRadius: '8px', outline: 'none' }}
          />
          <button
            style={{ height: '44px', padding: '0 22px', fontSize: '0.95rem', fontWeight: '600', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Join waitlist
          </button>
        </div>
        <p style={{ fontSize: '0.78rem', color: '#aaa', marginTop: '0.75rem' }}>Be first to know when we launch. No spam.</p>
      </section>

      {/* Hero image — AI generated tattoo showcase */}
      <section style={{ margin: '0 -1.5rem 0', position: 'relative' }}>
        <img
          src="/dragon-tattoo.png"
          alt="AI-generated cyberpunk dragon back tattoo — created with aigeek.ink"
          style={{
            width: '100%',
            height: '420px',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            display: 'block',
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.65)',
          color: '#fff',
          fontSize: '0.78rem',
          padding: '5px 14px',
          borderRadius: '999px',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(4px)',
        }}>
          ✦ AI-generated — cyberpunk dragon back piece
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '2.5rem 0', borderTop: '1px solid #f0f0f0' }}>
        <p style={{ fontSize: '0.72rem', letterSpacing: '0.1em', color: '#aaa', textTransform: 'uppercase', textAlign: 'center', marginBottom: '2rem' }}>How it works</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            { n: '1', title: 'Describe your tattoo', body: 'Type a prompt — style, placement, mood. The AI generates a tattoo-ready design in seconds.' },
            { n: '2', title: 'See it on your skin', body: 'Upload a photo of your arm, wrist, or shoulder. See your design rendered realistically on you.' },
            { n: '3', title: 'Take it to your artist', body: 'Download a printable stencil and Artist Handoff PDF. Walk in prepared, not guessing.' },
          ].map(({ n, title, body }) => (
            <div key={n} style={{ textAlign: 'center', padding: '1.5rem 1rem', border: '1px solid #f0f0f0', borderRadius: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '0.9rem', fontWeight: '600', color: '#333' }}>{n}</div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#111', marginBottom: '0.5rem' }}>{title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6' }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <section style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem', padding: '2rem 0', borderTop: '1px solid #f0f0f0' }}>
        {['No subscription', 'Pay once, own your design', 'Stencil-ready output', 'Artist Handoff PDF included'].map(item => (
          <span key={item} style={{ fontSize: '0.82rem', color: '#555', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#111', fontSize: '0.9rem' }}>✓</span> {item}
          </span>
        ))}
      </section>

      {/* Privacy */}
      <section style={{ background: '#fafafa', borderRadius: '12px', padding: '1.5rem', margin: '0 0 2rem', border: '1px solid #f0f0f0' }}>
        <p style={{ fontSize: '0.82rem', color: '#666', lineHeight: '1.7', textAlign: 'center', margin: 0 }}>
          <strong style={{ color: '#333' }}>Your privacy matters.</strong> Body photos are auto-deleted after 72 hours. We never sell or share your data. You can delete uploads anytime. We do not use your photos to train AI models.
        </p>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #f0f0f0', padding: '1.5rem 0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1rem' }}>
          <a href="/pricing" style={{ fontSize: '0.82rem', color: '#666', textDecoration: 'none' }}>Pricing</a>
          <a href="/terms" style={{ fontSize: '0.82rem', color: '#666', textDecoration: 'none' }}>Terms of Service</a>
          <a href="/privacy" style={{ fontSize: '0.82rem', color: '#666', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/refund" style={{ fontSize: '0.82rem', color: '#666', textDecoration: 'none' }}>Refund Policy</a>
        </div>
        <p style={{ fontSize: '0.78rem', color: '#aaa', textAlign: 'center' }}>© 2026 aigeek.ink — AI tattoo planning tool</p>
      </footer>

    </main>
  )
}
