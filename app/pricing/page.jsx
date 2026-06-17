export const metadata = {
  title: 'Pricing — aigeek.ink',
  description: 'Simple, one-time pricing. No subscription. Generate your tattoo design, see it on your skin, take a stencil to your artist.',
}

export default function Pricing() {
  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '680px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <a href="/" style={{ fontSize: '0.9rem', color: '#555', textDecoration: 'none' }}>← aigeek.ink</a>
      </nav>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111', marginBottom: '0.75rem' }}>Simple, honest pricing</h1>
        <p style={{ fontSize: '1.05rem', color: '#555', lineHeight: '1.7' }}>No subscription. No auto-renewal. Pay once when you need it, own your design forever.</p>
      </div>

      {/* Free tier */}
      <div style={{ border: '1px solid #e5e5e5', borderRadius: '12px', padding: '2rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#111', marginBottom: '0.25rem' }}>Free</h2>
            <p style={{ fontSize: '0.85rem', color: '#888' }}>Try before you commit</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '2rem', fontWeight: '700', color: '#111' }}>$0</span>
          </div>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            '3 watermarked designs per day',
            'Canvas preview — drag your design onto your photo',
            'See roughly how it looks — free, instant',
            'No sign-up required to start',
          ].map(item => (
            <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '6px 0', fontSize: '0.92rem', color: '#444' }}>
              <span style={{ color: '#888', marginTop: '2px' }}>○</span> {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Starter Pack */}
      <div style={{ border: '2px solid #111', borderRadius: '12px', padding: '2rem', marginBottom: '1rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-12px', left: '1.5rem', background: '#111', color: '#fff', fontSize: '0.72rem', fontWeight: '600', padding: '3px 12px', borderRadius: '999px', letterSpacing: '0.05em' }}>MOST POPULAR</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#111', marginBottom: '0.25rem' }}>Starter Pack</h2>
            <p style={{ fontSize: '0.85rem', color: '#888' }}>Everything you need for one tattoo</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '2rem', fontWeight: '700', color: '#111' }}>$1.99</span>
            <p style={{ fontSize: '0.78rem', color: '#888', marginTop: '2px' }}>one-time</p>
          </div>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            '1 HD design — no watermark',
            '1 AI skin render — see it realistically on your skin',
            '1 printable stencil — ready for your artist\'s thermal printer',
            '1 Artist Handoff PDF — everything your artist needs in one document',
            'Yours to keep forever',
          ].map(item => (
            <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '6px 0', fontSize: '0.92rem', color: '#333' }}>
              <span style={{ color: '#111', marginTop: '2px', fontWeight: '600' }}>✓</span> {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Geek Pack */}
      <div style={{ border: '1px solid #e5e5e5', borderRadius: '12px', padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#111', marginBottom: '0.25rem' }}>Geek Pack</h2>
            <p style={{ fontSize: '0.85rem', color: '#888' }}>Explore multiple concepts — best value</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '2rem', fontWeight: '700', color: '#111' }}>$4.99</span>
            <p style={{ fontSize: '0.78rem', color: '#888', marginTop: '2px' }}>one-time</p>
          </div>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            '5 HD designs — explore different styles',
            '5 AI skin renders',
            '5 printable stencils',
            '5 Artist Handoff PDFs',
            'Priority entry in Tattoo of the Month contest',
            'Best value — saves vs 5 individual packs',
          ].map(item => (
            <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '6px 0', fontSize: '0.92rem', color: '#444' }}>
              <span style={{ color: '#111', marginTop: '2px', fontWeight: '600' }}>✓</span> {item}
            </li>
          ))}
        </ul>
      </div>

      {/* FAQ */}
      <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111', marginBottom: '1.5rem' }}>Common questions</h2>
        {[
          { q: 'Is this really no subscription?', a: 'Yes. You pay once, you get your designs, you\'re done. We will never auto-renew or charge you again without your explicit action.' },
          { q: 'What is the Artist Handoff PDF?', a: 'A branded one-page document containing your final design, your skin preview, a stencil-ready version, suggested placement, size guide, and a note for your artist explaining it\'s an AI planning reference. No other tool in this space has this.' },
          { q: 'What if the AI render fails?', a: 'We automatically retry once. If the second attempt also fails, you get a full credit refund automatically. No need to contact us.' },
          { q: 'Do you store my body photos?', a: 'Photos are stored in a private, access-controlled environment and automatically deleted after 72 hours. You can also delete them manually anytime. We never use your photos to train AI models.' },
          { q: 'Can I use the designs commercially?', a: 'Starter and Geek Pack designs are for personal tattoo planning use. Commercial licensing is not included in current pricing.' },
        ].map(({ q, a }) => (
          <div key={q} style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f5f5f5' }}>
            <p style={{ fontWeight: '600', color: '#111', marginBottom: '0.4rem', fontSize: '0.95rem' }}>{q}</p>
            <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.7' }}>{a}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', padding: '1.5rem', background: '#fafafa', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
        <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.7' }}>
          Questions? Email <a href="mailto:aigeek.ink@gmail.com" style={{ color: '#111' }}>aigeek.ink@gmail.com</a>
        </p>
      </div>
    </main>
  )
}
