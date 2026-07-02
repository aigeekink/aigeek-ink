'use client'

import { useState, useEffect } from 'react'

const STEPS = {
  LOADING:   'loading',    // checking sessionStorage
  READY:     'ready',      // composite loaded from tryon, ready to render
  RENDERING: 'rendering',
  RESULT:    'result',
  ERROR:     'error',
}

export default function RenderPage() {
  const [step, setStep] = useState(STEPS.LOADING)
  const [compositeUrl, setCompositeUrl] = useState(null)  // base64 or blob URL to display preview
  const [compositeBase64, setCompositeBase64] = useState(null)
  const [compositeW, setCompositeW] = useState(0)
  const [compositeH, setCompositeH] = useState(0)
  const [isColoured, setIsColoured] = useState(false)
  const [resultUrl, setResultUrl] = useState(null)
  const [error, setError] = useState(null)

  // On mount — read composite from sessionStorage (passed from /tryon)
  useEffect(() => {
    const composite = sessionStorage.getItem('aigeek_composite')
    const w = Number(sessionStorage.getItem('aigeek_composite_w') || 0)
    const h = Number(sessionStorage.getItem('aigeek_composite_h') || 0)
    const coloured = sessionStorage.getItem('aigeek_is_coloured') === '1'

    if (!composite) {
      // No composite passed — redirect back to tryon
      setError('No placement found. Please go back and place your tattoo first.')
      setStep(STEPS.ERROR)
      return
    }

    setCompositeBase64(composite)
    setCompositeUrl(composite)
    setCompositeW(w)
    setCompositeH(h)
    setIsColoured(coloured)
    setStep(STEPS.READY)
  }, [])

  const handleRender = async () => {
    if (!compositeBase64) return
    setStep(STEPS.RENDERING)
    setError(null)

    try {
      const response = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compositeImageBase64: compositeBase64,
          imageWidth: compositeW,
          imageHeight: compositeH,
          isColoured,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Render failed.')
      setResultUrl(data.resultUrl)
      setStep(STEPS.RESULT)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
      setStep(STEPS.ERROR)
    }
  }

  const handleAdjust = () => {
    // Go back to tryon — composite still in sessionStorage
    window.location.href = '/tryon'
  }

  const handleStartOver = () => {
    sessionStorage.removeItem('aigeek_composite')
    sessionStorage.removeItem('aigeek_composite_w')
    sessionStorage.removeItem('aigeek_composite_h')
    sessionStorage.removeItem('aigeek_is_coloured')
    window.location.href = '/tryon'
  }

  return (
    <main style={{ fontFamily: 'system-ui,-apple-system,sans-serif', maxWidth: '680px', margin: '0 auto', padding: '0 1rem' }}>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: '1px solid #f0f0f0' }}>
        <a href="/" style={{ fontWeight: '700', fontSize: '1.1rem', letterSpacing: '-0.02em', textDecoration: 'none', color: '#111' }}>aigeek.ink</a>
        <a href="/tryon" style={{ fontSize: '0.82rem', color: '#888', textDecoration: 'none' }}>← Try-on</a>
      </nav>

      <section style={{ padding: '1.25rem 0 1rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#111', marginBottom: '0.3rem', letterSpacing: '-0.02em' }}>AI Skin Render</h1>
        <p style={{ fontSize: '0.85rem', color: '#777', lineHeight: '1.6', margin: 0 }}>
          AI makes your tattoo look like real fresh ink on your skin.
        </p>
      </section>

      {/* LOADING */}
      {step === STEPS.LOADING && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #f0f0f0', borderTop: '3px solid #111', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {/* READY — show composite preview + render button */}
      {step === STEPS.READY && compositeUrl && (
        <>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e5e5', marginBottom: '1rem' }}>
            <img src={compositeUrl} alt="Your tattoo placement" style={{ width: '100%', display: 'block' }} />
          </div>

          <div style={{ background: '#f5f5f5', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#555', margin: 0 }}>
              ✓ Tattoo placed exactly as you set it. Click render to see it as real ink.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
            <button onClick={handleAdjust}
              style={{ flex: 0, padding: '0 16px', height: '50px', background: '#f5f5f5', color: '#555', border: '1px solid #e5e5e5', borderRadius: '10px', fontSize: '0.85rem', cursor: 'pointer' }}>
              ← Adjust
            </button>
            <button onClick={handleRender}
              style={{ flex: 1, height: '50px', background: '#111', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer' }}>
              ✦ Render on skin — $2.99
            </button>
          </div>
          <p style={{ fontSize: '0.72rem', color: '#bbb', textAlign: 'center', marginBottom: '2rem' }}>
            15–30 seconds. AI adds skin texture, ink depth, the real thing.
          </p>
        </>
      )}

      {/* RENDERING */}
      {step === STEPS.RENDERING && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid #f0f0f0', borderTop: '3px solid #111', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontWeight: '600', color: '#111', marginBottom: '0.5rem', fontSize: '1rem' }}>Rendering your tattoo...</p>
          <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: '1.6', maxWidth: '300px', margin: '0 auto' }}>
            AI is making your design look freshly inked. 15–30 seconds.
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {/* RESULT */}
      {step === STEPS.RESULT && resultUrl && (
        <>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #f0f0f0', marginBottom: '1rem' }}>
            <img src={resultUrl} alt="AI skin render result" style={{ width: '100%', display: 'block' }} />
          </div>
          <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem', textAlign: 'center' }}>
            <p style={{ fontWeight: '700', color: '#111', fontSize: '1rem', marginBottom: '0.4rem' }}>This could be on you. Permanently.</p>
            <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6', marginBottom: '1rem' }}>
              Download the printable stencil and Artist Handoff PDF to take to your artist.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={resultUrl} download="aigeek-skin-render.jpg"
                style={{ display: 'inline-block', background: '#111', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.88rem', fontWeight: '600' }}>
                ↓ Save result
              </a>
              <button onClick={handleAdjust}
                style={{ background: '#f5f5f5', color: '#555', border: '1px solid #e5e5e5', padding: '10px 20px', borderRadius: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                Adjust placement
              </button>
              <button onClick={handleStartOver}
                style={{ background: '#f5f5f5', color: '#555', border: '1px solid #e5e5e5', padding: '10px 20px', borderRadius: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                Start over
              </button>
            </div>
          </div>
          <div style={{ background: '#111', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#fff', fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.35rem' }}>Get the full pack</p>
            <p style={{ color: '#aaa', fontSize: '0.82rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              HD design · Printable stencil · Artist Handoff PDF.
            </p>
            <a href="/pricing" style={{ display: 'inline-block', background: '#fff', color: '#111', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.88rem', fontWeight: '700' }}>
              See pricing — from $2.99
            </a>
          </div>
        </>
      )}

      {/* ERROR */}
      {step === STEPS.ERROR && (
        <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>⚠️</p>
          <p style={{ fontWeight: '600', color: '#dc2626', marginBottom: '0.5rem' }}>
            {error?.includes('No placement') ? 'No tattoo placement found' : 'Render failed'}
          </p>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.25rem', lineHeight: '1.6' }}>{error}</p>
          <a href="/tryon"
            style={{ display: 'inline-block', background: '#111', color: '#fff', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
            ← Go back to Try-on
          </a>
        </div>
      )}

      <footer style={{ borderTop: '1px solid #f0f0f0', padding: '1.25rem 0 2rem' }}>
        <p style={{ fontSize: '0.72rem', color: '#ccc', textAlign: 'center' }}>© 2026 aigeek.ink</p>
      </footer>
    </main>
  )
}
