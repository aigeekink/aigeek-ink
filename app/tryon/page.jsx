'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// ─── TEMPLATE LIST ────────────────────────────────────────────────────────────
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

// ─── WARP PRESETS ─────────────────────────────────────────────────────────────
// Each preset defines the warp type and parameters at strength=1.0
// strength slider scales curve/bulge/topScale/bottomScale linearly
// No dynamic widthScale — tattoo size stays fully user-controlled
const WARP_PRESETS = {
  // ── CYLINDER: forearms and upper arms ────────────────────────────────────
  // Horizontal slice-based compression: center slices wider, edge slices narrower
  // Creates the illusion of wrapping around a cylindrical surface
  fl_wrist_up:   { type: 'cylinder', curve: 0.55, bulge: 0.07, edgeFloor: 0.25, tilt: -0.01, slices: 80 },
  fd_wrist_up:   { type: 'cylinder', curve: 0.55, bulge: 0.07, edgeFloor: 0.25, tilt: -0.01, slices: 80 },
  ml_wrist_up:   { type: 'cylinder', curve: 0.60, bulge: 0.08, edgeFloor: 0.23, tilt: -0.01, slices: 80 },
  md_wrist_up:   { type: 'cylinder', curve: 0.60, bulge: 0.08, edgeFloor: 0.23, tilt: -0.01, slices: 80 },

  fl_wrist_down: { type: 'cylinder', curve: 0.50, bulge: 0.06, edgeFloor: 0.27, tilt: -0.008, slices: 76 },
  fd_wrist_down: { type: 'cylinder', curve: 0.50, bulge: 0.06, edgeFloor: 0.27, tilt: -0.008, slices: 76 },
  ml_wrist_down: { type: 'cylinder', curve: 0.54, bulge: 0.06, edgeFloor: 0.25, tilt: -0.01,  slices: 76 },
  md_wrist_down: { type: 'cylinder', curve: 0.54, bulge: 0.06, edgeFloor: 0.25, tilt: -0.01,  slices: 76 },

  fl_upperarm:   { type: 'cylinder', curve: 0.46, bulge: 0.10, edgeFloor: 0.28, tilt: 0.0,   slices: 88 },
  fd_upperarm:   { type: 'cylinder', curve: 0.46, bulge: 0.10, edgeFloor: 0.28, tilt: 0.0,   slices: 88 },
  ml_upperarm:   { type: 'cylinder', curve: 0.50, bulge: 0.11, edgeFloor: 0.26, tilt: 0.0,   slices: 88 },
  md_upperarm:   { type: 'cylinder', curve: 0.50, bulge: 0.11, edgeFloor: 0.26, tilt: 0.0,   slices: 88 },

  // ── BULGE: rounded convex surfaces ────────────────────────────────────────
  // Both horizontal AND vertical compression toward edges
  // Works for shoulder caps, chest, ribcage — domed surfaces
  ml_shoulder:   { type: 'bulge', curve: 0.40, bulge: 0.16, edgeFloor: 0.35, lift: 0.04, slices: 84 },
  md_shoulder:   { type: 'bulge', curve: 0.40, bulge: 0.16, edgeFloor: 0.35, lift: 0.04, slices: 84 },

  ml_chest:      { type: 'bulge', curve: 0.26, bulge: 0.11, edgeFloor: 0.46, lift: 0.02, slices: 88 },
  md_chest:      { type: 'bulge', curve: 0.26, bulge: 0.11, edgeFloor: 0.46, lift: 0.02, slices: 88 },

  fl_sternum:    { type: 'bulge', curve: 0.22, bulge: 0.08, edgeFloor: 0.50, lift: 0.015, slices: 84 },
  fd_sternum:    { type: 'bulge', curve: 0.22, bulge: 0.08, edgeFloor: 0.50, lift: 0.015, slices: 84 },

  fl_ribcage:    { type: 'bulge', curve: 0.20, bulge: 0.08, edgeFloor: 0.50, lift: 0.01, slices: 84 },
  fd_ribcage:    { type: 'bulge', curve: 0.20, bulge: 0.08, edgeFloor: 0.50, lift: 0.01, slices: 84 },
  ml_ribcage:    { type: 'bulge', curve: 0.22, bulge: 0.09, edgeFloor: 0.48, lift: 0.01, slices: 86 },
  md_ribcage:    { type: 'bulge', curve: 0.22, bulge: 0.09, edgeFloor: 0.48, lift: 0.01, slices: 86 },

  // ── PERSPECTIVE: tapered limbs and flat-with-angle surfaces ───────────────
  // Row-by-row horizontal scaling — wider at top or bottom depending on viewing angle
  // Works for ankles (side view), thighs (slightly tapered), collarbone (flat-ish chest)
  fl_ankle:      { type: 'perspective', topScale: 0.94, bottomScale: 1.10, topShift:  0.00, bottomShift: 0.00, rows: 56 },
  fd_ankle:      { type: 'perspective', topScale: 0.94, bottomScale: 1.10, topShift:  0.00, bottomShift: 0.00, rows: 56 },
  ml_ankle:      { type: 'perspective', topScale: 0.92, bottomScale: 1.12, topShift: -0.01, bottomShift: 0.01, rows: 56 },
  md_ankle:      { type: 'perspective', topScale: 0.92, bottomScale: 1.12, topShift: -0.01, bottomShift: 0.01, rows: 56 },

  fl_thigh_front:{ type: 'perspective', topScale: 1.10, bottomScale: 0.94, topShift:  0.02, bottomShift: -0.01, rows: 60 },
  fd_thigh_front:{ type: 'perspective', topScale: 1.10, bottomScale: 0.94, topShift:  0.02, bottomShift: -0.01, rows: 60 },
  fl_thigh_back: { type: 'perspective', topScale: 1.08, bottomScale: 0.96, topShift:  0.01, bottomShift: -0.01, rows: 60 },
  fd_thigh_back: { type: 'perspective', topScale: 1.08, bottomScale: 0.96, topShift:  0.01, bottomShift: -0.01, rows: 60 },
  ml_thigh:      { type: 'perspective', topScale: 1.10, bottomScale: 0.94, topShift:  0.02, bottomShift: -0.01, rows: 60 },
  md_thigh:      { type: 'perspective', topScale: 1.10, bottomScale: 0.94, topShift:  0.02, bottomShift: -0.01, rows: 60 },

  // Neckbone = collarbone/chest from front — very subtle perspective only
  fl_neckbone:   { type: 'perspective', topScale: 1.02, bottomScale: 0.98, topShift: 0.0, bottomShift: 0.0, rows: 48 },
  fd_neckbone:   { type: 'perspective', topScale: 1.02, bottomScale: 0.98, topShift: 0.0, bottomShift: 0.0, rows: 48 },

  // ── FLAT: mostly flat or full-body templates ───────────────────────────────
  fl_back:       { type: 'flat' },
  fd_back:       { type: 'flat' },
  ml_back:       { type: 'flat' },
  md_back:       { type: 'flat' },
  fl_full:       { type: 'flat' },
  fd_full:       { type: 'flat' },
  ml_full:       { type: 'flat' },
  md_full:       { type: 'flat' },
}

