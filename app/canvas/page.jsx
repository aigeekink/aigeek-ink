'use client'

import { useState, useEffect, useRef } from 'react'

export default function CanvasPage() {
  const canvasRef = useRef(null)
  const fabricRef = useRef(null)
  const [fabricLoaded, setFabricLoaded] = useState(false)
  const [bodyPhotoUploaded, setBodyPhotoUploaded] = useState(false)
  const [tattooLoaded, setTattooLoaded] = useState(false)
  const [tattooUrl, setTattooUrl] = useState(null)
  const [opacity, setOpacity] = useState(85)
  const [status, setStatus] = useState('idle') // idle | ready | placed
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  // Load Fabric.js from CDN
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.fabric) {
      setFabricLoaded(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js'
    script.onload = () => setFabricLoaded(true)
    script.onerror = () => console.error('Failed to load Fabric.js')
    document.head.appendChild(script)
  }, [])

  // Initialise canvas once Fabric loads
  useEffect(() => {
    if (!fabricLoaded || !canvasRef.current) return
    if (fabricRef.current) return // already initialised

    const canvasWidth = Math.min(window.innerWidth - 32, 640)
    const canvasHeight = Math.round(canvasWidth * 1.1)

    const canvas = new window.fabric.Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      selection: false,
      backgroundColor: '#f5f5f5',
      enableRetinaScaling: true,
    })

    fabricRef.current = canvas

    // Resize canvas on window resize
    const handleResize = () => {
      const newWidth = Math.min(window.innerWidth - 32, 640)
      const newHeight = Math.round(newWidth * 1.1)
      canvas.setDimensions({ width: newWidth, height: newHeight })
      canvas.renderAll()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.dispose()
      fabricRef.current = null
    }
  }, [fabricLoaded])

  // Load body photo onto canvas as background
  const handleBodyPhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file || !fabricRef.current) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const canvas = fabricRef.current
      window.fabric.Image.fromURL(event.target.result, (img) => {
        // Scale image to fill canvas
        const scaleX = canvas.width / img.width
        const scaleY = canvas.height / img.height
        const scale = Math.max(scaleX, scaleY)

        img.set({
          scaleX: scale,
          scaleY: scale,
          left: (canvas.width - img.width * scale) / 2,
          top: (canvas.height - img.height * scale) / 2,
          selectable: false,
          evented: false,
          crossOrigin: 'anonymous',
        })

        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas))
        setBodyPhotoUploaded(true)
        setStatus('ready')
      }, { crossOrigin: 'anonymous' })
    }
    reader.readAsDataURL(file)
  }

  // Load tattoo design onto canvas (from URL param or sessionStorage)
  const loadTattooDesign = (url) => {
    if (!fabricRef.current || !url) return
    const canvas = fabricRef.current

    window.fabric.Image.fromURL(url, (img) => {
      const maxSize = Math.min(canvas.width, canvas.height) * 0.45
      const scale = maxSize / Math.max(img.width, img.height)

      img.set({
        scaleX: scale,
        scaleY: scale,
        left: canvas.width / 2 - (img.width * scale) / 2,
        top: canvas.height / 2 - (img.height * scale) / 2,
        opacity: opacity / 100,
        cornerColor: '#111',
        cornerStrokeColor: '#fff',
        cornerSize: isMobile ? 20 : 14,
        transparentCorners: false,
        borderColor: '#111',
        borderScaleFactor: 2,
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
        lockSkewingX: true,
        lockSkewingY: true,
      })

      // Remove any existing tattoo
      canvas.getObjects().forEach((obj) => canvas.remove(obj))

      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.renderAll()

      setTattooLoaded(true)
      setTattooUrl(url)
      setStatus('placed')
    }, { crossOrigin: 'anonymous' })
  }

  // Handle tattoo image file upload (for testing without the generator)
  const handleTattooUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => loadTattooDesign(event.target.result)
    reader.readAsDataURL(file)
  }

  // Update opacity of active tattoo object
  useEffect(() => {
    if (!fabricRef.current) return
    const canvas = fabricRef.current
    const objects = canvas.getObjects()
    if (objects.length > 0) {
      objects[0].set('opacity', opacity / 100)
      canvas.renderAll()
    }
  }, [opacity])

  // Flip tattoo horizontally
  const handleFlip = () => {
    if (!fabricRef.current) return
    const canvas = fabricRef.current
    const obj = canvas.getActiveObject() || canvas.getObjects()[0]
    if (obj) {
      obj.set('flipX', !obj.flipX)
      canvas.renderAll()
    }
  }

  // Reset tattoo to center
  const handleCenter = () => {
    if (!fabricRef.current) return
    const canvas = fabricRef.current
    const obj = canvas.getActiveObject() || canvas.getObjects()[0]
    if (obj) {
      obj.set({
        left: canvas.width / 2 - (obj.width * obj.scaleX) / 2,
        top: canvas.height / 2 - (obj.height * obj.scaleY) / 2,
      })
      obj.setCoords()
      canvas.renderAll()
    }
  }

  // Save canvas as image
  const handleSavePreview = () => {
    if (!fabricRef.current) return
    const canvas = fabricRef.current
    const dataURL = canvas.toDataURL({ format: 'png', quality: 0.9, multiplier: 2 })
    const link = document.createElement('a')
    link.download = 'aigeek-tattoo-preview.png'
    link.href = dataURL
    link.click()
  }

  const CANVAS_INSTRUCTIONS = isMobile
    ? 'Drag to move · Pinch to resize/rotate'
    : 'Drag to move · Corner handles to resize/rotate'

  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '680px', margin: '0 auto', padding: '0 1rem' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: '1px solid #f0f0f0' }}>
        <a href="/" style={{ fontWeight: '600', fontSize: '1.1rem', letterSpacing: '-0.02em', textDecoration: 'none', color: '#111' }}>aigeek.ink</a>
        <a href="/generate" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none' }}>← Back to generator</a>
      </nav>

      {/* Header */}
      <section style={{ padding: '1.5rem 0 1rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>See it on your skin</h1>
        <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6' }}>Upload a photo, drag your design onto it. Free preview — no account needed.</p>
      </section>

      {/* Step indicators */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
        {[
          { n: '1', label: 'Upload your photo', done: bodyPhotoUploaded },
          { n: '2', label: 'Load tattoo design', done: tattooLoaded },
          { n: '3', label: 'Position & preview', done: status === 'placed' },
        ].map(({ n, label, done }) => (
          <div key={n} style={{ flex: 1, textAlign: 'center', padding: '8px 4px', borderRadius: '8px', background: done ? '#111' : '#f5f5f5', border: '1px solid ' + (done ? '#111' : '#e5e5e5') }}>
            <p style={{ fontSize: '0.65rem', fontWeight: '700', color: done ? '#fff' : '#999', margin: 0 }}>{done ? '✓' : n}</p>
            <p style={{ fontSize: '0.68rem', color: done ? '#ddd' : '#666', margin: '2px 0 0', lineHeight: '1.3' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Canvas */}
      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e5e5', marginBottom: '1rem', touchAction: 'none' }}>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
        {!fabricLoaded && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
            <p style={{ fontSize: '0.85rem', color: '#999' }}>Loading canvas...</p>
          </div>
        )}
        {fabricLoaded && !bodyPhotoUploaded && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📷</div>
            <p style={{ fontSize: '0.9rem', color: '#555', fontWeight: '600', marginBottom: '0.25rem' }}>Upload your body photo</p>
            <p style={{ fontSize: '0.78rem', color: '#999', textAlign: 'center', maxWidth: '220px', lineHeight: '1.5' }}>Arm, wrist, shoulder, chest — wherever you want the tattoo</p>
          </div>
        )}
        {tattooLoaded && (
          <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.7rem', padding: '4px 12px', borderRadius: '999px', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
            {CANVAS_INSTRUCTIONS}
          </div>
        )}
      </div>

      {/* Controls row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>

        {/* Step 1: Upload body photo */}
        <label style={{ flex: 1, minWidth: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '40px', background: bodyPhotoUploaded ? '#f0f0f0' : '#111', color: bodyPhotoUploaded ? '#555' : '#fff', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', border: '1px solid ' + (bodyPhotoUploaded ? '#ddd' : '#111'), whiteSpace: 'nowrap' }}>
          {bodyPhotoUploaded ? '✓ Photo loaded' : '📷 Upload photo'}
          <input type="file" accept="image/*" onChange={handleBodyPhotoUpload} style={{ display: 'none' }} />
        </label>

        {/* Step 2: Load tattoo */}
        <label style={{ flex: 1, minWidth: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '40px', background: tattooLoaded ? '#f0f0f0' : bodyPhotoUploaded ? '#111' : '#e5e5e5', color: tattooLoaded ? '#555' : bodyPhotoUploaded ? '#fff' : '#aaa', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: bodyPhotoUploaded ? 'pointer' : 'not-allowed', border: '1px solid ' + (tattooLoaded ? '#ddd' : '#e5e5e5'), whiteSpace: 'nowrap' }}>
          {tattooLoaded ? '✓ Design loaded' : '🎨 Load tattoo'}
          <input type="file" accept="image/*" onChange={handleTattooUpload} disabled={!bodyPhotoUploaded} style={{ display: 'none' }} />
        </label>

      </div>

      {/* Manipulation controls — shown only when tattoo is placed */}
      {tattooLoaded && (
        <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>

          {/* Opacity slider */}
          <div style={{ marginBottom: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.78rem', color: '#555', fontWeight: '600' }}>Opacity</label>
              <span style={{ fontSize: '0.78rem', color: '#888' }}>{opacity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#111' }}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={handleFlip} style={{ flex: 1, height: '36px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.78rem', color: '#444', cursor: 'pointer', fontWeight: '500' }}>
              ↔ Flip
            </button>
            <button onClick={handleCenter} style={{ flex: 1, height: '36px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.78rem', color: '#444', cursor: 'pointer', fontWeight: '500' }}>
              ⊙ Center
            </button>
            <button onClick={handleSavePreview} style={{ flex: 1, height: '36px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.78rem', color: '#444', cursor: 'pointer', fontWeight: '500' }}>
              ↓ Save preview
            </button>
          </div>
        </div>
      )}

      {/* Privacy note */}
      <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.75rem', color: '#888', margin: 0, lineHeight: '1.6' }}>
          🔒 <strong style={{ color: '#555' }}>Your photos stay private.</strong> Everything runs in your browser — your photos are never uploaded to our servers at this stage. Auto-deleted after 72 hours if used for the paid AI render.
        </p>
      </div>

      {/* Upgrade CTA */}
      <div style={{ background: '#111', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#fff', fontWeight: '700', fontSize: '1rem', marginBottom: '0.35rem' }}>Make it look actually inked</p>
        <p style={{ color: '#aaa', fontSize: '0.82rem', lineHeight: '1.6', marginBottom: '1rem' }}>
          The canvas preview is a rough overlay. The AI Skin Render makes it look like real ink — skin texture, pores, depth. $2.99 once.
        </p>
        <a href="/pricing" style={{ display: 'inline-block', background: '#fff', color: '#111', padding: '10px 28px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700' }}>
          Upgrade — from $2.99
        </a>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #f0f0f0', padding: '1.25rem 0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '0.75rem' }}>
          <a href="/pricing" style={{ fontSize: '0.8rem', color: '#888', textDecoration: 'none' }}>Pricing</a>
          <a href="/privacy" style={{ fontSize: '0.8rem', color: '#888', textDecoration: 'none' }}>Privacy</a>
          <a href="/terms" style={{ fontSize: '0.8rem', color: '#888', textDecoration: 'none' }}>Terms</a>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#ccc', textAlign: 'center' }}>© 2026 aigeek.ink</p>
      </footer>

    </main>
  )
}
