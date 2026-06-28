import { NextResponse } from 'next/server'

// App Router body size limit
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export async function POST(request) {
  try {
    // Read body as text first to check if it's being truncated
    const text = await request.text()
    
    let parsedBody
    try {
      parsedBody = JSON.parse(text)
    } catch (parseErr) {
      console.error('JSON parse failed. Body length:', text.length)
      console.error('Parse error:', parseErr.message)
      return NextResponse.json(
        { error: `JSON parse failed — body was ${text.length} chars. Try a smaller image.` },
        { status: 400 }
      )
    }

    const { compositeImageBase64, clickX, clickY, maskRadius, imageWidth, imageHeight } = parsedBody

    if (!compositeImageBase64) {
      return NextResponse.json({ error: 'Missing composite image.' }, { status: 400 })
    }
    if (typeof clickX !== 'number' || typeof clickY !== 'number') {
      return NextResponse.json({ error: 'Invalid click coordinates.' }, { status: 400 })
    }

    const cx = Math.round(clickX)
    const cy = Math.round(clickY)
    const radius = Math.round(maskRadius)
    const w = Math.round(imageWidth)
    const h = Math.round(imageHeight)

    console.log(`Render request: ${w}x${h}, mask at (${cx},${cy}) r=${radius}, payload=${text.length} chars`)

    // Generate PNG mask
    const maskDataUri = generateMaskPNGDataUri(w, h, cx, cy, radius)

    const prompt = `Make this tattoo look freshly inked on real skin. Bold dark rich black ink with high contrast and crisp clean lines. The tattoo is newly done today — deep saturated blacks, no fading, sharp edges. Skin texture and pores visible through the ink. Surrounding skin completely natural. Professional tattoo photography, sharp focus.`

    const response = await fetch('https://fal.run/fal-ai/flux-pro/v1/fill', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        image_url: compositeImageBase64,
        mask_url: maskDataUri,
        num_inference_steps: 28,
        guidance_scale: 4.0,
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

function generateMaskPNGDataUri(width, height, cx, cy, radius) {
  const zlib = require('zlib')
  const rawData = []
  for (let y = 0; y < height; y++) {
    rawData.push(0)
    for (let x = 0; x < width; x++) {
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      rawData.push(dist <= radius ? 255 : 0)
    }
  }
  const compressed = zlib.deflateSync(Buffer.from(rawData))
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData[8] = 8; ihdrData[9] = 0
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
  const crcBuffer = Buffer.alloc(4)
  crcBuffer.writeUInt32BE(crc32(crcInput), 0)
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
