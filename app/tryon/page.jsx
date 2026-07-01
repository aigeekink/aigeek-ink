'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const TEMPLATES = [
  { id: 'fl_full',        file: 'female_light_full.png',        label: 'Full Body',    gender: 'female', tone: 'light' },
  { id: 'fl_back',        file: 'female_light_back.png',        label: 'Upper Back',   gender: 'female', tone: 'light' },
  { id: 'fl_upperarm',    file: 'female_light_upperarm.png',    label: 'Upper Arm',    gender: 'female', tone: 'light' },
  { id: 'fl_neckbone',    file: 'female_light_neckbone.png',    label: 'Collarbone',   gender: 'female', tone: 'light' },
  { id: 'fl_sternum',     file: 'female_light_sternum.png',     label: 'Sternum',      gender: 'female', tone: 'light' },
  { id: 'fl_ribcage',     file: 'female_light_ribcage.png',     label: 'Ribcage',      gender: 'female', tone: 'light' },
  { id: 'fl_wrist_up',    file: 'female_light_wrist_up.png',    label: 'Wrist (Top)',  gender: 'female', tone: 'light' },
  { id: 'fl_wrist_down',  file: 'female_light_wrist_down.png',  label: 'Wrist (Palm)', gender: 'female', tone: 'light' },
  { id: 'fl_ankle',       file: 'female_light_ankle.png',       label: 'Ankle',        gender: 'female', tone: 'light' },
  { id: 'fl_thigh_front', file: 'female_light_thigh_front.png', label: 'Thigh Front',  gender: 'female', tone: 'light' },
  { id: 'fl_thigh_back',  file: 'female_light_thigh_back.png',  label: 'Thigh Back',   gender: 'female', tone: 'light' },
  { id: 'fd_full',        file: 'female_dark_full.png',         label: 'Full Body',    gender: 'female', tone: 'dark'  },
  { id: 'fd_back',        file: 'female_dark_back.png',         label: 'Upper Back',   gender: 'female', tone: 'dark'  },
  { id: 'fd_upperarm',    file: 'female_dark_upperarm.png',     label: 'Upper Arm',    gender: 'female', tone: 'dark'  },
  { id: 'fd_neckbone',    file: 'female_dark_neckbone.png',     label: 'Collarbone',   gender: 'female', tone: 'dark'  },
  { id: 'fd_sternum',     file: 'female_dark_sternum.png',      label: 'Sternum',      gender: 'female', tone: 'dark'  },
  { id: 'fd_ribcage',     file: 'female_dark_ribcage.png',      label: 'Ribcage',      gender: 'female', tone: 'dark'  },
  { id: 'fd_wrist_up',    file: 'female_dark_wrist_up.png',     label: 'Wrist (Top)',  gender: 'female', tone: 'dark'  },
  { id: 'fd_wrist_down',  file: 'female_dark_wrist_down.png',   label: 'Wrist (Palm)', gender: 'female', tone: 'dark'  },
  { id: 'fd_ankle',       file: 'female_dark_ankle.png',        label: 'Ankle',        gender: 'female', tone: 'dark'  },
  { id: 'fd_thigh_front', file: 'female_dark_thigh_front.png',  label: 'Thigh Front',  gender: 'female', tone: 'dark'  },
  { id: 'fd_thigh_back',  file: 'female_dark_thigh_back.png',   label: 'Thigh Back',   gender: 'female', tone: 'dark'  },
  { id: 'ml_full',        file: 'male_light_full.png',          label: 'Full Body',    gender: 'male',   tone: 'light' },
  { id: 'ml_back',        file: 'male_light_back.png',          label: 'Upper Back',   gender: 'male',   tone: 'light' },
  { id: 'ml_upperarm',    file: 'male_light_upperarm.png',      label: 'Upper Arm',    gender: 'male',   tone: 'light' },
  { id: 'ml_shoulder',    file: 'male_light_shoulder.png',      label: 'Shoulder',     gender: 'male',   tone: 'light' },
  { id: 'ml_chest',       file: 'male_light_chest.png',         label: 'Chest',        gender: 'male',   tone: 'light' },
  { id: 'ml_ribcage',     file: 'male_light_ribcage.png',       label: 'Ribcage',      gender: 'male',   tone: 'light' },
  { id: 'ml_wrist_up',    file: 'male_light_wrist_up.png',      label: 'Wrist (Top)',  gender: 'male',   tone: 'light' },
  { id: 'ml_wrist_down',  file: 'male_light_wrist_down.png',    label: 'Wrist (Palm)', gender: 'male',   tone: 'light' },
  { id: 'ml_ankle',       file: 'male_light_ankle.png',         label: 'Ankle',        gender: 'male',   tone: 'light' },
  { id: 'ml_thigh',       file: 'male_light_thigh.png',         label: 'Thigh',        gender: 'male',   tone: 'light' },
  { id: 'md_full',        file: 'male_dark_full.png',           label: 'Full Body',    gender: 'male',   tone: 'dark'  },
  { id: 'md_back',        file: 'male_dark_back.png',           label: 'Upper Back',   gender: 'male',   tone: 'dark'  },
  { id: 'md_upperarm',    file: 'male_dark_upperarm.png',       label: 'Upper Arm',    gender: 'male',   tone: 'dark'  },
  { id: 'md_shoulder',    file: 'male_dark_shoulder.png',       label: 'Shoulder',     gender: 'male',   tone: 'dark'  },
  { id: 'md_chest',       file: 'male_dark_chest.png',          label: 'Chest',        gender: 'male',   tone: 'dark'  },
  { id: 'md_ribcage',     file: 'male_dark_ribcage.png',        label: 'Ribcage',      gender: 'male',   tone: 'dark'  },
  { id: 'md_wrist_up',    file: 'male_dark_wrist_up.png',       label: 'Wrist (Top)',  gender: 'male',   tone: 'dark'  },
  { id: 'md_wrist_down',  file: 'male_dark_wrist_down.png',     label: 'Wrist (Palm)', gender: 'male',   tone: 'dark'  },
  { id: 'md_ankle',       file: 'male_dark_ankle.png',          label: 'Ankle',        gender: 'male',   tone: 'dark'  },
  { id: 'md_thigh',       file: 'male_dark_thigh.png',          label: 'Thigh',        gender: 'male',   tone: 'dark'  },
]

