'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const TEMPLATES = [
  { id: 'fl_full',        file: 'female_light_full.png',        label: 'Full Body',    gender: 'female', tone: 'light', clip: { x: 0.1,  y: 0.05, w: 0.8,  h: 0.9  } },
  { id: 'fl_back',        file: 'female_light_back.png',        label: 'Upper Back',   gender: 'female', tone: 'light', clip: { x: 0.15, y: 0.1,  w: 0.7,  h: 0.75 } },
  { id: 'fl_upperarm',    file: 'female_light_upperarm.png',    label: 'Upper Arm',    gender: 'female', tone: 'light', clip: { x: 0.25, y: 0.05, w: 0.5,  h: 0.85 } },
  { id: 'fl_neckbone',    file: 'female_light_neckbone.png',    label: 'Collarbone',   gender: 'female', tone: 'light', clip: { x: 0.1,  y: 0.1,  w: 0.8,  h: 0.7  } },
  { id: 'fl_sternum',     file: 'female_light_sternum.png',     label: 'Sternum',      gender: 'female', tone: 'light', clip: { x: 0.2,  y: 0.05, w: 0.6,  h: 0.8  } },
  { id: 'fl_ribcage',     file: 'female_light_ribcage.png',     label: 'Ribcage',      gender: 'female', tone: 'light', clip: { x: 0.2,  y: 0.1,  w: 0.6,  h: 0.75 } },
  { id: 'fl_wrist_up',    file: 'female_light_wrist_up.png',    label: 'Wrist (Top)',  gender: 'female', tone: 'light', clip: { x: 0.2,  y: 0.2,  w: 0.6,  h: 0.65 } },
  { id: 'fl_wrist_down',  file: 'female_light_wrist_down.png',  label: 'Wrist (Palm)', gender: 'female', tone: 'light', clip: { x: 0.2,  y: 0.2,  w: 0.6,  h: 0.65 } },
  { id: 'fl_ankle',       file: 'female_light_ankle.png',       label: 'Ankle',        gender: 'female', tone: 'light', clip: { x: 0.2,  y: 0.1,  w: 0.6,  h: 0.8  } },
  { id: 'fl_thigh_front', file: 'female_light_thigh_front.png', label: 'Thigh Front',  gender: 'female', tone: 'light', clip: { x: 0.15, y: 0.05, w: 0.7,  h: 0.85 } },
  { id: 'fl_thigh_back',  file: 'female_light_thigh_back.png',  label: 'Thigh Back',   gender: 'female', tone: 'light', clip: { x: 0.15, y: 0.05, w: 0.7,  h: 0.85 } },
  { id: 'fd_full',        file: 'female_dark_full.png',         label: 'Full Body',    gender: 'female', tone: 'dark',  clip: { x: 0.1,  y: 0.05, w: 0.8,  h: 0.9  } },
  { id: 'fd_back',        file: 'female_dark_back.png',         label: 'Upper Back',   gender: 'female', tone: 'dark',  clip: { x: 0.15, y: 0.1,  w: 0.7,  h: 0.75 } },
  { id: 'fd_upperarm',    file: 'female_dark_upperarm.png',     label: 'Upper Arm',    gender: 'female', tone: 'dark',  clip: { x: 0.25, y: 0.05, w: 0.5,  h: 0.85 } },
  { id: 'fd_neckbone',    file: 'female_dark_neckbone.png',     label: 'Collarbone',   gender: 'female', tone: 'dark',  clip: { x: 0.1,  y: 0.1,  w: 0.8,  h: 0.7  } },
  { id: 'fd_sternum',     file: 'female_dark_sternum.png',      label: 'Sternum',      gender: 'female', tone: 'dark',  clip: { x: 0.2,  y: 0.05, w: 0.6,  h: 0.8  } },
  { id: 'fd_ribcage',     file: 'female_dark_ribcage.png',      label: 'Ribcage',      gender: 'female', tone: 'dark',  clip: { x: 0.2,  y: 0.1,  w: 0.6,  h: 0.75 } },
  { id: 'fd_wrist_up',    file: 'female_dark_wrist_up.png',     label: 'Wrist (Top)',  gender: 'female', tone: 'dark',  clip: { x: 0.2,  y: 0.2,  w: 0.6,  h: 0.65 } },
  { id: 'fd_wrist_down',  file: 'female_dark_wrist_down.png',   label: 'Wrist (Palm)', gender: 'female', tone: 'dark',  clip: { x: 0.2,  y: 0.2,  w: 0.6,  h: 0.65 } },
  { id: 'fd_ankle',       file: 'female_dark_ankle.png',        label: 'Ankle',        gender: 'female', tone: 'dark',  clip: { x: 0.2,  y: 0.1,  w: 0.6,  h: 0.8  } },
  { id: 'fd_thigh_front', file: 'female_dark_thigh_front.png',  label: 'Thigh Front',  gender: 'female', tone: 'dark',  clip: { x: 0.15, y: 0.05, w: 0.7,  h: 0.85 } },
  { id: 'fd_thigh_back',  file: 'female_dark_thigh_back.png',   label: 'Thigh Back',   gender: 'female', tone: 'dark',  clip: { x: 0.15, y: 0.05, w: 0.7,  h: 0.85 } },
  { id: 'ml_full',        file: 'male_light_full.png',          label: 'Full Body',    gender: 'male',   tone: 'light', clip: { x: 0.1,  y: 0.05, w: 0.8,  h: 0.9  } },
  { id: 'ml_back',        file: 'male_light_back.png',          label: 'Upper Back',   gender: 'male',   tone: 'light', clip: { x: 0.15, y: 0.1,  w: 0.7,  h: 0.75 } },
  { id: 'ml_upperarm',    file: 'male_light_upperarm.png',      label: 'Upper Arm',    gender: 'male',   tone: 'light', clip: { x: 0.25, y: 0.05, w: 0.5,  h: 0.85 } },
  { id: 'ml_shoulder',    file: 'male_light_shoulder.png',      label: 'Shoulder',     gender: 'male',   tone: 'light', clip: { x: 0.15, y: 0.1,  w: 0.7,  h: 0.75 } },
  { id: 'ml_chest',       file: 'male_light_chest.png',         label: 'Chest',        gender: 'male',   tone: 'light', clip: { x: 0.1,  y: 0.05, w: 0.8,  h: 0.8  } },
  { id: 'ml_ribcage',     file: 'male_light_ribcage.png',       label: 'Ribcage',      gender: 'male',   tone: 'light', clip: { x: 0.2,  y: 0.1,  w: 0.6,  h: 0.75 } },
  { id: 'ml_wrist_up',    file: 'male_light_wrist_up.png',      label: 'Wrist (Top)',  gender: 'male',   tone: 'light', clip: { x: 0.2,  y: 0.2,  w: 0.6,  h: 0.65 } },
  { id: 'ml_wrist_down',  file: 'male_light_wrist_down.png',    label: 'Wrist (Palm)', gender: 'male',   tone: 'light', clip: { x: 0.2,  y: 0.2,  w: 0.6,  h: 0.65 } },
  { id: 'ml_ankle',       file: 'male_light_ankle.png',         label: 'Ankle',        gender: 'male',   tone: 'light', clip: { x: 0.2,  y: 0.1,  w: 0.6,  h: 0.8  } },
  { id: 'ml_thigh',       file: 'male_light_thigh.png',         label: 'Thigh',        gender: 'male',   tone: 'light', clip: { x: 0.15, y: 0.05, w: 0.7,  h: 0.85 } },
  { id: 'md_full',        file: 'male_dark_full.png',           label: 'Full Body',    gender: 'male',   tone: 'dark',  clip: { x: 0.1,  y: 0.05, w: 0.8,  h: 0.9  } },
  { id: 'md_back',        file: 'male_dark_back.png',           label: 'Upper Back',   gender: 'male',   tone: 'dark',  clip: { x: 0.15, y: 0.1,  w: 0.7,  h: 0.75 } },
  { id: 'md_upperarm',    file: 'male_dark_upperarm.png',       label: 'Upper Arm',    gender: 'male',   tone: 'dark',  clip: { x: 0.25, y: 0.05, w: 0.5,  h: 0.85 } },
  { id: 'md_shoulder',    file: 'male_dark_shoulder.png',       label: 'Shoulder',     gender: 'male',   tone: 'dark',  clip: { x: 0.15, y: 0.1,  w: 0.7,  h: 0.75 } },
  { id: 'md_chest',       file: 'male_dark_chest.png',          label: 'Chest',        gender: 'male',   tone: 'dark',  clip: { x: 0.1,  y: 0.05, w: 0.8,  h: 0.8  } },
  { id: 'md_ribcage',     file: 'male_dark_ribcage.png',        label: 'Ribcage',      gender: 'male',   tone: 'dark',  clip: { x: 0.2,  y: 0.1,  w: 0.6,  h: 0.75 } },
  { id: 'md_wrist_up',    file: 'male_dark_wrist_up.png',       label: 'Wrist (Top)',  gender: 'male',   tone: 'dark',  clip: { x: 0.2,  y: 0.2,  w: 0.6,  h: 0.65 } },
  { id: 'md_wrist_down',  file: 'male_dark_wrist_down.png',     label: 'Wrist (Palm)', gender: 'male',   tone: 'dark',  clip: { x: 0.2,  y: 0.2,  w: 0.6,  h: 0.65 } },
  { id: 'md_ankle',       file: 'male_dark_ankle.png',          label: 'Ankle',        gender: 'male',   tone: 'dark',  clip: { x: 0.2,  y: 0.1,  w: 0.6,  h: 0.8  } },
  { id: 'md_thigh',       file: 'male_dark_thigh.png',          label: 'Thigh',        gender: 'male',   tone: 'dark',  clip: { x: 0.15, y: 0.05, w: 0.7,  h: 0.85 } },
]

