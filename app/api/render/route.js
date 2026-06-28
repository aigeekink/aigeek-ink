import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const text = await request.text()

    let parsedBody
    try {
      parsedBody = JSON.parse(text)
    } catch (parseErr) {
      return NextResponse.json(
        { error: `Image too large — ${Math.round(text.length / 1024)}KB. Try a smaller photo.` },
        { status: 400 }
      )
    }

    const { compositeImageBase64, imageWidth, imageHeight, isColoured } = parsedBody

    if (!compositeImageBase64) {
      return NextResponse.json({ error: 'Missing composite image.' }, { status: 400 })
    }

    console.log(`Kontext Max render: ${imageWidth}x${imageHeight}, coloured=${isColoured}, payload=${Math.round(text.length/1024)}KB`)

    // Build prompt based on whether tattoo is coloured or black ink
    const prompt = isColoured
      ? 'The tattoo design visible on the skin in this image is freshly inked. Make the tattoo ink look deeply embedded in the skin — preserve all colours exactly as shown, vibrant and saturated. Crisp sharp lines with high contrast. Natural skin texture and pores visible through the ink. The surrounding skin is natural and unmodified. Preserve the exact tattoo design, position, size, and colours exactly as shown. Do not change or replace the tattoo design. Photorealistic tattoo photography.'
      : 'The tattoo design visible on the skin in this image is freshly inked. Make the tattoo ink look deeply embedded in the skin — bold dark rich blacks, crisp sharp lines, high contrast. Natural skin texture and pores visible through the ink. The surrounding skin is natural and unmodified. Preserve the exact tattoo design, position, and size exactly as shown. Do not change or replace the tattoo design. Photorealistic tattoo photography.'

    const response = await fetch('https://fal.run/fal-ai/flux-pro/kontext/max', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        image_url: compositeImageBase64,
        num_inference_steps: 28,
        guidance_scale: 6.0,
        num_images: 1,
        output_format: 'jpeg',
        enable_safety_checker: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(`Kontext Max failed: ${response.status} — ${errorText}`)
    }

    const data = await response.json()
    const resultUrl = data.images?.[0]?.url

    if (!resultUrl) throw new Error('No image returned from render.')

    return NextResponse.json({ resultUrl })

  } catch (error) {
    console.error('Render error:', error)
    return NextResponse.json(
      { error: `Render failed: ${error.message || 'Please try again.'}` },
      { status: 500 }
    )
  }
}
