import { drupal } from "@/lib/drupal"
import { NextRequest } from "next/server"

async function getTagUuidByName(name: string): Promise<string | null> {
  try {
    const result = await drupal.getResourceCollectionFromContext(
      "taxonomy_term--tags",
      {
        params: {
          "filter[name]": name,
        },
      }
    )

    if (result.length > 0) {
      return result[0].id // UUID
    }

    return null
  } catch (err) {
    console.error(`Failed to get UUID for tag "${name}":`, err)
    return null
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  const { title, content, tags } = await request.json()
  console.log("Received data:", { title, content, tags })

  if (!title || !content) {
    return new Response("Missing title or content", { status: 400 })
  }

  try {
    const tagNames: string[] = tags || []

    const resolvedTags = await Promise.all(
        tagNames.map(async (name: string) => {
          const id = await getTagUuidByName(name)
          return id ? { type: "taxonomy_term--tags", id } : null
        })
      )
      
      const validTags = resolvedTags.filter((tag): tag is { type: string; id: string } => tag !== null)
      

    const blog = await drupal.createResource("node--blog", {
      data: {
        type: "node--blog",
        attributes: {
          title,
          field_blog_content: [content],
        },
        relationships: {
          field_tag: {
            data: validTags,
          },
        },
      },
    })

    return Response.json({ id: blog.id, path: blog.path?.alias || "/" })
  } catch (error) {
    console.error("Error creating blog:", error)
    return new Response("Error creating blog", { status: 500 })
  }
}