function removeBackgroundWhite(imgEl, threshold = 235) {
  const w = imgEl.naturalWidth || imgEl.width
  const h = imgEl.naturalHeight || imgEl.height
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const ctx = c.getContext('2d')
  ctx.drawImage(imgEl, 0, 0)
  const id = ctx.getImageData(0, 0, w, h)
  const d = id.data
  const vis = new Uint8Array(w * h)
  const isWhite = i => d[i] > threshold && d[i+1] > threshold && d[i+2] > threshold
  const q = []
  for (let x = 0; x < w; x++) {
    const t = x; if (!vis[t] && isWhite(t*4)) { q.push(t); vis[t]=1 }
    const b = (h-1)*w+x; if (!vis[b] && isWhite(b*4)) { q.push(b); vis[b]=1 }
  }
  for (let y = 0; y < h; y++) {
    const l = y*w; if (!vis[l] && isWhite(l*4)) { q.push(l); vis[l]=1 }
    const r = y*w+(w-1); if (!vis[r] && isWhite(r*4)) { q.push(r); vis[r]=1 }
  }
  while (q.length) {
    const px = q.shift()
    d[px*4+3] = 0
    for (const dv of [-1,1,-w,w]) {
      const nb = px+dv
      if (nb<0||nb>=w*h||vis[nb]) continue
      if (dv===-1&&px%w===0) continue
      if (dv===1&&px%w===w-1) continue
      if (isWhite(nb*4)) { vis[nb]=1; q.push(nb) }
    }
  }
  ctx.putImageData(id, 0, 0)
  return c
}

