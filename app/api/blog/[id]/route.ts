// app/api/blog/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/node/blog/${id}`,
      {
        headers: {
          Accept: 'application/vnd.api+json',
        },
      }
    )

    if (!res.ok) {
      throw new Error(`Drupal responded with ${res.status}`)
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching blog by ID:', error)
    return NextResponse.json({ error: 'Blog not found' }, { status: 500 })
  }
}
