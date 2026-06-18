'use client'

import { useState } from 'react'

const MODELS = [
  {
    id: 'gpt-image-2',
    name: 'AIGeek Default',
    description: 'Best all-rounder for clean tattoo concepts, accurate prompt following, and stencil-friendly results.',
    recommended: 'Fine line, geometric, blackwork, meaningful custom tattoos',
    credits: 1,
    free: true,
  },
  {
    id: 'flux-2-pro',
    name: 'Bold Ink',
    description: 'Best for dramatic, bold, high-impact tattoo concepts with strong shadows and realistic ink feel.',
    recommended: 'Blackwork, dark art, neo-traditional, forearm/chest pieces',
    credits: 1,
    free: false,
  },
  {
    id: 'seedream-5',
    name: 'Artistic Concept',
    description: 'Best for visually rich, creative, Pinterest-style tattoo inspiration.',
    recommended: 'Fantasy, surreal, cyberpunk, painterly, experimental',
    credits: 1,
    free: false,
  },
  {
    id: 'ideogram-3',
    name: 'Lettering Pro',
    description: 'Best for names, dates, quotes, Roman numerals, and typography tattoos.',
    recommended: 'Script tattoos, memorial text, Arabic/English lettering, names',
    credits: 2,
    free: false,
  },
]

const PROMPT_SUGGESTIONS = [
  'Geometric wolf head with mandala patterns',
  'Fine line lotus flower with moon phases',
  'Minimalist mountain range with coordinates',
  'Neo-traditional dragon with cherry blossoms',
  'Blackwork compass rose with ornate details',
  'Simple Roman numerals in elegant script',
]

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState('gpt-image-2')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: selectedModel }),
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

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: '1px solid #f0f0f0' }}>
        <a href="/" style={{ fontWeight: '600', fontSize: '1.1rem', letterSpacing: '-0.02em', textDecoration: 'none', color: '#111' }}>aigeek.ink</a>
        <a href="/pricing" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none' }}>Pricing</a>
      </nav>

      <section style={{ padding: '2.5rem 0 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Generate your tattoo</h1>
        <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.6' }}>Describe your idea below. The AI will create a tattoo-ready design in seconds.</p>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.08em', color: '#aaa', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Choose AI model</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {MODELS.map((model) => (
            <div
              key={model.id}
              onClick={() => model.free && setSelectedModel(model.id)}
              style={{
                border: selectedModel === model.id ? '2px solid #111' : '1px solid #e5e5e5',
                borderRadius: '10px',
                padding: '0.875rem',
                cursor: model.free ? 'pointer' : 'default',
                position: 'relative',
                background: selectedModel === model.id ? '#fafafa' : '#fff',
                opacity: model.free ? 1 : 0.7,
              }}
            >
              {!model.free && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: '#7c3aed',
                  color: '#fff',
                  fontSize: '0.65rem',
                  padding: '2px 7px',
                  borderRadius: '999px',
                  fontWeight: '600',
                }}>
                  💎 PRO
                </div>
              )}
              {model.credits === 2 && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: '#f0f0f0',
                  color: '#555',
                  fontSize: '0.62rem',
                  padding: '2px 6px',
                  borderRadius: '999px',
                }}>
                  2 credits
                </div>
              )}
              <p style={{ fontWeight: '600', fontSize: '0.88rem', color: '#111', marginBottom: '0.25rem', marginTop: model.credits === 2 ? '1rem' : '0' }}>{model.name}</p>
              <p style={{ fontSize: '0.78rem', color: '#666', lineHeight: '1.5', marginBottom: '0.4rem' }}>{model.description}</p>
              <p style={{ fontSize: '0.72rem', color: '#999', lineHeight: '1.4' }}>Best for: {model.recommended}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.78rem', color: '#aaa', marginTop: '0.5rem', textAlign: 'center' }}>💎 Pro models available in Starter and Geek packs</p>
      </section>

      <section style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.08em', color: '#aaa', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Describe your tattoo</p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Geometric wolf head with mandala patterns, fine line style, suitable for forearm"
          maxLength={500}
          rows={3}
          style={{
            width: '100%',
            padding: '12px 14px',
            fontSize: '0.95rem',
            border: '1px solid #ddd',
            borderRadius: '10px',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            lineHeight: '1.6',
            color: '#111',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#aaa' }}>Be specific — style, placement, mood</p>
          <p style={{ fontSize: '0.75rem', color: prompt.length > 400 ? '#e55' : '#aaa' }}>{prompt.length}/500</p>
        </div>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.08em', color: '#aaa', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Try an example</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {PROMPT_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
              style={{
                fontSize: '0.78rem',
                color: '#555',
                background: '#f5f5f5',
                border: '1px solid #e5e5e5',
                borderRadius: '999px',
                padding: '4px 12px',
                cursor: 'pointer',
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        style={{
          width: '100%',
          height: '48px',
          background: isGenerating || !prompt.trim() ? '#ccc' : '#111',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: isGenerating || !prompt.trim() ? 'not-allowed' : 'pointer',
          marginBottom: '1.5rem',
          transition: 'background 0.2s',
        }}
      >
        {isGenerating ? '✦ Generating your tattoo...' : '✦ Generate tattoo design'}
      </button>

      {error && (
        <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.88rem', color: '#dc2626', margin: 0 }}>{error}</p>
        </div>
      )}

      {result && (
        <section style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.08em', color: '#aaa', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Your tattoo design</p>
          <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
            <img
              src={result.imageUrl}
              alt={'AI tattoo design'}
              style={{ width: '100%', display: 'block' }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              padding: '2rem 1rem 1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>aigeek.ink — free preview</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>watermarked</span>
            </div>
          </div>

          <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '1.25rem', marginTop: '1rem', textAlign: 'center' }}>
            <p style={{ fontWeight: '600', color: '#111', marginBottom: '0.4rem', fontSize: '0.95rem' }}>Love this design?</p>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem', lineHeight: '1.6' }}>Get the HD version, see it on your skin, and download a printable stencil to take to your artist.</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/pricing" style={{
                display: 'inline-block',
                background: '#111',
                color: '#fff',
                padding: '10px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '600',
              }}>
                Upgrade — from $2.99
              </a>
              <button
                onClick={() => { setResult(null); setPrompt('') }}
                style={{
                  background: '#f5f5f5',
                  color: '#555',
                  border: '1px solid #e5e5e5',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                Try another
              </button>
            </div>
          </div>
        </section>
      )}

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