function detectIsColoured(imgEl) {
  const c = document.createElement('canvas')
  c.width = 60; c.height = 60
  const ctx = c.getContext('2d')
  ctx.drawImage(imgEl, 0, 0, 60, 60)
  const d = ctx.getImageData(0, 0, 60, 60).data
  let total = 0, count = 0
  for (let i = 0; i < d.length; i += 4) {
    if (d[i+3] < 128) continue
    total += Math.max(d[i],d[i+1],d[i+2]) - Math.min(d[i],d[i+1],d[i+2])
    count++
  }
  return count > 0 && (total/count) > 30
}

export default function TryOnPage() {
  const [mode, setMode] = useState('pick')
  const [gender, setGender] = useState('male')
  const [tone, setTone] = useState('light')
  const [loadingTemplate, setLoadingTemplate] = useState(null)
  const [tattooClean, setTattooClean] = useState(null)
  const [tattooLoaded, setTattooLoaded] = useState(false)
  const [isColoured, setIsColoured] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [error, setError] = useState(null)
  const [imgNaturalSize, setImgNaturalSize] = useState({ w: 1, h: 1 })

  // Placement controls — all sliders
  const [posX, setPosX] = useState(50)       // % of canvas width
  const [posY, setPosY] = useState(50)       // % of canvas height
  const [size, setSize] = useState(1.0)      // scale multiplier
  const [rotation, setRotation] = useState(0) // degrees
  const [opacity, setOpacity] = useState(85)
  const [mirror, setMirror] = useState(false)
  const [activeClip, setActiveClip] = useState(null)

  const canvasRef = useRef(null)
  const bgImgRef = useRef(null)
  const tattooRef = useRef(null)
  const clipRef = useRef(null)
  const naturalRef = useRef({ w: 1, h: 1 })
  const rafRef = useRef(null)

  // Drag state
  const isDragging = useRef(false)
  const lastPtr = useRef({ x: 0, y: 0 })

  useEffect(() => { tattooRef.current = tattooClean }, [tattooClean])
  useEffect(() => { clipRef.current = activeClip }, [activeClip])
  useEffect(() => { naturalRef.current = imgNaturalSize }, [imgNaturalSize])

  // Load tattoo from sessionStorage on mount
  useEffect(() => {
    const url = sessionStorage.getItem('aigeek_tattoo_url')
    if (!url) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setIsColoured(detectIsColoured(img))
      setTattooClean(removeBackgroundWhite(img))
      setTattooLoaded(true)
    }
    img.src = url
  }, [])

  // Draw canvas whenever any control changes
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const bg = bgImgRef.current
    if (!canvas || !bg) return

    const cw = canvas.width
    const ch = canvas.height
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(bg, 0, 0, cw, ch)

    const tattoo = tattooRef.current
    if (!tattoo) return

    const tx = (posX / 100) * cw
    const ty = (posY / 100) * ch
    const rad = (rotation * Math.PI) / 180
    const clip = clipRef.current

    ctx.save()

    // Clip to skin zone
    if (clip) {
      ctx.beginPath()
      ctx.rect(clip.x * cw, clip.y * ch, clip.w * cw, clip.h * ch)
      ctx.clip()
    }

    ctx.translate(tx, ty)
    ctx.rotate(rad)
    if (mirror) ctx.scale(-size, size)
    else ctx.scale(size, size)
    ctx.globalAlpha = opacity / 100
    ctx.globalCompositeOperation = 'multiply'
    ctx.drawImage(tattoo, -tattoo.width / 2, -tattoo.height / 2)

    ctx.restore()
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
  }, [posX, posY, size, rotation, opacity, mirror])

  const scheduleRedraw = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => { rafRef.current = null; draw() })
  }, [draw])

  useEffect(() => { scheduleRedraw() }, [posX, posY, size, rotation, opacity, mirror, tattooClean, scheduleRedraw])

  // Load template
  const loadTemplate = async (template) => {
    setLoadingTemplate(template.id)
    setError(null)
    try {
      await new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          bgImgRef.current = img
          const nw = img.naturalWidth
          const nh = img.naturalHeight
          const canvas = canvasRef.current
          if (canvas) { canvas.width = nw; canvas.height = nh }
          setImgNaturalSize({ w: nw, h: nh })
          setActiveClip(template.clip)
          // Center in clip zone
          const cx = (template.clip.x + template.clip.w / 2) * 100
          const cy = (template.clip.y + template.clip.h / 2) * 100
          setPosX(cx)
          setPosY(cy)
          setSize(1.0)
          setRotation(0)
          setMirror(false)
          resolve()
        }
        img.onerror = reject
        img.src = `/templates/${template.file}`
      })
      setMode('place')
    } catch {
      setError('Could not load template. Please try again.')
    } finally {
      setLoadingTemplate(null)
    }
  }

  // Tattoo file upload
  const handleTattooUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        setIsColoured(detectIsColoured(img))
        setTattooClean(removeBackgroundWhite(img))
        setTattooLoaded(true)
        sessionStorage.setItem('aigeek_tattoo_url', ev.target.result)
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  // Drag to move on canvas
  const getCanvasScale = () => {
    const c = canvasRef.current
    if (!c) return { sx: 1, sy: 1 }
    const r = c.getBoundingClientRect()
    return { sx: 100 / r.width, sy: 100 / r.height }
  }

  const onMouseDown = (e) => {
    isDragging.current = true
    lastPtr.current = { x: e.clientX, y: e.clientY }
  }
  const onMouseMove = (e) => {
    if (!isDragging.current) return
    const { sx, sy } = getCanvasScale()
    setPosX(p => Math.max(0, Math.min(100, p + (e.clientX - lastPtr.current.x) * sx)))
    setPosY(p => Math.max(0, Math.min(100, p + (e.clientY - lastPtr.current.y) * sy)))
    lastPtr.current = { x: e.clientX, y: e.clientY }
  }
  const onMouseUp = () => { isDragging.current = false }

  const onTouchStart = (e) => {
    if (e.touches.length !== 1) return
    e.preventDefault()
    isDragging.current = true
    lastPtr.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchMove = (e) => {
    if (!isDragging.current || e.touches.length !== 1) return
    e.preventDefault()
    const { sx, sy } = getCanvasScale()
    setPosX(p => Math.max(0, Math.min(100, p + (e.touches[0].clientX - lastPtr.current.x) * sx)))
    setPosY(p => Math.max(0, Math.min(100, p + (e.touches[0].clientY - lastPtr.current.y) * sy)))
    lastPtr.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = () => { isDragging.current = false }

  // Proceed to AI render
  const handleRender = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    sessionStorage.setItem('aigeek_composite', canvas.toDataURL('image/jpeg', 0.88))
    sessionStorage.setItem('aigeek_composite_w', canvas.width)
    sessionStorage.setItem('aigeek_composite_h', canvas.height)
    sessionStorage.setItem('aigeek_is_coloured', isColoured ? '1' : '0')
    window.location.href = '/render'
  }

  const filtered = TEMPLATES.filter(t => t.gender === gender && t.tone === tone)

  // Slider row component
  const SliderRow = ({ label, value, min, max, step = 1, onChange, display }) => (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <label style={{ fontSize: '0.78rem', color: '#555', fontWeight: '600' }}>{label}</label>
        <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: '500' }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#111', height: '4px' }} />
    </div>
  )

  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '680px', margin: '0 auto', padding: '0 1rem' }}>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: '1px solid #f0f0f0' }}>
        <a href="/" style={{ fontWeight: '700', fontSize: '1.1rem', letterSpacing: '-0.02em', textDecoration: 'none', color: '#111' }}>aigeek.ink</a>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <a href="/generate" style={{ fontSize: '0.82rem', color: '#888', textDecoration: 'none' }}>Generator</a>
          <a href="/pricing" style={{ fontSize: '0.82rem', color: '#888', textDecoration: 'none' }}>Pricing</a>
        </div>
      </nav>

      <section style={{ padding: '1.25rem 0 1rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#111', marginBottom: '0.3rem', letterSpacing: '-0.02em' }}>Try it on</h1>
        <p style={{ fontSize: '0.85rem', color: '#777', lineHeight: '1.6', margin: 0 }}>
          Place your tattoo on a body template — free, instant, no credits.
        </p>
      </section>

      {/* ── PICK MODE ── */}
      {mode === 'pick' && (
        <>
          {/* Tattoo status */}
          <div style={{ background: tattooLoaded ? '#f0fdf4' : '#fffbeb', border: '1px solid ' + (tattooLoaded ? '#bbf7d0' : '#fde68a'), borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '0.82rem', fontWeight: '600', color: tattooLoaded ? '#166534' : '#92400e', margin: 0 }}>
                {tattooLoaded ? '✓ Tattoo design ready' : '⚠ No tattoo design loaded'}
              </p>
              <p style={{ fontSize: '0.72rem', color: '#888', margin: '2px 0 0' }}>
                {tattooLoaded ? 'Select a body template below' : 'Upload a design or generate one first'}
              </p>
            </div>
            <label style={{ display: 'inline-block', background: '#111', color: '#fff', padding: '6px 14px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {tattooLoaded ? 'Change design' : 'Upload tattoo'}
              <input type="file" accept="image/*" onChange={handleTattooUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Gender toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            {['female', 'male'].map(g => (
              <button key={g} onClick={() => setGender(g)}
                style={{ flex: 1, height: '40px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', border: 'none', background: gender === g ? '#111' : '#f0f0f0', color: gender === g ? '#fff' : '#555', transition: 'all 0.15s' }}>
                {g === 'female' ? '♀ Female' : '♂ Male'}
              </button>
            ))}
          </div>

          {/* Skin tone toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
            <button onClick={() => setTone('light')}
              style={{ flex: 1, height: '40px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', background: '#F5D5B0', color: '#4a3000', border: '2px solid ' + (tone === 'light' ? '#111' : 'transparent'), transition: 'border-color 0.15s' }}>
              ☀ Light
            </button>
            <button onClick={() => setTone('dark')}
              style={{ flex: 1, height: '40px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', background: '#3D1F0D', color: '#f5d5b0', border: '2px solid ' + (tone === 'dark' ? '#f5d5b0' : 'transparent'), transition: 'border-color 0.15s' }}>
              ✦ Dark
            </button>
          </div>

          {/* Template grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '1.25rem' }}>
            {filtered.map(t => (
              <div key={t.id}
                onClick={() => {
                  if (!tattooLoaded) { setError('Upload a tattoo design first.'); return }
                  setError(null)
                  loadTemplate(t)
                }}
                style={{ borderRadius: '10px', overflow: 'hidden', border: '2px solid ' + (tattooLoaded ? '#e5e5e5' : '#f0f0f0'), cursor: tattooLoaded ? 'pointer' : 'not-allowed', background: '#f5f5f5', position: 'relative', aspectRatio: '2/3', transition: 'border-color 0.15s, transform 0.1s' }}
                onMouseEnter={e => { if (tattooLoaded) e.currentTarget.style.borderColor = '#111' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = tattooLoaded ? '#e5e5e5' : '#f0f0f0' }}
              >
                <img src={`/templates/${t.file}`} alt={t.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: tattooLoaded ? 1 : 0.5 }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.72))', padding: '16px 6px 7px' }}>
                  <p style={{ fontSize: '0.68rem', color: '#fff', fontWeight: '600', margin: 0, textAlign: 'center' }}>{t.label}</p>
                </div>
                {loadingTemplate === t.id && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '26px', height: '26px', border: '3px solid #f0f0f0', borderTop: '3px solid #111', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Own photo locked */}
          <div style={{ border: '1px solid #e5e5e5', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111', margin: 0 }}>📷 Use your own photo</p>
                <p style={{ fontSize: '0.75rem', color: '#888', margin: '3px 0 0' }}>Place the tattoo on your actual body photo</p>
              </div>
              <span style={{ background: '#111', color: '#fff', fontSize: '0.62rem', fontWeight: '700', padding: '3px 8px', borderRadius: '999px' }}>PAID</span>
            </div>
            <button onClick={() => setShowUpgradeModal(true)}
              style={{ width: '100%', height: '42px', background: '#f5f5f5', color: '#555', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
              🔒 Unlock with Starter Pack — $2.99
            </button>
          </div>

          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.82rem', color: '#dc2626', margin: 0 }}>{error}</p>
            </div>
          )}
        </>
      )}

      {/* ── PLACE MODE ── */}
      {mode === 'place' && (
        <>
          {/* Canvas — drag only for position */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e5e5', marginBottom: '1rem', touchAction: 'none', userSelect: 'none', background: '#111', lineHeight: 0, position: 'relative' }}>
            <canvas
              ref={canvasRef}
              style={{ width: '100%', display: 'block', cursor: 'move' }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            />
            <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.7rem', padding: '4px 12px', borderRadius: '999px', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
              Drag to reposition
            </div>
          </div>

          {/* All controls */}
          <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1rem 1rem 0.25rem', marginBottom: '1rem' }}>

            <SliderRow
              label="Size"
              value={size}
              min={0.1}
              max={5}
              step={0.05}
              onChange={setSize}
              display={`${size.toFixed(1)}×`}
            />

            <SliderRow
              label="Rotation"
              value={rotation}
              min={-180}
              max={180}
              step={1}
              onChange={setRotation}
              display={`${rotation}°`}
            />

            <SliderRow
              label="Opacity"
              value={opacity}
              min={10}
              max={100}
              step={1}
              onChange={setOpacity}
              display={`${opacity}%`}
            />

            {/* Mirror flip */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.875rem', borderTop: '1px solid #f0f0f0', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.78rem', color: '#555', fontWeight: '600' }}>↔ Mirror flip</span>
              </div>
              <button
                onClick={() => setMirror(m => !m)}
                style={{ width: '48px', height: '26px', borderRadius: '999px', border: 'none', background: mirror ? '#111' : '#ddd', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                <div style={{ position: 'absolute', top: '3px', left: mirror ? '25px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
              </button>
            </div>

            {/* Quick action buttons */}
            <div style={{ display: 'flex', gap: '8px', paddingBottom: '0.875rem' }}>
              <button onClick={() => setRotation(0)}
                style={{ flex: 1, height: '34px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.75rem', color: '#555', cursor: 'pointer' }}>
                ↺ Reset rotation
              </button>
              <button onClick={() => { setSize(1.0); setRotation(0); setMirror(false) }}
                style={{ flex: 1, height: '34px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.75rem', color: '#555', cursor: 'pointer' }}>
                ⊙ Reset all
              </button>
              <label style={{ flex: 1, height: '34px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.75rem', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                🎨 Change
                <input type="file" accept="image/*" onChange={handleTattooUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '0.75rem' }}>
            <button onClick={() => setMode('pick')}
              style={{ flex: 0, padding: '0 16px', height: '50px', background: '#f5f5f5', color: '#555', border: '1px solid #e5e5e5', borderRadius: '10px', fontSize: '0.85rem', cursor: 'pointer' }}>
              ← Templates
            </button>
            <button onClick={handleRender}
              style={{ flex: 1, height: '50px', background: '#111', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer' }}>
              ✦ AI Skin Render — $2.99
            </button>
          </div>

          <p style={{ fontSize: '0.72rem', color: '#bbb', textAlign: 'center', marginBottom: '2rem' }}>
            Happy with placement? Render makes it look like real fresh ink.
          </p>
        </>
      )}

      {/* Upgrade modal */}
      {showUpgradeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setShowUpgradeModal(false)}>
          <div style={{ background: '#fff', borderRadius: '20px 20px 0 0', padding: '1.75rem 1.5rem', width: '100%', maxWidth: '680px' }}
            onClick={e => e.stopPropagation()}>
            <p style={{ fontWeight: '700', fontSize: '1.1rem', color: '#111', marginBottom: '0.5rem' }}>Use your own photo</p>
            <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Upload any body photo and place your tattoo exactly where you want it. Then AI Skin Render makes it look like real ink on your actual skin.
            </p>
            <a href="/pricing" style={{ display: 'block', background: '#111', color: '#fff', padding: '14px', borderRadius: '10px', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '700', textAlign: 'center', marginBottom: '0.75rem' }}>
              Get Starter Pack — $2.99
            </a>
            <button onClick={() => setShowUpgradeModal(false)}
              style={{ width: '100%', height: '44px', background: '#f5f5f5', color: '#666', border: 'none', borderRadius: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
              Maybe later
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      <footer style={{ borderTop: '1px solid #f0f0f0', padding: '1.25rem 0 2rem' }}>
        <p style={{ fontSize: '0.72rem', color: '#ccc', textAlign: 'center' }}>© 2026 aigeek.ink</p>
      </footer>
    </main>
  )
}
