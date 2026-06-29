'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// ─── TEMPLATE DATA ────────────────────────────────────────────────────────────
const TEMPLATES = [
  // FEMALE LIGHT
  { id: 'fl_full',        file: 'female_light_full.png',        label: 'Full Body',    gender: 'female', tone: 'light', warp: 'flat',     clip: { x: 0.1,  y: 0.05, w: 0.8,  h: 0.9  } },
  { id: 'fl_back',        file: 'female_light_back.png',        label: 'Upper Back',   gender: 'female', tone: 'light', warp: 'back',     clip: { x: 0.15, y: 0.1,  w: 0.7,  h: 0.75 } },
  { id: 'fl_upperarm',    file: 'female_light_upperarm.png',    label: 'Upper Arm',    gender: 'female', tone: 'light', warp: 'cylinder', clip: { x: 0.25, y: 0.05, w: 0.5,  h: 0.85 } },
  { id: 'fl_neckbone',    file: 'female_light_neckbone.png',    label: 'Collarbone',   gender: 'female', tone: 'light', warp: 'sphere',   clip: { x: 0.1,  y: 0.1,  w: 0.8,  h: 0.7  } },
  { id: 'fl_sternum',     file: 'female_light_sternum.png',     label: 'Sternum',      gender: 'female', tone: 'light', warp: 'sternum',  clip: { x: 0.2,  y: 0.05, w: 0.6,  h: 0.8  } },
  { id: 'fl_ribcage',     file: 'female_light_ribcage.png',     label: 'Ribcage',      gender: 'female', tone: 'light', warp: 'cylinder', clip: { x: 0.2,  y: 0.1,  w: 0.6,  h: 0.75 } },
  { id: 'fl_wrist_up',    file: 'female_light_wrist_up.png',    label: 'Wrist (Top)',  gender: 'female', tone: 'light', warp: 'cylinder', clip: { x: 0.2,  y: 0.2,  w: 0.6,  h: 0.65 } },
  { id: 'fl_wrist_down',  file: 'female_light_wrist_down.png',  label: 'Wrist (Palm)', gender: 'female', tone: 'light', warp: 'cylinder', clip: { x: 0.2,  y: 0.2,  w: 0.6,  h: 0.65 } },
  { id: 'fl_ankle',       file: 'female_light_ankle.png',       label: 'Ankle',        gender: 'female', tone: 'light', warp: 'cylinder', clip: { x: 0.2,  y: 0.1,  w: 0.6,  h: 0.8  } },
  { id: 'fl_thigh_front', file: 'female_light_thigh_front.png', label: 'Thigh Front',  gender: 'female', tone: 'light', warp: 'thigh',    clip: { x: 0.15, y: 0.05, w: 0.7,  h: 0.85 } },
  { id: 'fl_thigh_back',  file: 'female_light_thigh_back.png',  label: 'Thigh Back',   gender: 'female', tone: 'light', warp: 'thigh',    clip: { x: 0.15, y: 0.05, w: 0.7,  h: 0.85 } },
  // FEMALE DARK
  { id: 'fd_full',        file: 'female_dark_full.png',         label: 'Full Body',    gender: 'female', tone: 'dark',  warp: 'flat',     clip: { x: 0.1,  y: 0.05, w: 0.8,  h: 0.9  } },
  { id: 'fd_back',        file: 'female_dark_back.png',         label: 'Upper Back',   gender: 'female', tone: 'dark',  warp: 'back',     clip: { x: 0.15, y: 0.1,  w: 0.7,  h: 0.75 } },
  { id: 'fd_upperarm',    file: 'female_dark_upperarm.png',     label: 'Upper Arm',    gender: 'female', tone: 'dark',  warp: 'cylinder', clip: { x: 0.25, y: 0.05, w: 0.5,  h: 0.85 } },
  { id: 'fd_neckbone',    file: 'female_dark_neckbone.png',     label: 'Collarbone',   gender: 'female', tone: 'dark',  warp: 'sphere',   clip: { x: 0.1,  y: 0.1,  w: 0.8,  h: 0.7  } },
  { id: 'fd_sternum',     file: 'female_dark_sternum.png',      label: 'Sternum',      gender: 'female', tone: 'dark',  warp: 'sternum',  clip: { x: 0.2,  y: 0.05, w: 0.6,  h: 0.8  } },
  { id: 'fd_ribcage',     file: 'female_dark_ribcage.png',      label: 'Ribcage',      gender: 'female', tone: 'dark',  warp: 'cylinder', clip: { x: 0.2,  y: 0.1,  w: 0.6,  h: 0.75 } },
  { id: 'fd_wrist_up',    file: 'female_dark_wrist_up.png',     label: 'Wrist (Top)',  gender: 'female', tone: 'dark',  warp: 'cylinder', clip: { x: 0.2,  y: 0.2,  w: 0.6,  h: 0.65 } },
  { id: 'fd_wrist_down',  file: 'female_dark_wrist_down.png',   label: 'Wrist (Palm)', gender: 'female', tone: 'dark',  warp: 'cylinder', clip: { x: 0.2,  y: 0.2,  w: 0.6,  h: 0.65 } },
  { id: 'fd_ankle',       file: 'female_dark_ankle.png',        label: 'Ankle',        gender: 'female', tone: 'dark',  warp: 'cylinder', clip: { x: 0.2,  y: 0.1,  w: 0.6,  h: 0.8  } },
  { id: 'fd_thigh_front', file: 'female_dark_thigh_front.png',  label: 'Thigh Front',  gender: 'female', tone: 'dark',  warp: 'thigh',    clip: { x: 0.15, y: 0.05, w: 0.7,  h: 0.85 } },
  { id: 'fd_thigh_back',  file: 'female_dark_thigh_back.png',   label: 'Thigh Back',   gender: 'female', tone: 'dark',  warp: 'thigh',    clip: { x: 0.15, y: 0.05, w: 0.7,  h: 0.85 } },
  // MALE LIGHT
  { id: 'ml_full',        file: 'male_light_full.png',          label: 'Full Body',    gender: 'male',   tone: 'light', warp: 'flat',     clip: { x: 0.1,  y: 0.05, w: 0.8,  h: 0.9  } },
  { id: 'ml_back',        file: 'male_light_back.png',          label: 'Upper Back',   gender: 'male',   tone: 'light', warp: 'back',     clip: { x: 0.15, y: 0.1,  w: 0.7,  h: 0.75 } },
  { id: 'ml_upperarm',    file: 'male_light_upperarm.png',      label: 'Upper Arm',    gender: 'male',   tone: 'light', warp: 'cylinder', clip: { x: 0.25, y: 0.05, w: 0.5,  h: 0.85 } },
  { id: 'ml_shoulder',    file: 'male_light_shoulder.png',      label: 'Shoulder',     gender: 'male',   tone: 'light', warp: 'sphere',   clip: { x: 0.15, y: 0.1,  w: 0.7,  h: 0.75 } },
  { id: 'ml_chest',       file: 'male_light_chest.png',         label: 'Chest',        gender: 'male',   tone: 'light', warp: 'sternum',  clip: { x: 0.1,  y: 0.05, w: 0.8,  h: 0.8  } },
  { id: 'ml_ribcage',     file: 'male_light_ribcage.png',       label: 'Ribcage',      gender: 'male',   tone: 'light', warp: 'cylinder', clip: { x: 0.2,  y: 0.1,  w: 0.6,  h: 0.75 } },
  { id: 'ml_wrist_up',    file: 'male_light_wrist_up.png',      label: 'Wrist (Top)',  gender: 'male',   tone: 'light', warp: 'cylinder', clip: { x: 0.2,  y: 0.2,  w: 0.6,  h: 0.65 } },
  { id: 'ml_wrist_down',  file: 'male_light_wrist_down.png',    label: 'Wrist (Palm)', gender: 'male',   tone: 'light', warp: 'cylinder', clip: { x: 0.2,  y: 0.2,  w: 0.6,  h: 0.65 } },
  { id: 'ml_ankle',       file: 'male_light_ankle.png',         label: 'Ankle',        gender: 'male',   tone: 'light', warp: 'cylinder', clip: { x: 0.2,  y: 0.1,  w: 0.6,  h: 0.8  } },
  { id: 'ml_thigh',       file: 'male_light_thigh.png',         label: 'Thigh',        gender: 'male',   tone: 'light', warp: 'thigh',    clip: { x: 0.15, y: 0.05, w: 0.7,  h: 0.85 } },
  // MALE DARK
  { id: 'md_full',        file: 'male_dark_full.png',           label: 'Full Body',    gender: 'male',   tone: 'dark',  warp: 'flat',     clip: { x: 0.1,  y: 0.05, w: 0.8,  h: 0.9  } },
  { id: 'md_back',        file: 'male_dark_back.png',           label: 'Upper Back',   gender: 'male',   tone: 'dark',  warp: 'back',     clip: { x: 0.15, y: 0.1,  w: 0.7,  h: 0.75 } },
  { id: 'md_upperarm',    file: 'male_dark_upperarm.png',       label: 'Upper Arm',    gender: 'male',   tone: 'dark',  warp: 'cylinder', clip: { x: 0.25, y: 0.05, w: 0.5,  h: 0.85 } },
  { id: 'md_shoulder',    file: 'male_dark_shoulder.png',       label: 'Shoulder',     gender: 'male',   tone: 'dark',  warp: 'sphere',   clip: { x: 0.15, y: 0.1,  w: 0.7,  h: 0.75 } },
  { id: 'md_chest',       file: 'male_dark_chest.png',          label: 'Chest',        gender: 'male',   tone: 'dark',  warp: 'sternum',  clip: { x: 0.1,  y: 0.05, w: 0.8,  h: 0.8  } },
  { id: 'md_ribcage',     file: 'male_dark_ribcage.png',        label: 'Ribcage',      gender: 'male',   tone: 'dark',  warp: 'cylinder', clip: { x: 0.2,  y: 0.1,  w: 0.6,  h: 0.75 } },
  { id: 'md_wrist_up',    file: 'male_dark_wrist_up.png',       label: 'Wrist (Top)',  gender: 'male',   tone: 'dark',  warp: 'cylinder', clip: { x: 0.2,  y: 0.2,  w: 0.6,  h: 0.65 } },
  { id: 'md_wrist_down',  file: 'male_dark_wrist_down.png',     label: 'Wrist (Palm)', gender: 'male',   tone: 'dark',  warp: 'cylinder', clip: { x: 0.2,  y: 0.2,  w: 0.6,  h: 0.65 } },
  { id: 'md_ankle',       file: 'male_dark_ankle.png',          label: 'Ankle',        gender: 'male',   tone: 'dark',  warp: 'cylinder', clip: { x: 0.2,  y: 0.1,  w: 0.6,  h: 0.8  } },
  { id: 'md_thigh',       file: 'male_dark_thigh.png',          label: 'Thigh',        gender: 'male',   tone: 'dark',  warp: 'thigh',    clip: { x: 0.15, y: 0.05, w: 0.7,  h: 0.85 } },
]

