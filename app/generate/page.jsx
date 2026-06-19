'use client'

import { useState, useEffect } from 'react'

// Model definitions with style options per model
const MODELS = [
  {
    id: 'gpt-image-2',
    name: 'AIGeek Default',
    poweredBy: 'GPT Image 2',
    description: 'Best all-rounder for clean, accurate, stencil-friendly tattoo concepts.',
    recommended: 'Fine line, geometric, blackwork, meaningful custom tattoos',
    credits: 1,
    free: true,
    styles: [
      'Fine Line',
      'Geometric',
      'Blackwork',
      'Minimalist',
      'Neo-Traditional',
      'Dotwork',
    ],
  },
  {
    id: 'flux-2-pro',
    name: 'Bold Ink',
    poweredBy: 'FLUX 2 Pro',
    description: 'Best for dramatic, bold, high-impact tattoo concepts with strong shadows.',
    recommended: 'Blackwork, dark art, neo-traditional, forearm/chest pieces',
    credits: 1,
    free: false,
    styles: [
      'Heavy Blackwork',
      'Dark Art',
      'Tribal',
      'Neo-Traditional',
      'Realistic Dark',
      'Japanese Bold',
    ],
  },
  {
    id: 'seedream-5',
    name: 'Artistic Concept',
    poweredBy: 'Seedream 5',
    description: 'Best for visually rich, creative, Pinterest-style tattoo inspiration.',
    recommended: 'Fantasy, surreal, cyberpunk, painterly, experimental',
    credits: 1,
    free: false,
    styles: [
      'Cyberpunk',
      'Fantasy',
      'Surreal',
      'Floral Painterly',
      'Japanese',
      'Illustrative',
    ],
  },
  {
    id: 'ideogram-3',
    name: 'Lettering Pro',
    poweredBy: 'Ideogram 3',
    description: 'Best for names, dates, quotes, Roman numerals, and typography tattoos.',
    recommended: 'Script tattoos, memorial text, Arabic/English lettering, names',
    credits: 2,
    free: false,
    styles: [
      'Classic Script',
      'Bold Block',
      'Fine Elegant',
      'Gothic',
      'Arabic Calligraphy',
      'Roman Numerals',
    ],
  },
]

const PLACEMENTS = [
  { id: 'forearm', label: 'Forearm' },
  { id: 'wrist', label: 'Wrist' },
  { id: 'shoulder', label: 'Shoulder' },
  { id: 'chest', label: 'Chest' },
  { id: 'ankle', label: 'Ankle' },
  { id: 'back', label: 'Back' },
  { id: 'other', label: 'Other...' },
]

const SIZES = [
  { id: 'small', label: 'Small', sub: 'Under 3"' },
  { id: 'medium', label: 'Medium', sub: '3–5"' },
  { id: 'large', label: 'Large', sub: '5"+ ' },
]

const COLOR_MODES = [
  { id: 'black-ink', label: '⬛ Black ink', free: true },
  { id: 'black-grey', label: '🌑 Black & grey', free: true },
  { id: 'full-colour', label: '🎨 Full colour', free: false, geekOnly: true },
]

const PROMPT_SUGGESTIONS = [
  'Geometric wolf head with mandala patterns',
  'Fine line lotus flower with moon phases',
  'Minimalist mountain range with coordinates',
  'Neo-traditional dragon with cherry blossoms',
  'Blackwork compass rose with ornate details',
  'Simple Roman numerals in elegant script',
]

