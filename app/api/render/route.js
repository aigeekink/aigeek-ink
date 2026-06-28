import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const text = await request.text()

    let parsedBody
    try {
      parsedBody = JSON.parse(text)
    } catch (parseErr) {
      return NextResponse.json(
        { error: `Image too large — body was ${Math.round(text.length / 1024)}KB. Try a smaller photo.` },
        { status: 400 }
      )
    }

    const { compositeImageBase64, clickX, clickY, maskRadius, imageWidth, imageHeight } = parsedBody

    if (!compositeImageBase64) {
      return NextResponse.json({ error: 'Missing composite image.' }, { status: 400 })
    }

    const cx = Math.round(clickX)
    const cy = Math.round(clickY)
    const radius = Math.round(maskRadius)
    const w = Math.round(imageWidth)
    const h = Math.round(imageHeight)

    console.log(`Render: ${w}x${h} image, mask at (${cx},${cy}) r=${radius}, payload=${Math.round(text.length/1024)}KB`)

    const maskDataUri = generateMaskPNGDataUri(w, h, cx, cy, radius)

    const prompt = `Photorealistic tattoo on human skin. The tattoo design shown is freshly inked — preserve the exact design, lines, and shapes already visible. Make the ink look deeply embedded in skin with natural skin texture and pores showing through. Bold dark blacks, crisp edges. Do not change or replace the tattoo design. Surrounding skin natural and unmodified.`

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
        guidance_scale: 6.0,
        strength: 0.35,
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
  ihdrData[10] = 0; ihdrData[11] = 0; ihdrData[12] = 0
  const ihdr = makeChunk('IHDR', ihdrData)
  const idat = makeChunk('IDAT', compressed)
  const iend = makeChunk('IEND', Buffer.alloc(0))
  return `data:image/png;base64,${Buffer.concat([sig, ihdr, idat, iend]).toString('base64')}`
}

function makeChunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii')
  const lenBuffer = Buffer.alloc(4)
  lenBuffer.writeUInt32BE(data.length, 0)
  const crcBuffer = Buffer.alloc(4)
  crcBuffer.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0)
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
