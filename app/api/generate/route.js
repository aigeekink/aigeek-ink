import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Placement mapped to pure geometry — zero anatomy nouns
const PLACEMENT_TO_COMPOSITION = {
  forearm: 'vertically oriented, long narrow aspect ratio composition',
  wrist: 'centered, symmetrical, tightly packed compact square layout',
  shoulder: 'centered, symmetrical square frame with evenly distributed visual weight',
  chest: 'horizontally elongated, wide layout focusing purely on a central focal point',
  ankle: 'vertically aligned, compact and slender structural composition',
  back: 'horizontally balanced, grand widescreen layout anchoring a powerful central graphic',
  spine: 'vertically stacked, ultra-narrow minimalist linear array aligned down the direct center',
}

// Allowlists
const ALLOWED_MODELS = ['gpt-image-2', 'flux-2-pro', 'seedream-5', 'ideogram-3']
const ALLOWED_SIZES = ['small', 'medium', 'large']
const ALLOWED_COLOR_MODES = ['black-ink', 'black-grey', 'full-colour']
const ALLOWED_PLACEMENTS = ['forearm', 'wrist', 'shoulder', 'chest', 'ankle', 'back', 'spine', 'other']

// Size rules
const SIZE_RULES = {
  small: 'bold simple lines, minimal fine detail, strong negative space',
  medium: 'balanced linework, moderate detail, clear focal point',
  large: 'intricate detail allowed, strong central element with supporting detail',
}

// Color rules for standard models
const COLOR_RULES = {
  'black-ink': 'black ink line art only, pure black on white, absolutely no colour, no shading, no grey tones',
  'black-grey': 'black and grey ink only, monochromatic shading allowed, absolutely no colour',
  'full-colour': 'full colour with bold black outlines enclosing all colour fills, traditional flash tattoo style',
}

// Ideogram-specific color rules — lettering needs different instructions
const IDEOGRAM_COLOR_RULES = {
  'black-ink': 'pure black ink on white background, no colour, no shading, stark high contrast',
  'black-grey': 'black and grey ink, dimensional shading and shadow effects allowed, monochromatic depth, white background',
  'full-colour': 'vibrant coloured lettering with elegant ink accents, gold fills or deep jewel-tone colour with strong black outlines, ornate coloured tattoo script, white background',
}

function resolveComposition(placement, customPlacement) {
  if (placement === 'other' && customPlacement) {
    return `composition suited for ${customPlacement.trim()} — use only geometric layout guidance, do not draw the body part`
  }
  return PLACEMENT_TO_COMPOSITION[placement] || 'centered square composition'
}

// Prompt builders per model
const MODEL_PROMPTS = {
  'gpt-image-2': (vars) => `Professional tattoo flash art design. Subject: ${vars.userPrompt}. Style: ${vars.style}. Layout: ${vars.composition}. Size: ${vars.sizeRule}. Ink: ${vars.colorRule}. Single isolated design, plain white background, clean bold outlines, high contrast, centered with margin around edges. One complete design only.`.trim(),

  'flux-2-pro': (vars) => `Tattoo design artwork. Subject: ${vars.userPrompt}. Style: ${vars.style}. Layout: ${vars.composition}. Size: ${vars.sizeRule}. Ink: ${vars.colorRule}. Strong confident linework, isolated design centered with wide clear margins on all sides, no background scene, no ink splatter, no brush strokes, one complete contained design, design must not touch or go beyond image edges.`.trim(),

  'seedream-5': (vars) => `Artistic tattoo concept illustration. Subject: ${vars.userPrompt}. Style: ${vars.style}. Layout: ${vars.composition}. Size: ${vars.sizeRule}. Ink: ${vars.colorRule}. Rich detailed artwork, pure white background #FFFFFF no texture no grain no paper effect, one isolated design centered with clear margins, suitable for tattoo artist reference.`.trim(),

  // Ideogram uses ideogramColorRule instead of colorRule
  // Text is quoted to enforce exact rendering
  'ideogram-3': (vars) => `Tattoo lettering design. Render EXACTLY this text and nothing else: "${vars.userPrompt}". Lettering style: ${vars.style}. Layout: ${vars.composition}. Size: ${vars.sizeRule}. Ink: ${vars.ideogramColorRule}. Pure white background, centered with wide clear margins on all edges, exact text only — do not add, change, or invent any words, one complete lettering design only.`.trim(),
}