const LOADING_MESSAGES = [
  'Thinking about your design...',
  'Drawing bold outlines...',
  'Refining line art...',
  'Optimising for stencil...',
  'Almost ready...',
]

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState('gpt-image-2')
  const [selectedStyle, setSelectedStyle] = useState('Fine Line')
  const [selectedPlacement, setSelectedPlacement] = useState('forearm')
  const [customPlacement, setCustomPlacement] = useState('')
  const [selectedSize, setSelectedSize] = useState('medium')
  const [selectedColor, setSelectedColor] = useState('black-ink')
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState('')

  const currentModel = MODELS.find((m) => m.id === selectedModel)

  // Reset style when model changes
  useEffect(() => {
    setSelectedStyle(currentModel.styles[0])
  }, [selectedModel])

  // Loading animation
  useEffect(() => {
    let interval
    let msgIndex = 0
    let progress = 0

    if (isGenerating) {
      setLoadingMessage(LOADING_MESSAGES[0])
      setLoadingProgress(0)
      interval = setInterval(() => {
        progress += 1.5
        setLoadingProgress(Math.min(progress, 90))
        if (progress % 20 === 0) {
          msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length
          setLoadingMessage(LOADING_MESSAGES[msgIndex])
        }
      }, 300)
    }

    return () => clearInterval(interval)
  }, [isGenerating])

  const handleModelClick = (model) => {
    if (model.free) {
      setSelectedModel(model.id)
    } else {
      setUpgradeReason(`${model.name} (${model.poweredBy}) is available in paid packs.`)
      setShowUpgradeModal(true)
    }
  }

  const handleColorClick = (color) => {
    if (color.free) {
      setSelectedColor(color.id)
    } else {
      setUpgradeReason('Full colour generation is exclusive to the Geek Pack.')
      setShowUpgradeModal(true)
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
          style: selectedStyle,
          placement: selectedPlacement,
          customPlacement,
          size: selectedSize,
          colorMode: selectedColor,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Generation failed. Please try again.')
        return
      }

      setResult(data)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '680px', margin: '0 auto', padding: '0 1.5rem' }}>

      {/* Upgrade modal */}
      {showUpgradeModal && (
        <div
          onClick={() => setShowUpgradeModal(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '1.5rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: '16px',
              padding: '2rem', maxWidth: '380px', width: '100%',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔓</div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#111', marginBottom: '0.5rem' }}>Unlock this feature</h2>
            <p style={{ fontSize: '0.88rem', color: '#666', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              {upgradeReason} Get access with any paid pack — plus HD designs, skin renders, and your Artist Handoff PDF.
            </p>
            <a
              href="/pricing"
              style={{
                display: 'block', background: '#111', color: '#fff',
                padding: '12px', borderRadius: '10px',
                textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem',
                marginBottom: '0.75rem',
              }}
            >
              See pricing — from $2.99
            </a>
            <button
              onClick={() => setShowUpgradeModal(false)}
              style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: '1px solid #f0f0f0' }}>
        <a href="/" style={{ fontWeight: '600', fontSize: '1.1rem', letterSpacing: '-0.02em', textDecoration: 'none', color: '#111' }}>aigeek.ink</a>
        <a href="/pricing" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none' }}>Pricing</a>
      </nav>

      {/* Header */}
      <section style={{ padding: '2rem 0 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Generate your tattoo</h1>
        <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: '1.6' }}>Describe your idea, choose your preferences, and our AI builds the perfect prompt for you.</p>
      </section>

      {/* Step 1: Model selector */}
      <section style={{ marginBottom: '1.75rem' }}>
        <p style={{ fontSize: '0.78rem', letterSpacing: '0.06em', color: '#333', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.75rem' }}>
          1 — Choose AI model
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {MODELS.map((model) => (
            <div
              key={model.id}
              onClick={() => handleModelClick(model)}
              style={{
                border: selectedModel === model.id ? '2px solid #111' : '1px solid #e5e5e5',
                borderRadius: '10px',
                padding: '0.875rem',
                cursor: 'pointer',
                position: 'relative',
                background: selectedModel === model.id ? '#fafafa' : '#fff',
                opacity: model.free ? 1 : 0.75,
                transition: 'border 0.15s',
              }}
            >
              {!model.free && (
                <span style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '0.85rem' }}>🔒</span>
              )}
              {model.credits === 2 && (
                <span style={{
                  position: 'absolute', top: '8px', left: '8px',
                  background: '#f0f0f0', color: '#555',
                  fontSize: '0.6rem', padding: '2px 6px', borderRadius: '999px',
                }}>
                  2 credits
                </span>
              )}
              <p style={{ fontWeight: '700', fontSize: '0.88rem', color: '#111', marginBottom: '1px', marginTop: model.credits === 2 ? '1rem' : '0' }}>
                {model.name}
              </p>
              <p style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.4rem', fontStyle: 'italic' }}>
                Powered by {model.poweredBy}
              </p>
              <p style={{ fontSize: '0.78rem', color: '#555', lineHeight: '1.5', marginBottom: '0.35rem' }}>{model.description}</p>
              <p style={{ fontSize: '0.7rem', color: '#999', lineHeight: '1.4' }}>Best for: {model.recommended}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem', textAlign: 'center' }}>🔒 Locked models unlock with any paid pack</p>
      </section>

      {/* Step 2: Style pills */}
      <section style={{ marginBottom: '1.75rem' }}>
        <p style={{ fontSize: '0.78rem', letterSpacing: '0.06em', color: '#333', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.75rem' }}>
          2 — Choose style
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {currentModel.styles.map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              style={{
                fontSize: '0.82rem',
                color: selectedStyle === style ? '#fff' : '#444',
                background: selectedStyle === style ? '#111' : '#f5f5f5',
                border: selectedStyle === style ? '1px solid #111' : '1px solid #e5e5e5',
                borderRadius: '999px',
                padding: '5px 14px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {style}
            </button>
          ))}
        </div>
      </section>

      {/* Step 3: Prompt input */}
      <section style={{ marginBottom: '1.75rem' }}>
        <p style={{ fontSize: '0.78rem', letterSpacing: '0.06em', color: '#333', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.75rem' }}>
          3 — Describe your tattoo idea
        </p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={selectedModel === 'ideogram-3'
            ? 'e.g. "Forever in my heart" or "Zaheer 1989" or "XII • III • MMXX"'
            : 'e.g. Wolf head surrounded by geometric patterns, strong and fierce'}
          maxLength={500}
          rows={3}
          style={{
            width: '100%', padding: '12px 14px',
            fontSize: '0.95rem', border: '1px solid #ddd',
            borderRadius: '10px', outline: 'none', resize: 'vertical',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            lineHeight: '1.6', color: '#111',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#888' }}>Just describe the idea — our AI engineers the rest</p>
          <p style={{ fontSize: '0.75rem', color: prompt.length > 400 ? '#e55' : '#888' }}>{prompt.length}/500</p>
        </div>

        {/* Suggestions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '0.75rem' }}>
          {PROMPT_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setPrompt(s)}
              style={{
                fontSize: '0.75rem', color: '#555',
                background: '#f5f5f5', border: '1px solid #e5e5e5',
                borderRadius: '999px', padding: '3px 10px', cursor: 'pointer',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Step 4: Placement */}
      <section style={{ marginBottom: '1.75rem' }}>
        <p style={{ fontSize: '0.78rem', letterSpacing: '0.06em', color: '#333', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.75rem' }}>
          4 — Placement
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {PLACEMENTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlacement(p.id)}
              style={{
                fontSize: '0.82rem',
                color: selectedPlacement === p.id ? '#fff' : '#444',
                background: selectedPlacement === p.id ? '#111' : '#f5f5f5',
                border: selectedPlacement === p.id ? '1px solid #111' : '1px solid #e5e5e5',
                borderRadius: '999px',
                padding: '5px 14px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        {selectedPlacement === 'other' && (
          <input
            type="text"
            value={customPlacement}
            onChange={(e) => setCustomPlacement(e.target.value)}
            placeholder="e.g. behind the ear, ribcage, hand, finger..."
            style={{
              marginTop: '0.75rem', width: '100%',
              padding: '10px 14px', fontSize: '0.9rem',
              border: '1px solid #ddd', borderRadius: '8px', outline: 'none',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          />
        )}
      </section>

      {/* Step 5: Size */}
      <section style={{ marginBottom: '1.75rem' }}>
        <p style={{ fontSize: '0.78rem', letterSpacing: '0.06em', color: '#333', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.75rem' }}>
          5 — Approximate size
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          {SIZES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSize(s.id)}
              style={{
                flex: 1, padding: '10px 0', textAlign: 'center',
                border: selectedSize === s.id ? '2px solid #111' : '1px solid #e5e5e5',
                borderRadius: '10px', cursor: 'pointer',
                background: selectedSize === s.id ? '#fafafa' : '#fff',
                transition: 'all 0.15s',
              }}
            >
              <p style={{ fontWeight: '600', fontSize: '0.88rem', color: '#111', margin: 0 }}>{s.label}</p>
              <p style={{ fontSize: '0.72rem', color: '#888', margin: '2px 0 0' }}>{s.sub}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Step 6: Color mode */}
      <section style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.78rem', letterSpacing: '0.06em', color: '#333', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.75rem' }}>
          6 — Colour mode
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          {COLOR_MODES.map((c) => (
            <button
              key={c.id}
              onClick={() => handleColorClick(c)}
              style={{
                flex: 1, padding: '10px 0', textAlign: 'center',
                border: selectedColor === c.id ? '2px solid #111' : '1px solid #e5e5e5',
                borderRadius: '10px', cursor: 'pointer',
                background: selectedColor === c.id ? '#fafafa' : '#fff',
                opacity: c.free ? 1 : 0.7,
                position: 'relative',
                transition: 'all 0.15s',
              }}
            >
              {!c.free && (
                <span style={{ position: 'absolute', top: '4px', right: '6px', fontSize: '0.65rem' }}>🔒</span>
              )}
              <p style={{ fontSize: '0.82rem', fontWeight: '600', color: '#111', margin: 0 }}>{c.label}</p>
              {c.geekOnly && (
                <p style={{ fontSize: '0.65rem', color: '#888', margin: '2px 0 0' }}>Geek Pack only</p>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        style={{
          width: '100%', height: '52px',
          background: isGenerating || !prompt.trim() ? '#ccc' : '#111',
          color: '#fff', border: 'none', borderRadius: '10px',
          fontSize: '1rem', fontWeight: '600',
          cursor: isGenerating || !prompt.trim() ? 'not-allowed' : 'pointer',
          marginBottom: '1rem', transition: 'background 0.2s',
        }}
      >
        {isGenerating ? '✦ Generating your tattoo...' : '✦ Generate tattoo design'}
      </button>

      {/* Loading bar */}
      {isGenerating && (
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ width: '100%', height: '4px', background: '#f0f0f0', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.75rem' }}>
            <div style={{
              height: '100%', width: `${loadingProgress}%`,
              background: '#111', borderRadius: '999px',
              transition: 'width 0.3s ease',
            }} />
          </div>
          <p style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>{loadingMessage}</p>
          <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.25rem' }}>This takes 10–15 seconds — worth the wait</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.88rem', color: '#dc2626', margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <section style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.78rem', letterSpacing: '0.06em', color: '#333', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.75rem' }}>
            Your tattoo design
          </p>
          <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
            <img
              src={result.imageUrl}
              alt="AI generated tattoo design"
              style={{ width: '100%', display: 'block' }}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              padding: '2rem 1rem 1rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>aigeek.ink — free preview</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>watermarked</span>
            </div>
          </div>

          <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1.25rem', marginTop: '1rem', textAlign: 'center' }}>
            <p style={{ fontWeight: '600', color: '#111', marginBottom: '0.4rem', fontSize: '0.95rem' }}>Love this design?</p>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem', lineHeight: '1.6' }}>
              Get the HD version, see it on your skin, and download a printable stencil to take to your artist.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/pricing" style={{
                display: 'inline-block', background: '#111', color: '#fff',
                padding: '10px 24px', borderRadius: '8px',
                textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600',
              }}>
                Upgrade — from $2.99
              </a>
              <button
                onClick={() => { setResult(null); setPrompt('') }}
                style={{
                  background: '#f5f5f5', color: '#555', border: '1px solid #e5e5e5',
                  padding: '10px 24px', borderRadius: '8px',
                  fontSize: '0.9rem', cursor: 'pointer',
                }}
              >
                Try another
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #f0f0f0', padding: '1.5rem 0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1rem' }}>
          <a href="/pricing" style={{ fontSize: '0.82rem', color: '#666', textDecoration: 'none' }}>Pricing</a>
          <a href="/terms" style={{ fontSize: '0.82rem', color: '#666', textDecoration: 'none' }}>Terms</a>
          <a href="/privacy" style={{ fontSize: '0.82rem', color: '#666', textDecoration: 'none' }}>Privacy</a>
          <a href="/refund" style={{ fontSize: '0.82rem', color: '#666', textDecoration: 'none' }}>Refund</a>
        </div>
        <p style={{ fontSize: '0.78rem', color: '#aaa', textAlign: 'center' }}>2026 aigeek.ink</p>
      </footer>

    </main>
  )
}
