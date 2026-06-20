import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { bodyImageBase64, tattooImageBase64, clickX, clickY, maskRadius, imageWidth, imageHeight, style } = body

    // Validate inputs
    if (!bodyImageBase64) {
      return NextResponse.json({ error: 'Missing body photo.' }, { status: 400 })
    }
    if (typeof clickX !== 'number' || typeof clickY !== 'number') {
      return NextResponse.json({ error: 'Invalid click coordinates.' }, { status: 400 })
    }

    // Generate SVG mask as base64 data URI — Fal.ai accepts this directly
    const maskDataUri = generateMaskSVG(
      Math.round(imageWidth),
      Math.round(imageHeight),
      Math.round(clickX),
      Math.round(clickY),
      Math.round(maskRadius)
    )

    // Build prompt — no placement needed, AI reads the body from the image
    const tattooPrompt = buildTattooPrompt(style)

    // Call Fal.ai FLUX pro Fill — send base64 directly, no upload needed
    const response = await fetch('https://fal.run/fal-ai/flux-pro/v1/fill', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: tattooPrompt,
        image_url: bodyImageBase64,
        mask_url: maskDataUri,
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        output_format: 'jpeg',
        enable_safety_checker: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(`Fal.ai render failed: ${response.status} — ${errorText}`)
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

// Generate white circle mask on black background as SVG data URI
// Fal.ai accepts base64 data URIs directly as image_url / mask_url
function generateMaskSVG(width, height, cx, cy, radius) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="black"/>
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="white"/>
  </svg>`
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

// Tattoo inpainting prompt — let AI figure out body placement from the image
function buildTattooPrompt(style) {
  const styleMap = {
    'blackwork': 'bold blackwork tattoo with clean black lines and strong contrast',
    'fine line': 'delicate fine line tattoo with thin precise linework',
    'black and grey': 'black and grey tattoo with smooth monochromatic shading',
    'neo-traditional': 'neo-traditional tattoo with bold outlines and rich detail',
    'full colour': 'vibrant full colour tattoo with bold black outlines',
  }

  const styleDesc = styleMap[style] || 'blackwork tattoo with clean black lines'

  return `A realistic fresh ${styleDesc} on human skin. Ink sits naturally in the skin with authentic depth and texture. Skin pores visible through the ink. The surrounding skin is completely natural and unmodified. Photorealistic tattoo photography.`
}