// Load image — crossOrigin required for canvas pixel operations
function loadImg(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

// FIX 2: Convert black/white mask PNG into alpha mask
// destination-in uses ALPHA channel, not visible colour
// White pixels (brightness > 128) → alpha 255 (keep tattoo)
// Black pixels (brightness ≤ 128) → alpha 0 (cut tattoo)
function makeAlphaMask(maskImg) {
  const w = maskImg.naturalWidth || maskImg.width
  const h = maskImg.naturalHeight || maskImg.height
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const ctx = c.getContext('2d')
  ctx.drawImage(maskImg, 0, 0, w, h)
  const id = ctx.getImageData(0, 0, w, h)
  const d = id.data
  for (let i = 0; i < d.length; i += 4) {
    const brightness = (d[i] + d[i+1] + d[i+2]) / 3
    const alpha = brightness > 128 ? 255 : 0
    d[i] = 255; d[i+1] = 255; d[i+2] = 255; d[i+3] = alpha
  }
  ctx.putImageData(id, 0, 0)
  return c
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
    const bot = (h-1)*w+x; if (!vis[bot] && isWhite(bot*4)) { q.push(bot); vis[bot]=1 }
  }
  for (let y = 0; y < h; y++) {
    const l = y*w; if (!vis[l] && isWhite(l*4)) { q.push(l); vis[l]=1 }
    const r = y*w+(w-1); if (!vis[r] && isWhite(r*4)) { q.push(r); vis[r]=1 }
  }
  while (q.length) {
    const px = q.shift(); d[px*4+3] = 0
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
  const c = document.createElement('canvas'); c.width=60; c.height=60
  const ctx = c.getContext('2d'); ctx.drawImage(imgEl, 0, 0, 60, 60)
  const d = ctx.getImageData(0, 0, 60, 60).data
  let total = 0, count = 0
  for (let i = 0; i < d.length; i += 4) {
    if (d[i+3] < 128) continue
    total += Math.max(d[i],d[i+1],d[i+2]) - Math.min(d[i],d[i+1],d[i+2])
    count++
  }
  return count > 0 && (total/count) > 30
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

// ─── EXPERIMENTAL MESH WARP PRESETS ──────────────────────────────────────
// These presets are only for testing the first 3 male/light templates.
// If a template is not listed here, the try-on behaves exactly as before.
const WARP_PRESETS = {
  ml_wrist_up: {
    type: 'cylinder',
    label: 'Forearm cylinder',
    axisAngle: 72,      // direction of the limb in screen/canvas space
    strength: 0.18,
    grid: 36,
  },
  ml_upperarm: {
    type: 'cylinder',
    label: 'Upper-arm cylinder',
    axisAngle: 86,
    strength: 0.20,
    grid: 36,
  },
  ml_shoulder: {
    type: 'bulge',
    label: 'Shoulder bulge',
    strength: 0.16,
    grid: 38,
  },
}

function applyMeshWarp(sourceCanvas, preset, options = {}) {
  if (!preset || preset.type === 'flat') return sourceCanvas

  const strength = (preset.strength || 0) * (options.multiplier ?? 1)
  if (strength <= 0) return sourceCanvas

  const w = sourceCanvas.width
  const h = sourceCanvas.height
  const out = document.createElement('canvas')
  out.width = w
  out.height = h

  const octx = out.getContext('2d')
  octx.clearRect(0, 0, w, h)
  octx.imageSmoothingEnabled = true
  octx.imageSmoothingQuality = 'high'

  const grid = preset.grid || 32
  const cols = grid
  const rows = Math.max(12, Math.round(grid * h / w))
  const cellW = w / cols
  const cellH = h / rows

  const tx = options.tx ?? w / 2
  const ty = options.ty ?? h / 2
  const targetW = Math.max(1, options.targetW || w * 0.25)
  const targetH = Math.max(1, options.targetH || targetW)

  const axisAngle = ((preset.axisAngle ?? 90) * Math.PI) / 180
  const ax = Math.cos(axisAngle)
  const ay = Math.sin(axisAngle)
  const px = -Math.sin(axisAngle)
  const py = Math.cos(axisAngle)

  // Small overlap avoids hairline cracks between warped tiles.
  const overlap = 1.25

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const sx = col * cellW
      const sy = row * cellH
      const sw = Math.min(cellW + overlap, w - sx)
      const sh = Math.min(cellH + overlap, h - sy)

      const cx = sx + cellW / 2
      const cy = sy + cellH / 2
      const lx = cx - tx
      const ly = cy - ty

      let dx = 0
      let dy = 0

      if (preset.type === 'cylinder') {
        // Convert canvas coordinates into limb-local coordinates.
        // along = direction of arm/leg, cross = across the round surface.
        const along = (lx * ax + ly * ay) / (targetH * 0.75)
        const cross = (lx * px + ly * py) / (targetW * 0.55)

        // Keep warp strongest around the tattoo area and fade at edges.
        const alongFalloff = Math.max(0, 1 - Math.abs(along) * 0.65)
        const crossAbs = Math.min(1.25, Math.abs(cross))
        const side = Math.sign(cross) * crossAbs

        // Pull side areas slightly toward the center to mimic wrapping.
        const pull = -side * crossAbs * targetW * strength * 0.18 * alongFalloff

        // Add a tiny wave along the limb so it does not feel perfectly flat.
        const curve = Math.sin(side * Math.PI) * targetW * strength * 0.025 * alongFalloff

        dx += px * pull + ax * curve
        dy += py * pull + ay * curve
      } else if (preset.type === 'bulge') {
        const nx = lx / (targetW * 0.62)
        const ny = ly / (targetH * 0.62)
        const dist = Math.sqrt(nx * nx + ny * ny)
        const falloff = Math.max(0, 1 - dist)
        const push = targetW * strength * 0.11 * falloff * falloff

        // Rounded shoulder/cap effect: center stays stable, edges subtly bend.
        dx += nx * push
        dy += ny * push * 0.55
      } else if (preset.type === 'perspective') {
        const nx = lx / (targetW * 0.7)
        const ny = ly / (targetH * 0.7)
        const falloff = Math.max(0, 1 - Math.abs(nx) * 0.55 - Math.abs(ny) * 0.35)
        dx += nx * targetW * strength * 0.08 * falloff
        dy += -nx * targetH * strength * 0.035 * falloff
      }

      octx.drawImage(
        sourceCanvas,
        sx, sy, sw, sh,
        sx + dx, sy + dy, sw + overlap, sh + overlap
      )
    }
  }

  return out
}