// ─── WARP DRAWING FUNCTIONS ───────────────────────────────────────────────────

// Pre-render tattoo at target size onto a stamp canvas
// Mirror is applied here so warp functions receive an already-mirrored stamp
function buildStamp(tattoo, targetW, mirror) {
  const scale = targetW / tattoo.width
  const sw = Math.max(2, Math.round(tattoo.width * scale))
  const sh = Math.max(2, Math.round(tattoo.height * scale))
  const c = document.createElement('canvas')
  c.width = sw; c.height = sh
  const ctx = c.getContext('2d')
  if (mirror) {
    ctx.translate(sw, 0)
    ctx.scale(-1, 1)
  }
  ctx.drawImage(tattoo, 0, 0, sw, sh)
  return c
}

// flat: simple centered draw, no distortion
function drawFlat(ctx, stamp, opacity) {
  ctx.save()
  ctx.globalAlpha = opacity / 100
  ctx.drawImage(stamp, -stamp.width / 2, -stamp.height / 2)
  ctx.restore()
}

// cylinder: horizontal slice-based compression
// Slices at the edges are narrower than at the center, simulating wrapping
// strength scales curve (how much compression at edges) and bulge (vertical stretch at center)
function drawCylinder(ctx, stamp, opacity, preset, strength) {
  const sw = stamp.width
  const sh = stamp.height
  const curve    = (preset.curve    ?? 0.45) * strength
  const bulge    = (preset.bulge    ?? 0.08) * strength
  const edgeFloor = preset.edgeFloor ?? 0.30  // min width ratio even at edges — not scaled
  const tilt      = preset.tilt      ?? 0.0   // vertical shift per slice — not scaled
  const slices    = preset.slices    ?? Math.max(60, Math.round(sw / 6))

  // Pre-compute cosine-based weights for each slice
  // Weight determines how wide each destination slice is
  const weights = []
  let weightSum = 0
  for (let i = 0; i < slices; i++) {
    const u = (i + 0.5) / slices
    const centered = (u - 0.5) * 2          // -1 at left edge, +1 at right edge
    const edge = Math.abs(centered)
    const cosine = Math.cos(edge * Math.PI * 0.5)
    const shaped = Math.pow(Math.max(0, cosine), 1 + curve * 2.0)
    const w = edgeFloor + (1 - edgeFloor) * shaped
    weights.push(w)
    weightSum += w
  }

  ctx.save()
  ctx.globalAlpha = opacity / 100
  let destX = -sw / 2

  for (let i = 0; i < slices; i++) {
    const srcX = Math.floor((i * sw) / slices)
    const nextX = Math.floor(((i + 1) * sw) / slices)
    const srcW = Math.max(1, nextX - srcX)

    const u = (i + 0.5) / slices
    const centered = (u - 0.5) * 2
    const curveFactor = 1 - centered * centered   // 0 at edges, 1 at center

    const destW  = sw * (weights[i] / weightSum)
    const destH  = sh * (1 + bulge * curveFactor)
    const destY  = (-destH / 2) + (tilt * centered * sh)

    ctx.drawImage(stamp, srcX, 0, srcW, sh, destX, destY, destW + 0.5, destH)
    destX += destW
  }
  ctx.restore()
}

