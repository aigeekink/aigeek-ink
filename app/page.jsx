export default function Home() {
  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '680px', margin: '0 auto', padding: '0 1.5rem' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: '1px solid #f0f0f0' }}>
        <span style={{ fontWeight: '600', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>aigeek.ink</span>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <a href="/pricing" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none' }}>Pricing</a>
          <a href="/generate" style={{ fontSize: '0.85rem', color: '#fff', background: '#111', padding: '6px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>Try it free</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '3.5rem 0 2.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontSize: '0.75rem', letterSpacing: '0.08em', color: '#666', background: '#f5f5f5', padding: '4px 14px', borderRadius: '999px', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
          AI Tattoo Planning Tool
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '700', lineHeight: '1.2', letterSpacing: '-0.03em', marginBottom: '1.25rem', color: '#111' }}>
          Design your next obsession.<br />
          <span style={{ fontStyle: 'italic', fontWeight: '400' }}>See it on your skin.</span><br />
          Walk in with your mind made up.
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#555', lineHeight: '1.7', maxWidth: '480px', margin: '0 auto 2rem' }}>
          Design your next obsession. See it on your skin. Walk in with your mind made up.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f5f5f5', borderRadius: '8px', padding: '8px 20px', marginBottom: '2rem' }}>
          <span style={{ fontSize: '1.3rem', fontWeight: '700', color: '#111' }}>$2.99</span>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>Pay once — generate, preview on skin, stencil, done</span>
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <a href="/generate" style={{
            display: 'inline-block', height: '48px', lineHeight: '48px',
            padding: '0 28px', fontSize: '1rem', fontWeight: '600',
            background: '#111', color: '#fff', borderRadius: '10px', textDecoration: 'none',
          }}>
            ✦ Try it free
          </a>
          <a href="/pricing" style={{
            display: 'inline-block', height: '48px', lineHeight: '48px',
            padding: '0 28px', fontSize: '1rem', color: '#555',
            background: '#f5f5f5', borderRadius: '10px', textDecoration: 'none',
            border: '1px solid #e5e5e5',
          }}>
            See pricing
          </a>
        </div>
        <p style={{ fontSize: '0.78rem', color: '#aaa' }}>Free to try — no card required · No subscription. Ever.</p>
      </section>

      {/* Hero image */}
      <section style={{ margin: '0 -1.5rem 0', position: 'relative' }}>
        <img
          src="/dragon-tattoo.png"
          alt="AI-generated tattoo design created with aigeek.ink"
          style={{ width: '100%', height: '420px', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }}
        />
        <div style={{
          position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '0.78rem',
          padding: '5px 14px', borderRadius: '999px', whiteSpace: 'nowrap',
          backdropFilter: 'blur(4px)',
        }}>
          ✦ AI-generated with aigeek.ink
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
          <strong style={{ color: '#333' }}>Your privacy, your call.</strong> Body photos are private by default — auto-deleted in 72 hours, never shared without your explicit permission. Your AI designs belong to you. Share them with the world only when you choose to.
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
        <p style={{ fontSize: '0.78rem', color: '#aaa', textAlign: 'center' }}>© 2026 aigeek.ink — design your next obsession</p>
      </footer>

    </main>
  )
}
