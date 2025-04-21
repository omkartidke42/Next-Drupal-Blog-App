import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/views/blog_view/block_1`,
      {
        headers: {
          Accept: 'application/vnd.api+json',
        },
      }
    )

    // Check if the response is okay
    if (!response.ok) {
      throw new Error(`Failed to fetch Drupal view: ${response.statusText}`)
    }

    // Parse and return the response data as JSON
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching Drupal view:', error)
    return NextResponse.json({ error: 'Failed to fetch blog articles' }, { status: 500 })
  }
}