// bulge: radially symmetric — compresses both horizontally AND vertically at edges
// Used for shoulder caps, chest, ribcage — domed convex surfaces
function drawBulge(ctx, stamp, opacity, preset, strength) {
  const sw = stamp.width
  const sh = stamp.height
  const curve    = (preset.curve    ?? 0.28) * strength
  const bulge    = (preset.bulge    ?? 0.10) * strength
  const lift     = (preset.lift     ?? 0.015) * strength
  const edgeFloor = preset.edgeFloor ?? 0.45
  const slices    = preset.slices    ?? Math.max(56, Math.round(sw / 6))

  const weights = []
  let weightSum = 0
  for (let i = 0; i < slices; i++) {
    const u = (i + 0.5) / slices
    const centered = (u - 0.5) * 2
    const edge = Math.abs(centered)
    const shaped = Math.pow(Math.max(0, Math.cos(edge * Math.PI * 0.5)), 1 + curve * 1.5)
    const w = edgeFloor + (1 - edgeFloor) * shaped
    weights.push(w)
    weightSum += w
  }

  ctx.save()
  ctx.globalAlpha = opacity / 100
  let destX = -sw / 2

  for (let i = 0; i < slices; i++) {
    const srcX = Math.floor((i * sw) / slices)
    const nextX = Math.floor(((i + 1) * sw) / slices)
    const srcW = Math.max(1, nextX - srcX)

    const u = (i + 0.5) / slices
    const centered = (u - 0.5) * 2
    const curveFactor = 1 - centered * centered

    const destW = sw * (weights[i] / weightSum)
    const destH = sh * (1 + bulge * curveFactor)
    const destY = (-destH / 2) - (lift * curveFactor * sh)

    ctx.drawImage(stamp, srcX, 0, srcW, sh, destX, destY, destW + 0.5, destH)
    destX += destW
  }
  ctx.restore()
}

