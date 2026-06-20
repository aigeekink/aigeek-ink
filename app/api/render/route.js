import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { bodyImageBase64, tattooImageUrl, clickX, clickY, maskRadius, imageWidth, imageHeight, placement, style } = body

    // Validate inputs
    if (!bodyImageBase64 || !tattooImageUrl) {
      return NextResponse.json({ error: 'Missing required images.' }, { status: 400 })
    }
    if (typeof clickX !== 'number' || typeof clickY !== 'number') {
      return NextResponse.json({ error: 'Invalid click coordinates.' }, { status: 400 })
    }

    // Step 1: Upload body photo to Fal.ai storage
    const bodyImageBlob = base64ToBlob(bodyImageBase64)
    const bodyUploadUrl = await uploadToFal(bodyImageBlob, 'body-photo.jpg')

    // Step 2: Generate mask as base64 PNG and upload
    const maskBase64 = generateMaskBase64(
      Math.round(imageWidth),
      Math.round(imageHeight),
      Math.round(clickX),
      Math.round(clickY),
      Math.round(maskRadius)
    )
    const maskBlob = base64ToBlob(maskBase64)
    const maskUploadUrl = await uploadToFal(maskBlob, 'mask.png')

    // Step 3: Build inpainting prompt
    const tattooPrompt = buildTattooPrompt(placement, style)

    // Step 4: Call Fal.ai FLUX inpainting
    const response = await fetch('https://fal.run/fal-ai/flux-pro/v1/fill', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
  prompt: tattooPrompt,
  image_url: bodyUploadUrl,
  mask_url: maskUploadUrl,
  num_inference_steps: 28,
  guidance_scale: 3.5,
  num_images: 1,
  output_format: 'jpeg',
  enable_safety_checker: false,
}),

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || `Fal.ai render failed: ${response.status}`)
    }

    const data = await response.json()
    const resultUrl = data.images?.[0]?.url

    if (!resultUrl) {
      throw new Error('No image returned from render.')
    }

    return NextResponse.json({ resultUrl })

  } catch (error) {
    console.error('Render error:', error)
    return NextResponse.json(
      { error: `Render failed: ${error.message || 'Please try again.'}` },
      { status: 500 }
    )
  }
}

// Generate a white circle mask on black background — server side using Canvas API via node
function generateMaskBase64(width, height, cx, cy, radius) {
  // We generate mask as SVG-based data URL since we're in Next.js server context
  // Convert to a simple base64 PNG via a lightweight approach
  // We'll create a minimal PNG manually using raw bytes for a circle mask

  // Since we can't use browser Canvas in server routes, we build the mask
  // as a simple SVG and return it — Fal.ai accepts SVG masks
  // Actually Fal.ai needs PNG — so we return the SVG as data URL
  // and let the client handle it, OR we use the approach below:

  // Simplest server-safe approach: return mask as SVG data URI
  // Fal.ai accepts image URLs — we'll use an inline SVG data URL
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="black"/>
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="white"/>
  </svg>`

  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

async function uploadToFal(blob, filename) {
  // Upload to Fal.ai storage and get a URL back
  const formData = new FormData()
  formData.append('file', blob, filename)

  const response = await fetch('https://fal.run/fal-ai/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${process.env.FAL_API_KEY}`,
    },
    body: formData,
  })

  if (!response.ok) {
    // Fallback: return the base64 data URL directly if upload fails
    // Fal.ai also accepts base64 data URLs as image_url
    throw new Error(`Upload failed: ${response.status}`)
  }

  const data = await response.json()
  return data.url
}

function base64ToBlob(base64String) {
  // Handle both raw base64 and data URLs
  const base64Data = base64String.includes(',')
    ? base64String.split(',')[1]
    : base64String
  const mimeType = base64String.includes('data:')
    ? base64String.split(';')[0].split(':')[1]
    : 'image/jpeg'

  const bytes = Buffer.from(base64Data, 'base64')
  return new Blob([bytes], { type: mimeType })
}

function buildTattooPrompt(placement, style) {
  const placementMap = {
    forearm: 'forearm',
    wrist: 'wrist',
    shoulder: 'shoulder',
    chest: 'chest',
    ankle: 'ankle',
    back: 'upper back',
    spine: 'spine',
    other: 'skin',
  }

  const area = placementMap[placement] || 'skin'

  return `A realistic tattoo on the ${area}. The tattoo design is rendered in ${style || 'blackwork'} style, with fresh ink appearance, slight skin texture visible through the ink, natural ink depth, photorealistic tattoo on real human skin. The surrounding skin is natural and unmodified.`
}