// GPT Image 2 via OpenAI
async function generateWithGPT(engineeredPrompt, imageSize) {
  const response = await openai.images.generate({
    model: 'gpt-image-2',
    prompt: engineeredPrompt,
    n: 1,
    size: imageSize,
    quality: 'low',
    background: 'auto',
    output_format: 'png',
  })

  const imageData = response.data[0]
  if (imageData.url) return imageData.url
  if (imageData.b64_json) return `data:image/png;base64,${imageData.b64_json}`
  throw new Error('No valid image data from OpenAI')
}

// FLUX Pro v1.1 via Fal.ai
async function generateWithFLUX(engineeredPrompt, imageSize, colorMode) {
  const [width, height] = imageSize.split('x').map(Number)

  const negativePrompt = colorMode === 'black-ink'
    ? 'color, colours, colorful, vibrant, painted, watercolor, red, blue, green, yellow, pink, purple, orange, background scene, ink splatter, brush strokes, cropped edges, cut off, bleeding edges'
    : colorMode === 'black-grey'
    ? 'color, colours, colorful, vibrant, painted, red, blue, green, yellow, pink, purple, orange, background scene, ink splatter, brush strokes, cropped edges, cut off, bleeding edges'
    : 'background scene, ink splatter, brush strokes, cropped edges, cut off, bleeding edges'

  const response = await fetch('https://fal.run/fal-ai/flux-pro/v1.1', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${process.env.FAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: engineeredPrompt,
      negative_prompt: negativePrompt,
      image_size: { width, height },
      num_images: 1,
      output_format: 'png',
      safety_tolerance: '2',
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || `FLUX generation failed: ${response.status}`)
  }

  const data = await response.json()
  return data.images[0].url
}

// Seedream v3 via Fal.ai
async function generateWithSeedream(engineeredPrompt, imageSize) {
  const [width, height] = imageSize.split('x').map(Number)

  const response = await fetch('https://fal.run/fal-ai/bytedance/seedream/v3/text-to-image', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${process.env.FAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: engineeredPrompt,
      image_size: { width, height },
      num_images: 1,
      guidance_scale: 7.5,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || `Seedream generation failed: ${response.status}`)
  }

  const data = await response.json()
  return data.images[0].url
}