// perspective: row-by-row horizontal scaling
// Each row can be wider or narrower than the tattoo's natural width
// Used for ankles, thighs, collarbone — slightly tapered or angled surfaces
function drawPerspective(ctx, stamp, opacity, preset, strength) {
  const sw = stamp.width
  const sh = stamp.height
  // Blend from flat (1.0) toward preset values based on strength
  const topScale    = 1 + (( preset.topScale    ?? 1.0) - 1) * strength
  const bottomScale = 1 + (( preset.bottomScale ?? 1.0) - 1) * strength
  const topShift    = (preset.topShift    ?? 0) * strength
  const bottomShift = (preset.bottomShift ?? 0) * strength
  const rows        = preset.rows ?? Math.max(40, Math.round(sh / 7))

  ctx.save()
  ctx.globalAlpha = opacity / 100

  for (let i = 0; i < rows; i++) {
    const v0 = i / rows
    const v1 = (i + 1) / rows
    const srcY = Math.floor(v0 * sh)
    const nextY = Math.floor(v1 * sh)
    const srcH = Math.max(1, nextY - srcY)
    const t = (v0 + v1) * 0.5   // normalized row position 0=top 1=bottom

    const rowScale = topScale + (bottomScale - topScale) * t
    const rowShift = topShift + (bottomShift - topShift) * t
    const rowW = sw * rowScale
    const destX = (-rowW / 2) + (rowShift * sw)
    const destY = -sh / 2 + (v0 * sh)

    ctx.drawImage(stamp, 0, srcY, sw, srcH, destX, destY, rowW, srcH + 0.5)
  }
  ctx.restore()
}

// Dispatcher — routes to correct draw function based on preset type
// strength = 0.0 means flat (all warp functions blend toward flat at strength=0)
function drawWarped(ctx, stamp, opacity, preset, strength) {
  if (!preset || strength === 0) {
    drawFlat(ctx, stamp, opacity)
    return
  }
  switch (preset.type) {
    case 'cylinder':    drawCylinder(ctx, stamp, opacity, preset, strength); break
    case 'bulge':       drawBulge(ctx, stamp, opacity, preset, strength);    break
    case 'perspective': drawPerspective(ctx, stamp, opacity, preset, strength); break
    default:            drawFlat(ctx, stamp, opacity)
  }
}

// ─── IMAGE UTILITIES ─────────────────────────────────────────────────────────