export default function TryOnPage() {
  const [mode, setMode] = useState('pick')
  const [gender, setGender] = useState('male')
  const [tone, setTone] = useState('light')
  const [loadingTemplate, setLoadingTemplate] = useState(null)
  const [tattooClean, setTattooClean] = useState(null)
  const [tattooLoaded, setTattooLoaded] = useState(false)
  const [isColoured, setIsColoured] = useState(false)
  const [hasMask, setHasMask] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [error, setError] = useState(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)
  const [warpAmount, setWarpAmount] = useState(1)

  // FIX 1: Store template dims in state — canvas sized AFTER place mode renders
  const [templateDims, setTemplateDims] = useState(null)

  // Placement controls
  const [posX, setPosX] = useState(50)
  const [posY, setPosY] = useState(50)
  const [size, setSize] = useState(0.18)   // % of Math.min(cw, ch)
  const [rotation, setRotation] = useState(0)
  const [opacity, setOpacity] = useState(85)
  const [mirror, setMirror] = useState(false)

  const canvasRef      = useRef(null)
  const bgImgRef       = useRef(null)
  const maskRef        = useRef(null)  // alpha mask canvas
  const tattooRef      = useRef(null)
  const dimsRef        = useRef(null)
  const rafRef         = useRef(null)
  const isDragging     = useRef(false)
  const posRef         = useRef({ x: 50, y: 50 })
  const dragOffsetRef  = useRef({ x: 0, y: 0 })

  useEffect(() => { tattooRef.current = tattooClean }, [tattooClean])
  useEffect(() => { dimsRef.current = templateDims }, [templateDims])
  useEffect(() => {
    posRef.current = { x: posX, y: posY }
  }, [posX, posY])

  // FIX 4: Auto-load tattoo from sessionStorage (generate → tryon flow)
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

  // ─── DRAW ───────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const bg = bgImgRef.current
    const dims = dimsRef.current
    if (!canvas || !bg || !dims) return

    const cw = dims.w
    const ch = dims.h
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(bg, 0, 0, cw, ch)

    const tattoo = tattooRef.current
    if (!tattoo) return

    const tx = (posX / 100) * cw
    const ty = (posY / 100) * ch

    // FIX 3: Size as % of smaller canvas dimension — resolution-independent
    const base = Math.min(cw, ch)
    const targetW = base * size
    const scale = targetW / tattoo.width

    const rad = (rotation * Math.PI) / 180

    // Draw tattoo to temp canvas
    let tmp = document.createElement('canvas')
    tmp.width = cw; tmp.height = ch
    let tctx = tmp.getContext('2d')

    tctx.save()
    tctx.translate(tx, ty)
    tctx.rotate(rad)
    if (mirror) tctx.scale(-scale, scale)
    else tctx.scale(scale, scale)
    tctx.globalAlpha = opacity / 100
    tctx.drawImage(tattoo, -tattoo.width / 2, -tattoo.height / 2)
    tctx.restore()

    // EXPERIMENTAL: Optional mesh warp layer.
    // This runs before mask clipping, so the existing mask still controls containment.
    const warpPreset = selectedTemplateId ? WARP_PRESETS[selectedTemplateId] : null
    const tattooDisplayH = targetW * (tattoo.height / tattoo.width)
    if (warpPreset) {
      tmp = applyMeshWarp(tmp, warpPreset, {
        tx,
        ty,
        targetW,
        targetH: tattooDisplayH,
        multiplier: warpAmount,
      })
      tctx = tmp.getContext('2d')
    }

    // FIX 2: Apply alpha mask — destination-in now works correctly
    // because makeAlphaMask converted white→alpha255, black→alpha0
    const mask = maskRef.current
    if (mask) {
      tctx.globalCompositeOperation = 'destination-in'
      tctx.drawImage(mask, 0, 0, cw, ch)
      tctx.globalCompositeOperation = 'source-over'
    }

    // Composite tattoo onto background with multiply blend
    ctx.globalCompositeOperation = 'multiply'
    ctx.drawImage(tmp, 0, 0)
    ctx.globalCompositeOperation = 'source-over'
  }, [posX, posY, size, rotation, opacity, mirror, selectedTemplateId, warpAmount])

  const scheduleRedraw = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => { rafRef.current = null; draw() })
  }, [draw])

  // FIX 1: Set canvas dimensions AFTER place mode has rendered
  // This ensures canvasRef.current actually exists when we set width/height
  useEffect(() => {
    if (mode !== 'place') return
    if (!templateDims) return
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    canvas.width = templateDims.w
    canvas.height = templateDims.h
    scheduleRedraw()
  }, [mode, templateDims, scheduleRedraw])

  useEffect(() => {
    scheduleRedraw()
  }, [posX, posY, size, rotation, opacity, mirror, tattooClean, selectedTemplateId, warpAmount, scheduleRedraw])

  // ─── LOAD TEMPLATE ──────────────────────────────────────────────────────
  const loadTemplate = async (template) => {
    setLoadingTemplate(template.id)
    setError(null)
    try {
      const maskFile = template.file.replace('.png', '_mask.png')
      const [bgImg, maskImg] = await Promise.all([
        loadImg(`/templates/${template.file}`),
        loadImg(`/templates/${maskFile}`),
      ])
      if (!bgImg) throw new Error('Could not load template')

      bgImgRef.current = bgImg

      // FIX 2: Convert black/white mask to alpha mask
      const alphaMask = maskImg ? makeAlphaMask(maskImg) : null
      maskRef.current = alphaMask
      setHasMask(!!alphaMask)

      // Scale to max 800px wide for performance
      const nw = bgImg.naturalWidth
      const nh = bgImg.naturalHeight
      const maxW = 800
      const w = nw > maxW ? maxW : nw
      const h = nw > maxW ? Math.round(nh * maxW / nw) : nh

      // FIX 1: Store dims in state — canvas sized in useEffect after render
      setTemplateDims({ w, h })

      // Reset placement
      posRef.current = { x: 50, y: 50 }
      setSelectedTemplateId(template.id)
      setWarpAmount(1)
      setPosX(50); setPosY(50)
      setSize(0.18); setRotation(0); setMirror(false)

      // Switch to place mode — canvas renders, then useEffect sets dimensions
      setMode('place')
    } catch (e) {
      setError('Could not load template. Please try again.')
    } finally {
      setLoadingTemplate(null)
    }
  }

  // ─── TATTOO UPLOAD ──────────────────────────────────────────────────────
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

  const clearTattoo = () => {
    setTattooClean(null)
    setTattooLoaded(false)
    setIsColoured(false)
    sessionStorage.removeItem('aigeek_tattoo_url')
  }

  // ─── DRAG ───────────────────────────────────────────────────────────────
  // Pointer Events + pointer capture make dragging feel attached to the cursor/finger.
  // We map the pointer directly to the tattoo center in canvas-percentage coordinates.
  const getPointerPercent = (clientX, clientY) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 50, y: 50 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    }
  }

  const onPointerDown = (e) => {
    e.preventDefault()

    const pointer = getPointerPercent(e.clientX, e.clientY)
    const currentPos = posRef.current

    dragOffsetRef.current = {
      x: pointer.x - currentPos.x,
      y: pointer.y - currentPos.y,
    }

    isDragging.current = true

    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {}
  }

  const onPointerMove = (e) => {
    if (!isDragging.current) return
    e.preventDefault()

    const pointer = getPointerPercent(e.clientX, e.clientY)

    // Allow slight movement outside the canvas so the mask can clip naturally at edges.
    const nextX = clamp(pointer.x - dragOffsetRef.current.x, -20, 120)
    const nextY = clamp(pointer.y - dragOffsetRef.current.y, -20, 120)

    posRef.current = { x: nextX, y: nextY }

    setPosX(nextX)
    setPosY(nextY)
  }

  const onPointerUp = (e) => {
    isDragging.current = false

    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {}
  }

  // ─── RENDER HANDOFF ─────────────────────────────────────────────────────
  const handleRender = () => {
    const canvas = canvasRef.current; if (!canvas) return
    sessionStorage.setItem('aigeek_composite', canvas.toDataURL('image/jpeg', 0.88))
    sessionStorage.setItem('aigeek_composite_w', canvas.width)
    sessionStorage.setItem('aigeek_composite_h', canvas.height)
    sessionStorage.setItem('aigeek_is_coloured', isColoured ? '1' : '0')
    window.location.href = '/render'
  }

  const filtered = TEMPLATES.filter(t => t.gender === gender && t.tone === tone)

  const SliderRow = ({ label, value, min, max, step, onChange, display }) => (
    <div style={{ marginBottom: '0.875rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <label style={{ fontSize: '0.78rem', color: '#555', fontWeight: '600' }}>{label}</label>
        <span style={{ fontSize: '0.75rem', color: '#888', minWidth: '42px', textAlign: 'right' }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#111' }} />
    </div>
  )

  return (
    <main style={{ fontFamily: 'system-ui,-apple-system,sans-serif', maxWidth: '680px', margin: '0 auto', padding: '0 1rem' }}>

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
          <div style={{ background: tattooLoaded ? '#f0fdf4' : '#fffbeb', border: '1px solid ' + (tattooLoaded ? '#bbf7d0' : '#fde68a'), borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '0.82rem', fontWeight: '600', color: tattooLoaded ? '#166534' : '#92400e', margin: 0 }}>
                {tattooLoaded ? '✓ Tattoo design ready' : '⚠ No tattoo design loaded'}
              </p>
              <p style={{ fontSize: '0.72rem', color: '#888', margin: '2px 0 0' }}>
                {tattooLoaded ? 'Select a body template below' : 'Upload a design or generate one first'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {tattooLoaded && (
                <button onClick={clearTattoo} style={{ background: 'none', border: 'none', fontSize: '0.72rem', color: '#999', cursor: 'pointer', textDecoration: 'underline' }}>
                  Clear
                </button>
              )}
              <label style={{ display: 'inline-block', background: '#111', color: '#fff', padding: '6px 14px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {tattooLoaded ? 'Change design' : 'Upload tattoo'}
                <input type="file" accept="image/*" onChange={handleTattooUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            {['male', 'female'].map(g => (
              <button key={g} onClick={() => setGender(g)}
                style={{ flex: 1, height: '40px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', border: 'none', background: gender === g ? '#111' : '#f0f0f0', color: gender === g ? '#fff' : '#555' }}>
                {g === 'male' ? '♂ Male' : '♀ Female'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
            <button onClick={() => setTone('light')}
              style={{ flex: 1, height: '40px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', background: '#F5D5B0', color: '#4a3000', border: '2px solid ' + (tone === 'light' ? '#111' : 'transparent') }}>
              ☀ Light
            </button>
            <button onClick={() => setTone('dark')}
              style={{ flex: 1, height: '40px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', background: '#3D1F0D', color: '#f5d5b0', border: '2px solid ' + (tone === 'dark' ? '#f5d5b0' : 'transparent') }}>
              ✦ Dark
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '1.25rem' }}>
            {filtered.map(t => (
              <div key={t.id}
                onClick={() => {
                  if (!tattooLoaded) { setError('Upload a tattoo design first.'); return }
                  setError(null); loadTemplate(t)
                }}
                style={{ borderRadius: '10px', overflow: 'hidden', border: '2px solid ' + (tattooLoaded ? '#e5e5e5' : '#f0f0f0'), cursor: tattooLoaded ? 'pointer' : 'not-allowed', background: '#f5f5f5', position: 'relative', aspectRatio: '2/3' }}
                onMouseEnter={e => { if (tattooLoaded) e.currentTarget.style.borderColor = '#111' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = tattooLoaded ? '#e5e5e5' : '#f0f0f0' }}>
                <img src={`/templates/${t.file}`} alt={t.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: tattooLoaded ? 1 : 0.5 }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent,rgba(0,0,0,0.72))', padding: '16px 6px 7px' }}>
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
          {!hasMask && (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.55rem 1rem', marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#92400e', margin: 0 }}>
                ⚠ No skin mask for this template yet — tattoo will show everywhere. Masks being added progressively.
              </p>
            </div>
          )}

          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e5e5', marginBottom: '1rem', touchAction: 'none', userSelect: 'none', background: '#f0f0f0', lineHeight: 0, position: 'relative' }}>
            <canvas ref={canvasRef}
              style={{ width: '100%', display: 'block', cursor: 'grab', touchAction: 'none' }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onLostPointerCapture={onPointerUp} />
            <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.7rem', padding: '4px 12px', borderRadius: '999px', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
              Drag to reposition
            </div>
          </div>

          <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1rem 1rem 0.25rem', marginBottom: '1rem' }}>
            <SliderRow label="Size" value={size} min={0.04} max={0.65} step={0.005} onChange={setSize} display={`${Math.round(size * 100)}%`} />
            <SliderRow label="Rotation" value={rotation} min={-180} max={180} step={1} onChange={setRotation} display={`${rotation}°`} />
            <SliderRow label="Opacity" value={opacity} min={10} max={100} step={1} onChange={setOpacity} display={`${opacity}%`} />
            {selectedTemplateId && WARP_PRESETS[selectedTemplateId] && (
              <SliderRow label="Warp" value={warpAmount} min={0} max={1.5} step={0.05} onChange={setWarpAmount} display={`${Math.round(warpAmount * 100)}%`} />
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.875rem', borderTop: '1px solid #f0f0f0', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#555', fontWeight: '600' }}>↔ Mirror flip</span>
              <button onClick={() => setMirror(m => !m)}
                style={{ width: '48px', height: '26px', borderRadius: '999px', border: 'none', background: mirror ? '#111' : '#ddd', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                <div style={{ position: 'absolute', top: '3px', left: mirror ? '25px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', paddingBottom: '0.875rem' }}>
              <button onClick={() => setRotation(0)}
                style={{ flex: 1, height: '34px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.75rem', color: '#555', cursor: 'pointer' }}>
                ↺ Reset rotation
              </button>
              <button onClick={() => { posRef.current = { x: 50, y: 50 }; setWarpAmount(1); setSize(0.18); setRotation(0); setMirror(false); setPosX(50); setPosY(50) }}
                style={{ flex: 1, height: '34px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.75rem', color: '#555', cursor: 'pointer' }}>
                ⊙ Reset all
              </button>
              <label style={{ flex: 1, height: '34px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.75rem', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                🎨 Change
                <input type="file" accept="image/*" onChange={handleTattooUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

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
