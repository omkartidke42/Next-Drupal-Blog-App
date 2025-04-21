import { drupal } from "@/lib/drupal"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest): Promise<Response> {
  const { id } = await request.json()
  
  if (!id) {
    return new Response("Missing blog ID", { status: 400 })
  }
  
  try {
    await drupal.deleteResource("node--blog", id)
    return new Response("Blog deleted successfully", { status: 200 })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return new Response(`Error deleting blog: ${error.message}`, { status: 500 })
  }
}