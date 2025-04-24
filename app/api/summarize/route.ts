// app/api/summarize/route.ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // Ensure dynamic execution

export async function POST(request: Request) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required for summarization' },
        { status: 400 }
      )
    }

    // Truncate content to avoid hitting API limits
    const truncatedContent = content.length > 1000 
      ? content.substring(0, 1000) + '...' 
      : content

    console.log('Sending to Hugging Face:', truncatedContent.length, 'chars')

    const hfResponse = await fetch(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: truncatedContent })
      }
    )

    if (!hfResponse.ok) {
      const error = await hfResponse.json()
      console.error('Hugging Face error:', error)
      return NextResponse.json(
        { error: 'Failed to generate summary' },
        { status: hfResponse.status }
      )
    }

    const result = await hfResponse.json()
    return NextResponse.json({ 
      summary: result[0]?.summary_text || 'No summary available' 
    })

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}