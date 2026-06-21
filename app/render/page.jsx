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

// Convert any image to JPEG base64, resized to max 1024px
// Fixes AVIF/HEIC/WebP and keeps payload under Vercel's 4.5MB limit
async function convertToJpegBase64(file, maxSize = 1024) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let w = img.naturalWidth
      let h = img.naturalHeight
      if (w > maxSize || h > maxSize) {
        if (w > h) { h = Math.round(h * maxSize / w); w = maxSize }
        else { w = Math.round(w * maxSize / h); h = maxSize }
      }
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)
      ctx.drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(objectUrl)
      resolve({ base64: canvas.toDataURL('image/jpeg', 0.88), width: w, height: h })
    }
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Failed to load image')) }
    img.src = objectUrl
  })
}

// Composite tattoo centered at click position, scaled to mask diameter
// Returns JPEG base64 of the composite
async function compositeImages(bodyBase64, tattooBase64, cx, cy, radius, bodyW, bodyH) {
  return new Promise((resolve, reject) => {
    const bodyImg = new Image()
    const tattooImg = new Image()
    let bodyLoaded = false
    let tattooLoaded = false

    const tryComposite = () => {
      if (!bodyLoaded || !tattooLoaded) return
      const canvas = document.createElement('canvas')
      canvas.width = bodyW
      canvas.height = bodyH
      const ctx = canvas.getContext('2d')

      // Draw body photo
      ctx.drawImage(bodyImg, 0, 0, bodyW, bodyH)

      // Scale tattoo to fit circle (with small padding)
      const diameter = radius * 2 * 0.92
      const aspect = tattooImg.naturalWidth / tattooImg.naturalHeight
      let tw, th
      if (aspect >= 1) { tw = diameter; th = diameter / aspect }
      else { th = diameter; tw = diameter * aspect }

      // Multiply blend makes white background transparent naturally
      ctx.globalAlpha = 0.90
      ctx.globalCompositeOperation = 'multiply'
      ctx.drawImage(tattooImg, cx - tw / 2, cy - th / 2, tw, th)
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'

      resolve(canvas.toDataURL('image/jpeg', 0.88))
    }

    bodyImg.onload = () => { bodyLoaded = true; tryComposite() }
    bodyImg.onerror = () => reject(new Error('Failed to load body image'))
    tattooImg.onload = () => { tattooLoaded = true; tryComposite() }
    tattooImg.onerror = () => reject(new Error('Failed to load tattoo image'))
    bodyImg.src = bodyBase64
    tattooImg.src = tattooBase64
  })
}

