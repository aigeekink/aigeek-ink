import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { bodyImageBase64, clickX, clickY, maskRadius, imageWidth, imageHeight } = body

    if (!bodyImageBase64) {
      return NextResponse.json({ error: 'Missing body photo.' }, { status: 400 })
    }
    if (typeof clickX !== 'number' || typeof clickY !== 'number') {
      return NextResponse.json({ error: 'Invalid click coordinates.' }, { status: 400 })
    }

    // Generate PNG mask — pure JS, no external dependencies
    const maskDataUri = generateMaskPNGDataUri(
      Math.round(imageWidth),
      Math.round(imageHeight),
      Math.round(clickX),
      Math.round(clickY),
      Math.round(maskRadius)
    )

    const tattooPrompt = `A realistic fresh tattoo on human skin. The tattoo design is rendered as real ink sitting naturally in the skin with authentic depth and texture. Skin pores and texture visible through the ink. Surrounding skin is completely natural and unmodified. Photorealistic tattoo photography, sharp focus.`

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

// Pure JS PNG generation — grayscale, white circle on black background
// No external dependencies, works in Vercel serverless
function generateMaskPNGDataUri(width, height, cx, cy, radius) {
  const zlib = require('zlib')

  // Build raw pixel rows (grayscale, 1 byte per pixel)
  const rawData = []
  for (let y = 0; y < height; y++) {
    rawData.push(0) // PNG filter type: None
    for (let x = 0; x < width; x++) {
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      rawData.push(dist <= radius ? 255 : 0)
    }
  }

  const rawBytes = Buffer.from(rawData)
  const compressed = zlib.deflateSync(rawBytes)

  // Build PNG chunks
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  // IHDR: width, height, bit depth=8, colour type=0 (grayscale)
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData[8] = 8  // bit depth
  ihdrData[9] = 0  // grayscale
  ihdrData[10] = 0
  ihdrData[11] = 0
  ihdrData[12] = 0

  const ihdr = makeChunk('IHDR', ihdrData)
  const idat = makeChunk('IDAT', compressed)
  const iend = makeChunk('IEND', Buffer.alloc(0))

  const png = Buffer.concat([sig, ihdr, idat, iend])
  return `data:image/png;base64,${png.toString('base64')}`
}

function makeChunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii')
  const lenBuffer = Buffer.alloc(4)
  lenBuffer.writeUInt32BE(data.length, 0)
  const crcInput = Buffer.concat([typeBuffer, data])
  const crcValue = crc32(crcInput)
  const crcBuffer = Buffer.alloc(4)
  crcBuffer.writeUInt32BE(crcValue, 0)
  return Buffer.concat([lenBuffer, typeBuffer, data, crcBuffer])
}

const crcTable = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
    t[i] = c
  }
  return t
})()

function crc32(buf) {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}