function loadImg(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

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

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
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
  const [currentTemplateId, setCurrentTemplateId] = useState(null)
  const [templateDims, setTemplateDims] = useState(null)

  // Placement controls
  const [posX, setPosX] = useState(50)
  const [posY, setPosY] = useState(50)
  const [size, setSize] = useState(0.18)
  const [rotation, setRotation] = useState(0)
  const [opacity, setOpacity] = useState(85)
  const [mirror, setMirror] = useState(false)
  const [warpStrength, setWarpStrength] = useState(0.70)  // 0.0–1.5, default 70%

  const canvasRef     = useRef(null)
  const bgImgRef      = useRef(null)
  const maskRef       = useRef(null)
  const tattooRef     = useRef(null)
  const dimsRef       = useRef(null)
  const warpRef       = useRef(0.70)
  const rafRef        = useRef(null)
  const isDragging    = useRef(false)
  const posRef        = useRef({ x: 50, y: 50 })
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  useEffect(() => { tattooRef.current = tattooClean }, [tattooClean])
  useEffect(() => { dimsRef.current = templateDims }, [templateDims])
  useEffect(() => { posRef.current = { x: posX, y: posY } }, [posX, posY])
  useEffect(() => { warpRef.current = warpStrength }, [warpStrength])

  // Auto-load tattoo from sessionStorage (generate → tryon flow)
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

  // ─── DRAW ───────────────────────────────────────────────────────────────────
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
    const rad = (rotation * Math.PI) / 180

    // Size is % of shorter canvas dimension — resolution-independent, never changes during drag
    const base = Math.min(cw, ch)
    const targetW = base * size
    const stamp = buildStamp(tattoo, targetW, mirror)

    // Get warp preset for current template
    const preset = WARP_PRESETS[currentTemplateId] ?? { type: 'flat' }
    const strength = warpRef.current

    // Draw pipeline:
    // 1. Draw warped tattoo onto temp canvas
    // 2. Apply skin mask (destination-in) — clips to white areas only
    // 3. Composite onto background with multiply blend
    const tmp = document.createElement('canvas')
    tmp.width = cw; tmp.height = ch
    const tctx = tmp.getContext('2d')

    tctx.save()
    tctx.translate(tx, ty)
    tctx.rotate(rad)
    drawWarped(tctx, stamp, opacity, preset, strength)
    tctx.restore()

    // Mask clip — tattoo only shows on white skin areas
    const mask = maskRef.current
    if (mask) {
      tctx.globalCompositeOperation = 'destination-in'
      tctx.drawImage(mask, 0, 0, cw, ch)
      tctx.globalCompositeOperation = 'source-over'
    }

    // Multiply blend — ink darkens skin naturally
    ctx.globalCompositeOperation = 'multiply'
    ctx.drawImage(tmp, 0, 0)
    ctx.globalCompositeOperation = 'source-over'
  }, [currentTemplateId, posX, posY, size, rotation, opacity, mirror])

  const scheduleRedraw = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => { rafRef.current = null; draw() })
  }, [draw])

  // Set canvas dimensions AFTER place mode renders — canvasRef.current exists then
  useEffect(() => {
    if (mode !== 'place' || !templateDims || !canvasRef.current) return
    const canvas = canvasRef.current
    canvas.width = templateDims.w
    canvas.height = templateDims.h
    scheduleRedraw()
  }, [mode, templateDims, scheduleRedraw])

  useEffect(() => {
    scheduleRedraw()
  }, [posX, posY, size, rotation, opacity, mirror, warpStrength, tattooClean, scheduleRedraw])

  // ─── LOAD TEMPLATE ──────────────────────────────────────────────────────────
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
      maskRef.current = maskImg ? makeAlphaMask(maskImg) : null
      setHasMask(!!maskImg)
      setCurrentTemplateId(template.id)

      const nw = bgImg.naturalWidth
      const nh = bgImg.naturalHeight
      const maxW = 800
      const w = nw > maxW ? maxW : nw
      const h = nw > maxW ? Math.round(nh * maxW / nw) : nh
      setTemplateDims({ w, h })

      posRef.current = { x: 50, y: 50 }
      setPosX(50); setPosY(50)
      setSize(0.18); setRotation(0); setMirror(false)
      setMode('place')
    } catch {
      setError('Could not load template. Please try again.')
    } finally {
      setLoadingTemplate(null)
    }
  }

  // ─── TATTOO UPLOAD ──────────────────────────────────────────────────────────
  const handleTattooUpload = (e) => {
    const file = e.target.files[0]; if (!file) return
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
    setTattooClean(null); setTattooLoaded(false); setIsColoured(false)
    sessionStorage.removeItem('aigeek_tattoo_url')
  }

  // ─── POINTER DRAG ───────────────────────────────────────────────────────────
  const getPointerPercent = (clientX, clientY) => {
    const canvas = canvasRef.current; if (!canvas) return { x: 50, y: 50 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    }
  }

  const onPointerDown = (e) => {
    e.preventDefault()
    const pointer = getPointerPercent(e.clientX, e.clientY)
    const cur = posRef.current
    dragOffsetRef.current = { x: pointer.x - cur.x, y: pointer.y - cur.y }
    isDragging.current = true
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch {}
  }

  const onPointerMove = (e) => {
    if (!isDragging.current) return
    e.preventDefault()
    const pointer = getPointerPercent(e.clientX, e.clientY)
    const nextX = clamp(pointer.x - dragOffsetRef.current.x, -20, 120)
    const nextY = clamp(pointer.y - dragOffsetRef.current.y, -20, 120)
    posRef.current = { x: nextX, y: nextY }
    setPosX(nextX); setPosY(nextY)
  }

  const onPointerUp = (e) => {
    isDragging.current = false
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch {}
  }

  // ─── RENDER HANDOFF ─────────────────────────────────────────────────────────
  const handleRender = () => {
    const canvas = canvasRef.current; if (!canvas) return
    sessionStorage.setItem('aigeek_composite', canvas.toDataURL('image/jpeg', 0.88))
    sessionStorage.setItem('aigeek_composite_w', canvas.width)
    sessionStorage.setItem('aigeek_composite_h', canvas.height)
    sessionStorage.setItem('aigeek_is_coloured', isColoured ? '1' : '0')
    window.location.href = '/render'
  }

  const filtered = TEMPLATES.filter(t => t.gender === gender && t.tone === tone)
  const activePreset = WARP_PRESETS[currentTemplateId] ?? { type: 'flat' }
  const activeWarpLabel = activePreset.type === 'flat' ? 'Flat' :
    activePreset.type === 'cylinder' ? 'Cylinder' :
    activePreset.type === 'bulge' ? 'Bulge' : 'Perspective'

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

  // ─── RENDER ─────────────────────────────────────────────────────────────────
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
                <button onClick={clearTattoo} style={{ background: 'none', border: 'none', fontSize: '0.72rem', color: '#999', cursor: 'pointer', textDecoration: 'underline' }}>Clear</button>
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
                <img src={`/templates/${t.file}`} alt={t.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: tattooLoaded ? 1 : 0.5 }} />
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
                ⚠ No skin mask for this template yet — tattoo shows everywhere. Masks being added progressively.
              </p>
            </div>
          )}

          {/* Canvas */}
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

          {/* Controls */}
          <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1rem 1rem 0.25rem', marginBottom: '1rem' }}>

            {/* Warp preset indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#888' }}>Surface warp</span>
              <span style={{ fontSize: '0.73rem', color: '#111', fontWeight: '700', background: '#f0f0f0', padding: '3px 10px', borderRadius: '999px' }}>
                {activeWarpLabel}
              </span>
            </div>

            <SliderRow label="Size" value={size} min={0.04} max={0.65} step={0.005} onChange={setSize} display={`${Math.round(size * 100)}%`} />
            <SliderRow label="Rotation" value={rotation} min={-180} max={180} step={1} onChange={setRotation} display={`${rotation}°`} />
            <SliderRow label="Opacity" value={opacity} min={10} max={100} step={1} onChange={setOpacity} display={`${opacity}%`} />
            <SliderRow
              label="Warp strength"
              value={warpStrength}
              min={0} max={1.5} step={0.05}
              onChange={setWarpStrength}
              display={warpStrength === 0 ? 'Off' : `${Math.round(warpStrength * 100)}%`}
            />

            {/* Mirror toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.875rem', borderTop: '1px solid #f0f0f0', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#555', fontWeight: '600' }}>↔ Mirror flip</span>
              <button onClick={() => setMirror(m => !m)}
                style={{ width: '48px', height: '26px', borderRadius: '999px', border: 'none', background: mirror ? '#111' : '#ddd', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                <div style={{ position: 'absolute', top: '3px', left: mirror ? '25px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </button>
            </div>

            {/* Quick buttons */}
            <div style={{ display: 'flex', gap: '8px', paddingBottom: '0.875rem' }}>
              <button onClick={() => setRotation(0)}
                style={{ flex: 1, height: '34px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.75rem', color: '#555', cursor: 'pointer' }}>
                ↺ Reset rotation
              </button>
              <button onClick={() => { posRef.current={x:50,y:50}; setSize(0.18); setRotation(0); setMirror(false); setWarpStrength(0.70); setPosX(50); setPosY(50) }}
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
