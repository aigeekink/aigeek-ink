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

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: '1px solid #f0f0f0' }}>
        <a href="/" style={{ fontWeight: '600', fontSize: '1.1rem', letterSpacing: '-0.02em', textDecoration: 'none', color: '#111' }}>aigeek.ink</a>
        <a href="/pricing" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none' }}>Pricing</a>
      </nav>

      {/* Header */}
      <section style={{ padding: '2.5rem 0 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Generate your tattoo</h1>
        <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.6' }}>Describe your idea below. The AI will create a tattoo-ready design in seconds.</p>
      </section>

      {/* Model selector */}
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

      {/* Prompt input */}
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

      {/* Prompt suggestions */}
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

      {/* Generate button */}
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

      {/* Error */}
      {error && (
        <div style={{ background: '#fff5f5',
