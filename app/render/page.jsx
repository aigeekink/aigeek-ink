'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const STEPS = {
  UPLOAD_PHOTO: 'upload_photo',
  CLICK_TO_PLACE: 'click_to_place',
  ADJUST_SIZE: 'adjust_size',
  RENDERING: 'rendering',
  RESULT: 'result',
  ERROR: 'error',
}

export default function RenderPage() {
  const [step, setStep] = useState(STEPS.UPLOAD_PHOTO)
  const [bodyPhoto, setBodyPhoto] = useState(null)
  const [bodyPhotoUrl, setBodyPhotoUrl] = useState(null)
  const [tattooBase64, setTattooBase64] = useState(null)
  const [tattooLoaded, setTattooLoaded] = useState(false)
  const [clickPos, setClickPos] = useState(null)
  const [maskRadius, setMaskRadius] = useState(80)
  const [resultUrl, setResultUrl] = useState(null)
  const [error, setError] = useState(null)
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 })
  const [style, setStyle] = useState('blackwork')

  const photoImgRef = useRef(null)
  const overlayCanvasRef = useRef(null)

  const drawOverlay = useCallback(() => {
    const canvas = overlayCanvasRef.current
    const img = photoImgRef.current
    if (!canvas || !img || !clickPos) return

    const rect = img.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    const scaleX = rect.width / imageNaturalSize.width
    const scaleY = rect.height / imageNaturalSize.height

    const displayX = clickPos.x * scaleX
    const displayY = clickPos.y * scaleY
    const displayRadius = maskRadius * Math.min(scaleX, scaleY)

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Darken outside the circle
    ctx.fillStyle = 'rgba(0,0,0,0.45)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Cut out circle to show original
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(displayX, displayY, displayRadius, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'

    // Dashed circle border
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 4])
    ctx.beginPath()
    ctx.arc(displayX, displayY, displayRadius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    // Crosshair
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(displayX - 8, displayY)
    ctx.lineTo(displayX + 8, displayY)
    ctx.moveTo(displayX, displayY - 8)
    ctx.lineTo(displayX, displayY + 8)
    ctx.stroke()
  }, [clickPos, maskRadius, imageNaturalSize])

  useEffect(() => {
    drawOverlay()
  }, [drawOverlay])

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setBodyPhotoUrl(url)
    const reader = new FileReader()
    reader.onload = (ev) => setBodyPhoto(ev.target.result)
    reader.readAsDataURL(file)
    setStep(STEPS.CLICK_TO_PLACE)
  }

  const handleTattooUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setTattooBase64(ev.target.result)
      setTattooLoaded(true)
    }
    reader.readAsDataURL(file)
  }

  const handlePhotoClick = (e) => {
    if (step !== STEPS.CLICK_TO_PLACE && step !== STEPS.ADJUST_SIZE) return
    const img = photoImgRef.current
    if (!img) return

    const rect = img.getBoundingClientRect()
    const scaleX = imageNaturalSize.width / rect.width
    const scaleY = imageNaturalSize.height / rect.height

    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    setClickPos({ x, y })
    setStep(STEPS.ADJUST_SIZE)
  }

  const handleImageLoad = () => {
    const img = photoImgRef.current
    if (img) setImageNaturalSize({ width: img.naturalWidth, height: img.naturalHeight })
  }

  const handleRender = async () => {
    if (!bodyPhoto || !clickPos || !tattooBase64) return
    setStep(STEPS.RENDERING)
    setError(null)

    try {
      const response = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bodyImageBase64: bodyPhoto,
          tattooImageBase64: tattooBase64,
          clickX: clickPos.x,
          clickY: clickPos.y,
          maskRadius: maskRadius,
          imageWidth: imageNaturalSize.width,
          imageHeight: imageNaturalSize.height,
          style,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Render failed.')

      setResultUrl(data.resultUrl)
      setStep(STEPS.RESULT)

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setStep(STEPS.ERROR)
    }
  }

  const handleTryAgain = () => {
    setStep(STEPS.CLICK_TO_PLACE)
    setClickPos(null)
    setResultUrl(null)
    setError(null)
  }

  const handleStartOver = () => {
    setStep(STEPS.UPLOAD_PHOTO)
    setBodyPhoto(null)
    setBodyPhotoUrl(null)
    setClickPos(null)
    setResultUrl(null)
    setError(null)
    setTattooBase64(null)
    setTattooLoaded(false)
  }

  const renderButtonEnabled = step === STEPS.ADJUST_SIZE && clickPos && tattooLoaded

  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '680px', margin: '0 auto', padding: '0 1rem' }}>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: '1px solid #f0f0f0' }}>
        <a href="/" style={{ fontWeight: '600', fontSize: '1.1rem', letterSpacing: '-0.02em', textDecoration: 'none', color: '#111' }}>aigeek.ink</a>
        <a href="/generate" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none' }}>← Generator</a>
      </nav>

      <section style={{ padding: '1.5rem 0 1.25rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>See it on your skin</h1>
        <p style={{ fontSize: '0.88rem', color: '#666', lineHeight: '1.6' }}>AI renders your tattoo realistically onto your photo — skin texture, ink depth, the real thing.</p>
      </section>

      {/* UPLOAD PHOTO */}
      {step === STEPS.UPLOAD_PHOTO && (
        <div style={{ textAlign: 'center', padding: '2rem 1.5rem', border: '2px dashed #e5e5e5', borderRadius: '12px', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
          <p style={{ fontWeight: '600', color: '#111', marginBottom: '0.4rem' }}>Upload or take a body photo</p>
          <p style={{ fontSize: '0.82rem', color: '#888', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Arm, wrist, shoulder, chest — wherever you want the tattoo.<br />Clear photo, good lighting works best.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#111', color: '#fff', padding: '11px 22px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>
              📁 Choose photo
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fff', color: '#111', padding: '11px 22px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', border: '1px solid #ddd' }}>
              📷 Take photo
              <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </label>
          </div>
          <p style={{ fontSize: '0.72rem', color: '#bbb', marginTop: '1.25rem' }}>🔒 Your photo stays private — never shared or stored permanently</p>
        </div>
      )}

      {/* PLACE + ADJUST */}
      {(step === STEPS.CLICK_TO_PLACE || step === STEPS.ADJUST_SIZE) && bodyPhotoUrl && (
        <>
          {/* Tattoo upload */}
          {!tattooLoaded ? (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <p style={{ fontSize: '0.8rem', color: '#92400e', margin: 0 }}>Load your tattoo design first:</p>
              <label style={{ display: 'inline-block', background: '#111', color: '#fff', padding: '6px 16px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Upload tattoo image
                <input type="file" accept="image/*" onChange={handleTattooUpload} style={{ display: 'none' }} />
              </label>
            </div>
          ) : (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.6rem 1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#166534' }}>✓ Tattoo design loaded</span>
              <label style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#166534', cursor: 'pointer', textDecoration: 'underline' }}>
                Change
                <input type="file" accept="image/*" onChange={handleTattooUpload} style={{ display: 'none' }} />
              </label>
            </div>
          )}

          {/* Instruction */}
          <div style={{ background: '#f5f5f5', borderRadius: '8px', padding: '0.6rem 1rem', marginBottom: '0.75rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.82rem', color: '#555', margin: 0, fontWeight: '600' }}>
              {step === STEPS.CLICK_TO_PLACE
                ? '👆 Tap the photo where you want the tattoo'
                : '✓ Placement set — adjust size below, then render'}
            </p>
          </div>

          {/* Photo with overlay */}
          <div
            style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e5e5', marginBottom: '1rem', cursor: 'crosshair' }}
            onClick={handlePhotoClick}
          >
            <img
              ref={photoImgRef}
              src={bodyPhotoUrl}
              alt="Your body photo"
              onLoad={handleImageLoad}
              style={{ width: '100%', display: 'block', userSelect: 'none' }}
              draggable={false}
            />
            {clickPos && (
              <canvas
                ref={overlayCanvasRef}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
              />
            )}
            {!clickPos && (
              <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '0.75rem', padding: '5px 14px', borderRadius: '999px', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
                Tap anywhere on the photo
              </div>
            )}
          </div>

          {/* Size + style controls */}
          {step === STEPS.ADJUST_SIZE && (
            <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>

              {/* Size slider */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.82rem', color: '#555', fontWeight: '600' }}>Tattoo size on skin</label>
                  <span style={{ fontSize: '0.78rem', color: '#888' }}>
                    {maskRadius < 30 ? 'Tiny' : maskRadius < 60 ? 'Small' : maskRadius < 120 ? 'Medium' : maskRadius < 200 ? 'Large' : 'X-Large'}
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="300"
                  value={maskRadius}
                  onChange={(e) => setMaskRadius(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#111' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#bbb' }}>Tiny</span>
                  <span style={{ fontSize: '0.7rem', color: '#bbb' }}>X-Large</span>
                </div>
              </div>

              {/* Style selector */}
              <div>
                <label style={{ fontSize: '0.75rem', color: '#666', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Tattoo style</label>
                <select value={style} onChange={(e) => setStyle(e.target.value)}
                  style={{ width: '100%', height: '36px', padding: '0 10px', fontSize: '0.82rem', border: '1px solid #ddd', borderRadius: '8px', background: '#fff', color: '#333' }}>
                  <option value="blackwork">Blackwork</option>
                  <option value="fine line">Fine line</option>
                  <option value="black and grey">Black & grey</option>
                  <option value="neo-traditional">Neo-traditional</option>
                  <option value="full colour">Full colour</option>
                </select>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
            <button onClick={handleStartOver}
              style={{ flex: 0, padding: '0 16px', height: '48px', background: '#f5f5f5', color: '#555', border: '1px solid #e5e5e5', borderRadius: '10px', fontSize: '0.85rem', cursor: 'pointer' }}>
              ← New photo
            </button>
            <button
              onClick={handleRender}
              disabled={!renderButtonEnabled}
              style={{ flex: 1, height: '48px', background: renderButtonEnabled ? '#111' : '#ccc', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '700', cursor: renderButtonEnabled ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}>
              ✦ Render on skin
            </button>
          </div>
        </>
      )}

      {/* RENDERING */}
      {step === STEPS.RENDERING && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid #f0f0f0', borderTop: '3px solid #111', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontWeight: '600', color: '#111', marginBottom: '0.5rem', fontSize: '1rem' }}>Rendering your tattoo...</p>
          <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: '1.6', maxWidth: '300px', margin: '0 auto' }}>
            The AI is placing your design on your skin. This takes 15–30 seconds.
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
            <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6', marginBottom: '1rem' }}>Download the printable stencil and Artist Handoff PDF to take to your artist.</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={resultUrl} download="aigeek-skin-render.jpg"
                style={{ display: 'inline-block', background: '#111', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.88rem', fontWeight: '600' }}>
                ↓ Save result
              </a>
              <button onClick={handleTryAgain}
                style={{ background: '#f5f5f5', color: '#555', border: '1px solid #e5e5e5', padding: '10px 20px', borderRadius: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                Try different placement
              </button>
              <button onClick={handleStartOver}
                style={{ background: '#f5f5f5', color: '#555', border: '1px solid #e5e5e5', padding: '10px 20px', borderRadius: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                New photo
              </button>
            </div>
          </div>
          <div style={{ background: '#111', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#fff', fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.35rem' }}>Get the full pack</p>
            <p style={{ color: '#aaa', fontSize: '0.82rem', lineHeight: '1.6', marginBottom: '1rem' }}>HD design · Printable stencil · Artist Handoff PDF. Everything to walk into your studio prepared.</p>
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
          <p style={{ fontWeight: '600', color: '#dc2626', marginBottom: '0.5rem' }}>Render failed</p>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.25rem', lineHeight: '1.6' }}>{error}</p>
          <button onClick={handleTryAgain}
            style={{ background: '#111', color: '#fff', padding: '10px 24px', borderRadius: '8px', border: 'none', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>
            Try again
          </button>
        </div>
      )}

      <footer style={{ borderTop: '1px solid #f0f0f0', padding: '1.25rem 0 2rem' }}>
        <p style={{ fontSize: '0.72rem', color: '#ccc', textAlign: 'center' }}>© 2026 aigeek.ink</p>
      </footer>

    </main>
  )
}
