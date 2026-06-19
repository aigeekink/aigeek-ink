import OpenAI from 'openai'
import { NextResponse } from 'next/server'

// API clients
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

// Color rules
const COLOR_RULES = {
  'black-ink': 'black ink line art on white background, no shading, no colour',
  'black-grey': 'black and grey ink, monochromatic shading, no colour',
  'full-colour': 'full colour with bold black outlines enclosing all colour fills, traditional flash style',
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

  'flux-2-pro': (vars) => `Bold tattoo design artwork. Subject: ${vars.userPrompt}. Style: ${vars.style}. Layout: ${vars.composition}. Size: ${vars.sizeRule}. Ink: ${vars.colorRule}. Strong confident linework, dramatic contrast, isolated on white background, one complete centered design, no background scene.`.trim(),

  'seedream-5': (vars) => `Artistic tattoo concept illustration. Subject: ${vars.userPrompt}. Style: ${vars.style}. Layout: ${vars.composition}. Size: ${vars.sizeRule}. Ink: ${vars.colorRule}. Rich detailed artwork, clean light background, one isolated design centered with clear margins, suitable for tattoo artist reference.`.trim(),

  'ideogram-3': (vars) => `Tattoo lettering design. Text: ${vars.userPrompt}. Style: ${vars.style}. Layout: ${vars.composition}. Size: ${vars.sizeRule}. Ink: ${vars.colorRule}. Clean elegant typography, isolated on white background, exact text preserved, one centered lettering design, no extra words.`.trim(),
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

// FLUX 2 Pro via Fal.ai
async function generateWithFLUX(engineeredPrompt, imageSize) {
  const [width, height] = imageSize.split('x').map(Number)

  const response = await fetch('https://fal.run/fal-ai/flux-pro/v1.1', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${process.env.FAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: engineeredPrompt,
      image_size: { width, height },
      num_images: 1,
      output_format: 'png',
      safety_tolerance: '2',
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'FLUX generation failed')
  }

  const data = await response.json()
  return data.images[0].url
}

// Seedream 5 via Fal.ai
async function generateWithSeedream(engineeredPrompt, imageSize) {
  const [width, height] = imageSize.split('x').map(Number)

  const response = await fetch('https://fal.run/fal-ai/seedream-v3', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${process.env.FAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: engineeredPrompt,
      image_size: { width, height },
      num_images: 1,
      output_format: 'png',
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Seedream generation failed')
  }

  const data = await response.json()
  return data.images[0].url
}

// Ideogram 3 via Ideogram API
async function generateWithIdeogram(engineeredPrompt, imageSize) {
  const [width, height] = imageSize.split('x').map(Number)

  const response = await fetch('https://api.ideogram.ai/generate', {
    method: 'POST',
    headers: {
      'Api-Key': process.env.IDEOGRAM_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_request: {
        prompt: engineeredPrompt,
        model: 'V_3',
        magic_prompt_option: 'OFF',
        num_images: 1,
        resolution: `RESOLUTION_${width}_${height}`,
        style_type: 'DESIGN',
      },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Ideogram generation failed')
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

    const promptBuilder = MODEL_PROMPTS[resolvedModel] || MODEL_PROMPTS['gpt-image-2']
    const engineeredPrompt = promptBuilder({
      userPrompt: prompt.trim(),
      style,
      composition,
      sizeRule,
      colorRule,
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
        imageUrl = await generateWithFLUX(engineeredPrompt, imageSize)
        break
      case 'seedream-5':
        imageUrl = await generateWithSeedream(engineeredPrompt, imageSize)
        break
      case 'ideogram-3':
        imageUrl = await generateWithIdeogram(engineeredPrompt, imageSize)
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

    if (error?.status === 400 || error?.message?.includes('flagged')) {
      return NextResponse.json(
        { error: 'Generation failed — please try rephrasing your idea.' },
        { status: 400 }
      )
    }
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
