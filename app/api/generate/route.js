import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request) {
  try {
    const { prompt, model = 'gpt-image-2' } = await request.json()

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: 'Prompt too long — keep it under 500 characters' },
        { status: 400 }
      )
    }

    const tattooPrompt = `Tattoo design: ${prompt}. Style: bold clean outlines, high contrast black ink, white background, tattoo-ready line art, no gradients, no shading, stencil-friendly, professional tattoo design`

    const response = await openai.images.generate({
      model: 'gpt-image-2',
      prompt: tattooPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'low',
    })

    const imageUrl = response.data[0].url

    return NextResponse.json({ imageUrl, prompt })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Generation failed. Please try again.' },
      { status: 500 }
    )
  }
}