// Ideogram V3 — multipart/form-data
// colorMode passed in to control style_type and negative prompts
async function generateWithIdeogram(engineeredPrompt, imageSize, colorMode) {
  const aspectRatio = imageSize === '1024x1536' ? '2x3'
    : imageSize === '1536x1024' ? '3x2'
    : '1x1'

  const formData = new FormData()
  formData.append('prompt', engineeredPrompt)
  formData.append('aspect_ratio', aspectRatio)
  formData.append('magic_prompt', 'OFF')
  formData.append('num_images', '1')
  formData.append('rendering_speed', 'TURBO')

  // Full colour uses GENERAL style to allow colour output
  // Black ink and black-grey use DESIGN for clean lettering
  if (colorMode === 'full-colour') {
    formData.append('style_type', 'GENERAL')
  } else {
    formData.append('style_type', 'DESIGN')
  }

  // Black ink: block all shading and colour
  // Black-grey: no negative prompt — let Ideogram add natural shading freely
  // Full colour: only block unwanted backgrounds
  if (colorMode === 'black-ink') {
    formData.append('negative_prompt', 'color, colours, colorful, vibrant, painted, grey shading, gradients, shadows')
  } else if (colorMode === 'full-colour') {
    formData.append('negative_prompt', 'grey background, textured background, paper texture, plain black only')
  }

  const response = await fetch('https://api.ideogram.ai/v1/ideogram-v3/generate', {
    method: 'POST',
    headers: {
      'Api-Key': process.env.IDEOGRAM_API_KEY,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(`Ideogram ${response.status}: ${errorText}`)
  }

  const data = await response.json()
  return data.data[0].url
}

export async function POST(request) {
  try {
    const body = await request.json()

    const {
      prompt,
      model = 'gpt-image-2',
      style = 'Fine Line',
      placement = 'forearm',
      customPlacement = '',
      size = 'medium',
      colorMode = 'black-ink',
    } = body

    // Validation
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Please describe your tattoo idea.' }, { status: 400 })
    }
    if (prompt.length > 500) {
      return NextResponse.json({ error: 'Prompt too long — keep it under 500 characters.' }, { status: 400 })
    }
    if (!ALLOWED_SIZES.includes(size)) {
      return NextResponse.json({ error: 'Invalid size selection.' }, { status: 400 })
    }
    if (!ALLOWED_COLOR_MODES.includes(colorMode)) {
      return NextResponse.json({ error: 'Invalid colour mode selection.' }, { status: 400 })
    }
    if (!ALLOWED_PLACEMENTS.includes(placement)) {
      return NextResponse.json({ error: 'Invalid placement selection.' }, { status: 400 })
    }
    if (customPlacement && customPlacement.length > 100) {
      return NextResponse.json({ error: 'Custom placement description too long.' }, { status: 400 })
    }

    const resolvedModel = ALLOWED_MODELS.includes(model) ? model : 'gpt-image-2'
    const composition = resolveComposition(placement, customPlacement)
    const sizeRule = SIZE_RULES[size] || SIZE_RULES.medium
    const colorRule = COLOR_RULES[colorMode] || COLOR_RULES['black-ink']
    const ideogramColorRule = IDEOGRAM_COLOR_RULES[colorMode] || IDEOGRAM_COLOR_RULES['black-ink']

    const promptBuilder = MODEL_PROMPTS[resolvedModel] || MODEL_PROMPTS['gpt-image-2']
    const engineeredPrompt = promptBuilder({
      userPrompt: prompt.trim(),
      style,
      composition,
      sizeRule,
      colorRule,
      ideogramColorRule,
    })

    // Image size based on placement
    let imageSize = '1024x1024'
    if (['forearm', 'ankle', 'spine'].includes(placement)) {
      imageSize = '1024x1536'
    } else if (['chest', 'back'].includes(placement)) {
      imageSize = '1536x1024'
    }

    // Route to correct API
    let imageUrl = ''

    switch (resolvedModel) {
      case 'gpt-image-2':
        imageUrl = await generateWithGPT(engineeredPrompt, imageSize)
        break
      case 'flux-2-pro':
        imageUrl = await generateWithFLUX(engineeredPrompt, imageSize, colorMode)
        break
      case 'seedream-5':
        imageUrl = await generateWithSeedream(engineeredPrompt, imageSize)
        break
      case 'ideogram-3':
        imageUrl = await generateWithIdeogram(engineeredPrompt, imageSize, colorMode)
        break
      default:
        imageUrl = await generateWithGPT(engineeredPrompt, imageSize)
    }

    const responseData = {
      imageUrl,
      prompt,
      model: resolvedModel,
      style,
      placement,
      size,
      colorMode,
    }

    if (process.env.NODE_ENV !== 'production') {
      responseData.engineeredPrompt = engineeredPrompt
    }

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Generation error:', error)

    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      )
    }
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'API configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: `Generation failed: ${error.message || 'Please try again.'}` },
      { status: 500 }
    )
  }
}