export default function RenderPage() {
  const [step, setStep] = useState(STEPS.UPLOAD_PHOTO)
  const [bodyPhoto, setBodyPhoto] = useState(null)        // base64 JPEG
  const [bodyPhotoUrl, setBodyPhotoUrl] = useState(null)  // for display
  const [bodySize, setBodySize] = useState({ width: 0, height: 0 })
  const [tattooBase64, setTattooBase64] = useState(null)
  const [tattooLoaded, setTattooLoaded] = useState(false)
  const [clickPos, setClickPos] = useState(null)
  const [maskRadius, setMaskRadius] = useState(80)
  const [resultUrl, setResultUrl] = useState(null)
  const [error, setError] = useState(null)
  const [converting, setConverting] = useState(false)

  const photoImgRef = useRef(null)
  const overlayCanvasRef = useRef(null)

  const maxRadius = bodySize.width
    ? Math.min(Math.min(bodySize.width, bodySize.height) / 2, 350)
    : 350

  const drawOverlay = useCallback(() => {
    const canvas = overlayCanvasRef.current
    const img = photoImgRef.current
    if (!canvas || !img || !clickPos) return

    const rect = img.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    const scaleX = rect.width / bodySize.width
    const scaleY = rect.height / bodySize.height
    const scale = Math.min(scaleX, scaleY)

    const displayX = clickPos.x * scaleX
    const displayY = clickPos.y * scaleY
    const displayRadius = maskRadius * scale

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = 'rgba(0,0,0,0.45)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(displayX, displayY, displayRadius, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'

    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 4])
    ctx.beginPath()
    ctx.arc(displayX, displayY, displayRadius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.strokeStyle = 'rgba(255,255,255,0.8)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(displayX - 8, displayY)
    ctx.lineTo(displayX + 8, displayY)
    ctx.moveTo(displayX, displayY - 8)
    ctx.lineTo(displayX, displayY + 8)
    ctx.stroke()
  }, [clickPos, maskRadius, bodySize])

  useEffect(() => { drawOverlay() }, [drawOverlay])

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setConverting(true)
    try {
      const { base64, width, height } = await convertToJpegBase64(file, 1024)
      setBodyPhoto(base64)
      setBodyPhotoUrl(base64)
      setBodySize({ width, height })
      setStep(STEPS.CLICK_TO_PLACE)
    } catch (err) {
      setError('Could not load that image. Please try a different photo.')
    } finally {
      setConverting(false)
    }
  }

  const handleTattooUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      // Tattoo image: resize to 512px max — enough detail, keeps payload small
      const { base64 } = await convertToJpegBase64(file, 512)
      setTattooBase64(base64)
      setTattooLoaded(true)
    } catch (err) {
      setError('Could not load tattoo image. Please try again.')
    }
  }

  const handlePhotoClick = (e) => {
    if (step !== STEPS.CLICK_TO_PLACE && step !== STEPS.ADJUST_SIZE) return
    const img = photoImgRef.current
    if (!img) return
    const rect = img.getBoundingClientRect()
    const scaleX = bodySize.width / rect.width
    const scaleY = bodySize.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    setClickPos({ x, y })
    setStep(STEPS.ADJUST_SIZE)
  }

  const adjustRadius = (delta) => {
    setMaskRadius(prev => Math.max(15, Math.min(maxRadius, prev + delta)))
  }

  const handleRender = async () => {
    if (!bodyPhoto || !clickPos || !tattooBase64) return
    setStep(STEPS.RENDERING)
    setError(null)

    try {
      // Composite client-side first
      const compositeBase64 = await compositeImages(
        bodyPhoto, tattooBase64,
        clickPos.x, clickPos.y,
        maskRadius,
        bodySize.width, bodySize.height
      )

      const response = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compositeImageBase64: compositeBase64,
          clickX: clickPos.x,
          clickY: clickPos.y,
          maskRadius,
          imageWidth: bodySize.width,
          imageHeight: bodySize.height,
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

  const handleTryAgain = () => {
    setStep(STEPS.CLICK_TO_PLACE); setClickPos(null); setResultUrl(null); setError(null)
  }
  const handleStartOver = () => {
    setStep(STEPS.UPLOAD_PHOTO); setBodyPhoto(null); setBodyPhotoUrl(null)
    setBodySize({ width: 0, height: 0 }); setClickPos(null); setResultUrl(null)
    setError(null); setTattooBase64(null); setTattooLoaded(false)
  }

  const renderButtonEnabled = step === STEPS.ADJUST_SIZE && clickPos && tattooLoaded
  const sizeLabel = maskRadius < 30 ? 'Tiny' : maskRadius < 60 ? 'Small' : maskRadius < 120 ? 'Medium' : maskRadius < 200 ? 'Large' : 'X-Large'

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

      {/* UPLOAD */}
      {step === STEPS.UPLOAD_PHOTO && (
        <div style={{ textAlign: 'center', padding: '2rem 1.5rem', border: '2px dashed #e5e5e5', borderRadius: '12px', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
          <p style={{ fontWeight: '600', color: '#111', marginBottom: '0.4rem' }}>Upload or take a body photo</p>
          <p style={{ fontSize: '0.82rem', color: '#888', marginBottom: '1.5rem', lineHeight: '1.6' }}>Arm, wrist, shoulder, chest — wherever you want the tattoo.<br />Clear photo, good lighting works best.</p>
          {converting ? (
            <p style={{ fontSize: '0.88rem', color: '#666' }}>Processing image...</p>
          ) : (
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
          )}
          <p style={{ fontSize: '0.72rem', color: '#bbb', marginTop: '1.25rem' }}>🔒 Your photo stays private — never shared or stored permanently</p>
        </div>
      )}

      {/* PLACE + ADJUST */}
      {(step === STEPS.CLICK_TO_PLACE || step === STEPS.ADJUST_SIZE) && bodyPhotoUrl && (
        <>
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

          <div style={{ background: '#f5f5f5', borderRadius: '8px', padding: '0.6rem 1rem', marginBottom: '0.75rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.82rem', color: '#555', margin: 0, fontWeight: '600' }}>
              {step === STEPS.CLICK_TO_PLACE ? '👆 Tap the photo where you want the tattoo' : '✓ Placement set — adjust size below, then render'}
            </p>
          </div>

          <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e5e5', marginBottom: '1rem', cursor: 'crosshair' }} onClick={handlePhotoClick}>
            <img ref={photoImgRef} src={bodyPhotoUrl} alt="Your body photo" style={{ width: '100%', display: 'block', userSelect: 'none' }} draggable={false} />
            {clickPos && <canvas ref={overlayCanvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />}
            {!clickPos && (
              <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '0.75rem', padding: '5px 14px', borderRadius: '999px', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
                Tap anywhere on the photo
              </div>
            )}
          </div>

          {step === STEPS.ADJUST_SIZE && (
            <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontSize: '0.82rem', color: '#555', fontWeight: '600' }}>Tattoo size on skin</label>
                <span style={{ fontSize: '0.78rem', color: '#888', fontWeight: '600' }}>{sizeLabel}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => adjustRadius(-10)} style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', fontSize: '1.2rem', fontWeight: '700', color: '#333', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <input type="range" min="15" max={maxRadius} value={maskRadius} onChange={(e) => setMaskRadius(Number(e.target.value))} style={{ flex: 1, accentColor: '#111' }} />
                <button onClick={() => adjustRadius(10)} style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', fontSize: '1.2rem', fontWeight: '700', color: '#333', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ fontSize: '0.7rem', color: '#bbb' }}>Tiny</span>
                <span style={{ fontSize: '0.7rem', color: '#bbb' }}>X-Large</span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
            <button onClick={handleStartOver} style={{ flex: 0, padding: '0 16px', height: '48px', background: '#f5f5f5', color: '#555', border: '1px solid #e5e5e5', borderRadius: '10px', fontSize: '0.85rem', cursor: 'pointer' }}>← New photo</button>
            <button onClick={handleRender} disabled={!renderButtonEnabled}
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
          <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: '1.6', maxWidth: '300px', margin: '0 auto' }}>The AI is making your design look freshly inked. 15–30 seconds.</p>
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
              <a href={resultUrl} download="aigeek-skin-render.jpg" style={{ display: 'inline-block', background: '#111', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.88rem', fontWeight: '600' }}>↓ Save result</a>
              <button onClick={handleTryAgain} style={{ background: '#f5f5f5', color: '#555', border: '1px solid #e5e5e5', padding: '10px 20px', borderRadius: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>Try different placement</button>
              <button onClick={handleStartOver} style={{ background: '#f5f5f5', color: '#555', border: '1px solid #e5e5e5', padding: '10px 20px', borderRadius: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>New photo</button>
            </div>
          </div>
          <div style={{ background: '#111', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#fff', fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.35rem' }}>Get the full pack</p>
            <p style={{ color: '#aaa', fontSize: '0.82rem', lineHeight: '1.6', marginBottom: '1rem' }}>HD design · Printable stencil · Artist Handoff PDF.</p>
            <a href="/pricing" style={{ display: 'inline-block', background: '#fff', color: '#111', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.88rem', fontWeight: '700' }}>See pricing — from $2.99</a>
          </div>
        </>
      )}

      {/* ERROR */}
      {step === STEPS.ERROR && (
        <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>⚠️</p>
          <p style={{ fontWeight: '600', color: '#dc2626', marginBottom: '0.5rem' }}>Render failed</p>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.25rem', lineHeight: '1.6' }}>{error}</p>
          <button onClick={handleTryAgain} style={{ background: '#111', color: '#fff', padding: '10px 24px', borderRadius: '8px', border: 'none', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>Try again</button>
        </div>
      )}

      <footer style={{ borderTop: '1px solid #f0f0f0', padding: '1.25rem 0 2rem' }}>
        <p style={{ fontSize: '0.72rem', color: '#ccc', textAlign: 'center' }}>© 2026 aigeek.ink</p>
      </footer>
    </main>
  )
}