// ─── HELPERS ──────────────────────────────────────────────────────────────────

async function loadImageFromUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load: ${url}`))
    img.src = url
  })
}

async function convertFileToBase64(file, maxSize = 1024) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      let w = img.naturalWidth, h = img.naturalHeight
      if (w > maxSize || h > maxSize) {
        if (w > h) { h = Math.round(h * maxSize / w); w = maxSize }
        else { w = Math.round(w * maxSize / h); h = maxSize }
      }
      const c = document.createElement('canvas')
      c.width = w; c.height = h
      const ctx = c.getContext('2d')
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, w, h)
      ctx.drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      resolve({ base64: c.toDataURL('image/jpeg', 0.88), width: w, height: h })
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject() }
    img.src = url
  })
}

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
  c.width = 80; c.height = 80
  const ctx = c.getContext('2d')
  ctx.drawImage(imgEl, 0, 0, 80, 80)
  const d = ctx.getImageData(0, 0, 80, 80).data
  let total = 0, count = 0
  for (let i = 0; i < d.length; i += 4) {
    if (d[i+3] < 128) continue
    total += Math.max(d[i],d[i+1],d[i+2]) - Math.min(d[i],d[i+1],d[i+2])
    count++
  }
  return count > 0 && (total/count) > 30
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function TryOnPage() {
  // Mode: 'pick' = template/photo selection, 'place' = placement canvas
  const [mode, setMode] = useState('pick')
  const [gender, setGender] = useState('female')
  const [tone, setTone] = useState('light')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [usingOwnPhoto, setUsingOwnPhoto] = useState(false)

  // Canvas state
  const [bgLoaded, setBgLoaded] = useState(false)
  const [tattooClean, setTattooClean] = useState(null)
  const [tattooBase64, setTattooBase64] = useState(null)
  const [isColoured, setIsColoured] = useState(false)
  const [opacity, setOpacity] = useState(85)
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1, rotation: 0 })
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 })
  const [error, setError] = useState(null)
  const [loadingBg, setLoadingBg] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const canvasRef = useRef(null)
  const bgImgRef = useRef(null)
  const bgCanvasRef = useRef(null) // offscreen for pixel sampling
  const transformRef = useRef(transform)
  const opacityRef = useRef(opacity)
  const tattooCleanRef = useRef(null)
  const clipRef = useRef(null)
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const lastPinchDist = useRef(null)
  const lastPinchAngle = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => { transformRef.current = transform }, [transform])
  useEffect(() => { opacityRef.current = opacity }, [opacity])
  useEffect(() => { tattooCleanRef.current = tattooClean }, [tattooClean])

  // Load tattoo from sessionStorage (passed from generator)
  useEffect(() => {
    const saved = sessionStorage.getItem('aigeek_tattoo_url')
    if (saved) loadTattooFromUrl(saved)
  }, [])

  const loadTattooFromUrl = async (url) => {
    try {
      const img = await loadImageFromUrl(url)
      const coloured = detectIsColoured(img)
      setIsColoured(coloured)
      const clean = removeBackgroundWhite(img)
      setTattooClean(clean)
      setTattooBase64(url)
    } catch (e) {
      // silent fail — user can upload manually
    }
  }

  // ─── CANVAS DRAW ────────────────────────────────────────────────────────────
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const bg = bgImgRef.current
    const tattoo = tattooCleanRef.current
    if (!canvas || !bg) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)

    if (!tattoo) return

    const t = transformRef.current
    const clip = clipRef.current

    ctx.save()

    // Apply clipping zone — tattoo stays within defined skin area
    if (clip) {
      const cx = clip.x * canvas.width
      const cy = clip.y * canvas.height
      const cw = clip.w * canvas.width
      const ch = clip.h * canvas.height
      ctx.beginPath()
      ctx.roundRect(cx, cy, cw, ch, 8)
      ctx.clip()
    }

    ctx.translate(t.x, t.y)
    ctx.rotate(t.rotation)
    ctx.scale(t.scale, t.scale)
    ctx.globalAlpha = opacityRef.current / 100
    ctx.globalCompositeOperation = 'multiply'
    ctx.drawImage(tattoo, -tattoo.width / 2, -tattoo.height / 2)
    ctx.restore()
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
  }, [])

  const scheduleRedraw = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      drawCanvas()
    })
  }, [drawCanvas])

  useEffect(() => { scheduleRedraw() }, [transform, opacity, tattooClean, scheduleRedraw])

  // ─── LOAD BACKGROUND ────────────────────────────────────────────────────────
  const loadBackground = async (template) => {
    setLoadingBg(true)
    setBgLoaded(false)
    try {
      const url = `/templates/${template.file}`
      const img = await loadImageFromUrl(url)
      bgImgRef.current = img

      // Offscreen canvas for pixel sampling (warp)
      const offscreen = document.createElement('canvas')
      offscreen.width = img.naturalWidth
      offscreen.height = img.naturalHeight
      offscreen.getContext('2d').drawImage(img, 0, 0)
      bgCanvasRef.current = offscreen

      // Set canvas dimensions
      const maxW = Math.min(window.innerWidth - 32, 600)
      const ratio = img.naturalHeight / img.naturalWidth
      const displayH = Math.round(maxW * ratio)
      setCanvasSize({ w: maxW, h: displayH })

      if (canvasRef.current) {
        canvasRef.current.width = img.naturalWidth
        canvasRef.current.height = img.naturalHeight
      }

      // Set clip zone
      clipRef.current = template.clip

      // Center tattoo
      const defaultScale = (img.naturalWidth * 0.28) / Math.max(
        tattooClean?.width || 200,
        tattooClean?.height || 200
      )
      setTransform({
        x: img.naturalWidth * (template.clip.x + template.clip.w / 2),
        y: img.naturalHeight * (template.clip.y + template.clip.h / 2),
        scale: defaultScale,
        rotation: 0,
      })

      setBgLoaded(true)
      setMode('place')
    } catch (e) {
      setError('Could not load template. Please try again.')
    } finally {
      setLoadingBg(false)
    }
  }

  // ─── TOUCH/MOUSE HANDLERS ───────────────────────────────────────────────────
  const getScale = () => {
    const canvas = canvasRef.current
    if (!canvas) return { sx: 1, sy: 1 }
    const rect = canvas.getBoundingClientRect()
    return { sx: canvas.width / rect.width, sy: canvas.height / rect.height }
  }

  const handleMouseDown = (e) => { isDragging.current = true; lastPointer.current = { x: e.clientX, y: e.clientY } }
  const handleMouseMove = (e) => {
    if (!isDragging.current) return
    const { sx, sy } = getScale()
    setTransform(p => ({ ...p, x: p.x + (e.clientX - lastPointer.current.x) * sx, y: p.y + (e.clientY - lastPointer.current.y) * sy }))
    lastPointer.current = { x: e.clientX, y: e.clientY }
  }
  const handleMouseUp = () => { isDragging.current = false }

  const getTouchDist = t => { const dx=t[0].clientX-t[1].clientX,dy=t[0].clientY-t[1].clientY; return Math.sqrt(dx*dx+dy*dy) }
  const getTouchAngle = t => Math.atan2(t[1].clientY-t[0].clientY, t[1].clientX-t[0].clientX)
  const getTouchCenter = t => ({ x:(t[0].clientX+t[1].clientX)/2, y:(t[0].clientY+t[1].clientY)/2 })

  const handleTouchStart = (e) => {
    e.preventDefault()
    if (e.touches.length === 1) {
      isDragging.current = true
      lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      lastPinchDist.current = null; lastPinchAngle.current = null
    } else if (e.touches.length === 2) {
      isDragging.current = false
      lastPinchDist.current = getTouchDist(e.touches)
      lastPinchAngle.current = getTouchAngle(e.touches)
      lastPointer.current = getTouchCenter(e.touches)
    }
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    const { sx, sy } = getScale()
    if (e.touches.length === 1 && isDragging.current) {
      setTransform(p => ({ ...p, x: p.x + (e.touches[0].clientX - lastPointer.current.x) * sx, y: p.y + (e.touches[0].clientY - lastPointer.current.y) * sy }))
      lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    } else if (e.touches.length === 2) {
      const nd = getTouchDist(e.touches)
      const na = getTouchAngle(e.touches)
      const nc = getTouchCenter(e.touches)
      const dx = (nc.x - lastPointer.current.x) * sx
      const dy = (nc.y - lastPointer.current.y) * sy
      const scaleDelta = lastPinchDist.current ? nd / lastPinchDist.current : 1
      const angleDelta = lastPinchAngle.current !== null ? na - lastPinchAngle.current : 0
      lastPointer.current = nc
      lastPinchDist.current = nd; lastPinchAngle.current = na
      setTransform(p => ({
        x: p.x + dx, y: p.y + dy,
        scale: Math.max(0.05, Math.min(8, p.scale * scaleDelta)),
        rotation: p.rotation + angleDelta,
      }))
    }
  }

  const handleTouchEnd = (e) => {
    if (e.touches.length === 0) { isDragging.current = false; lastPinchDist.current = null; lastPinchAngle.current = null }
  }

  // ─── OWN PHOTO UPLOAD ───────────────────────────────────────────────────────
  const handleOwnPhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoadingBg(true)
    try {
      const { base64, width, height } = await convertFileToBase64(file, 1024)
      const img = await loadImageFromUrl(base64)
      bgImgRef.current = img

      const offscreen = document.createElement('canvas')
      offscreen.width = width; offscreen.height = height
      offscreen.getContext('2d').drawImage(img, 0, 0)
      bgCanvasRef.current = offscreen

      const maxW = Math.min(window.innerWidth - 32, 600)
      setCanvasSize({ w: maxW, h: Math.round(maxW * height / width) })

      if (canvasRef.current) {
        canvasRef.current.width = width
        canvasRef.current.height = height
      }

      // No clip zone for own photos
      clipRef.current = null
      setUsingOwnPhoto(true)

      const defaultScale = (width * 0.28) / Math.max(tattooClean?.width || 200, tattooClean?.height || 200)
      setTransform({ x: width / 2, y: height / 2, scale: defaultScale, rotation: 0 })
      setBgLoaded(true)
      setMode('place')
    } catch (e) {
      setError('Could not load photo.')
    } finally {
      setLoadingBg(false)
    }
  }

  // ─── TATTOO UPLOAD ──────────────────────────────────────────────────────────
  const handleTattooUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const { base64 } = await convertFileToBase64(file, 512)
      const img = await loadImageFromUrl(base64)
      setIsColoured(detectIsColoured(img))
      setTattooClean(removeBackgroundWhite(img))
      setTattooBase64(base64)
      sessionStorage.setItem('aigeek_tattoo_url', base64)
    } catch (e) {
      setError('Could not load tattoo image.')
    }
  }

  // ─── PROCEED TO RENDER ──────────────────────────────────────────────────────
  const handleProceedToRender = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const composite = canvas.toDataURL('image/jpeg', 0.88)
    sessionStorage.setItem('aigeek_composite', composite)
    sessionStorage.setItem('aigeek_composite_w', canvas.width)
    sessionStorage.setItem('aigeek_composite_h', canvas.height)
    sessionStorage.setItem('aigeek_is_coloured', isColoured ? '1' : '0')
    window.location.href = '/render'
  }

  // ─── FILTERED TEMPLATES ─────────────────────────────────────────────────────
  const filtered = TEMPLATES.filter(t => t.gender === gender && t.tone === tone)

  // ─── STYLES ─────────────────────────────────────────────────────────────────
  const S = {
    btn: (active) => ({
      flex: 1, height: '36px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600',
      cursor: 'pointer', border: 'none',
      background: active ? '#111' : '#f0f0f0',
      color: active ? '#fff' : '#555',
      transition: 'all 0.15s',
    }),
    toneBtn: (active, dark) => ({
      flex: 1, height: '36px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600',
      cursor: 'pointer', border: '2px solid ' + (active ? '#111' : 'transparent'),
      background: dark ? '#5C3317' : '#F5D5B0',
      color: dark ? '#fff' : '#333',
    }),
  }

  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '680px', margin: '0 auto', padding: '0 1rem' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: '1px solid #f0f0f0' }}>
        <a href="/" style={{ fontWeight: '700', fontSize: '1.1rem', letterSpacing: '-0.02em', textDecoration: 'none', color: '#111' }}>aigeek.ink</a>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="/generate" style={{ fontSize: '0.82rem', color: '#888', textDecoration: 'none' }}>Generator</a>
          <a href="/pricing" style={{ fontSize: '0.82rem', color: '#888', textDecoration: 'none' }}>Pricing</a>
        </div>
      </nav>

      {/* Header */}
      <section style={{ padding: '1.25rem 0 1rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#111', marginBottom: '0.3rem', letterSpacing: '-0.02em' }}>Try it on</h1>
        <p style={{ fontSize: '0.85rem', color: '#777', lineHeight: '1.6', margin: 0 }}>
          Place your tattoo on a body template — free, instant, no credits used.
        </p>
      </section>

      {/* ── PICK MODE ── */}
      {mode === 'pick' && (
        <>
          {/* Tattoo loaded indicator */}
          <div style={{ background: tattooBase64 ? '#f0fdf4' : '#fffbeb', border: '1px solid ' + (tattooBase64 ? '#bbf7d0' : '#fde68a'), borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: '600', color: tattooBase64 ? '#166534' : '#92400e', margin: 0 }}>
                {tattooBase64 ? '✓ Tattoo design ready' : '⚠ No tattoo design loaded'}
              </p>
              <p style={{ fontSize: '0.72rem', color: '#888', margin: '2px 0 0' }}>
                {tattooBase64 ? 'From your generator session' : 'Upload a tattoo image or generate one first'}
              </p>
            </div>
            <label style={{ display: 'inline-block', background: '#111', color: '#fff', padding: '6px 14px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {tattooBase64 ? 'Change' : 'Upload tattoo'}
              <input type="file" accept="image/*" onChange={handleTattooUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Gender toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <button style={S.btn(gender === 'female')} onClick={() => setGender('female')}>♀ Female</button>
            <button style={S.btn(gender === 'male')} onClick={() => setGender('male')}>♂ Male</button>
          </div>

          {/* Skin tone toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
            <button style={S.toneBtn(tone === 'light', false)} onClick={() => setTone('light')}>Light skin</button>
            <button style={S.toneBtn(tone === 'dark', true)} onClick={() => setTone('dark')}>Dark skin</button>
          </div>

          {/* Template grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '1.25rem' }}>
            {filtered.map(t => (
              <div key={t.id}
                onClick={() => { if (!tattooBase64) { setError('Load a tattoo design first.'); return } loadBackground(t) }}
                style={{ borderRadius: '10px', overflow: 'hidden', border: '2px solid #e5e5e5', cursor: tattooBase64 ? 'pointer' : 'not-allowed', background: '#f5f5f5', position: 'relative', aspectRatio: '3/4', transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#111'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e5e5'}
              >
                <img src={`/templates/${t.file}`} alt={t.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.65))', padding: '12px 8px 6px' }}>
                  <p style={{ fontSize: '0.7rem', color: '#fff', fontWeight: '600', margin: 0, textAlign: 'center' }}>{t.label}</p>
                </div>
                {loadingBg && selectedTemplate?.id === t.id && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '20px', height: '20px', border: '2px solid #f0f0f0', borderTop: '2px solid #111', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Own photo — locked for free users */}
          <div style={{ border: '1px solid #e5e5e5', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div>
                <p style={{ fontSize: '0.88rem', fontWeight: '700', color: '#111', margin: 0 }}>📷 Use your own photo</p>
                <p style={{ fontSize: '0.75rem', color: '#888', margin: '2px 0 0' }}>Place the tattoo on your actual body photo</p>
              </div>
              <span style={{ background: '#111', color: '#fff', fontSize: '0.65rem', fontWeight: '700', padding: '3px 8px', borderRadius: '999px' }}>PAID</span>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              style={{ width: '100%', height: '40px', background: '#f5f5f5', color: '#555', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
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
          <div style={{ background: '#f5f5f5', borderRadius: '8px', padding: '0.55rem 1rem', marginBottom: '0.75rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.78rem', color: '#555', margin: 0, fontWeight: '600' }}>
              👆 Drag to move · Pinch to resize & rotate
            </p>
          </div>

          {/* Canvas */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e5e5', marginBottom: '1rem', touchAction: 'none', userSelect: 'none', background: '#f0f0f0' }}>
            <canvas
              ref={canvasRef}
              style={{ width: '100%', display: 'block', cursor: 'move' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </div>

          {/* Controls */}
          <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ marginBottom: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <label style={{ fontSize: '0.78rem', color: '#555', fontWeight: '600' }}>Opacity</label>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>{opacity}%</span>
              </div>
              <input type="range" min="20" max="100" value={opacity} onChange={e => setOpacity(Number(e.target.value))} style={{ width: '100%', accentColor: '#111' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setTransform(p => ({ ...p, rotation: 0 }))}
                style={{ flex: 1, height: '34px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.78rem', color: '#555', cursor: 'pointer' }}>
                ↺ Reset rotation
              </button>
              <button onClick={() => {
                  if (!canvasRef.current) return
                  const c = canvasRef.current
                  setTransform(p => ({ ...p, x: c.width * (clipRef.current ? clipRef.current.x + clipRef.current.w/2 : 0.5), y: c.height * (clipRef.current ? clipRef.current.y + clipRef.current.h/2 : 0.5) }))
                }}
                style={{ flex: 1, height: '34px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.78rem', color: '#555', cursor: 'pointer' }}>
                ⊙ Re-center
              </button>
              <label style={{ flex: 1, height: '34px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.78rem', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                🎨 Change tattoo
                <input type="file" accept="image/*" onChange={handleTattooUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
            <button onClick={() => { setMode('pick'); setUsingOwnPhoto(false) }}
              style={{ flex: 0, padding: '0 16px', height: '48px', background: '#f5f5f5', color: '#555', border: '1px solid #e5e5e5', borderRadius: '10px', fontSize: '0.85rem', cursor: 'pointer' }}>
              ← Templates
            </button>
            <button onClick={handleProceedToRender}
              style={{ flex: 1, height: '48px', background: '#111', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer' }}>
              ✦ AI Skin Render — $2.99
            </button>
          </div>

          <p style={{ fontSize: '0.72rem', color: '#bbb', textAlign: 'center', marginBottom: '2rem' }}>
            Happy with placement? Render makes it look like real fresh ink on skin.
          </p>
        </>
      )}

      {/* Upgrade modal */}
      {showUpgradeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000, padding: '0 0 0 0' }}
          onClick={() => setShowUpgradeModal(false)}>
          <div style={{ background: '#fff', borderRadius: '16px 16px 0 0', padding: '1.5rem', width: '100%', maxWidth: '680px' }}
            onClick={e => e.stopPropagation()}>
            <p style={{ fontWeight: '700', fontSize: '1.1rem', color: '#111', marginBottom: '0.5rem' }}>Unlock your own photo</p>
            <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Upload any photo of your body and place your tattoo exactly where you want it. Then hit AI Skin Render to see it as real ink.
            </p>
            <a href="/pricing" style={{ display: 'block', background: '#111', color: '#fff', padding: '14px', borderRadius: '10px', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '700', textAlign: 'center', marginBottom: '0.75rem' }}>
              Get Starter Pack — $2.99
            </a>
            <button onClick={() => setShowUpgradeModal(false)}
              style={{ width: '100%', height: '44px', background: '#f5f5f5', color: '#555', border: 'none', borderRadius: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
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
