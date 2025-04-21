// app/api/blog/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { drupal } from '@/lib/drupal';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, title, content } = body;
  
  if (!id) {
    return new NextResponse("Blog ID is required", { status: 400 });
  }
  
  try {
    // For development, skip the authentication check
    // In production, you would enable this check:
    // const user = await getUserFromRequest(request);
    // if (!user || !user.canEditBlog) {
    //   return new NextResponse("Forbidden", { status: 403 });
    // }
    
    // Mock user for development
    const user = { id: "dev-user", canEditBlog: true };
    
    // Update the blog using Drupal API
    const updatedBlog = await drupal.updateResource("node--blog", id, {
      data: {
        type: "node--blog",
        id,
        attributes: {
          title: title,
          field_blog_content: content, // Match the field name with what's used in GET
        },
      },
    });
    
    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    return new NextResponse(`Error while updating resource: ${error.message}`, { status: 500 });
  }
}

// Helper function to fetch the user from the request (not currently used in dev mode)
async function getUserFromRequest(request: NextRequest) {
  const authToken = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!authToken) {
    return null;
  }
  
  try {
    const user = await fetchUserFromAuthToken(authToken);
    return user;
  } catch (err) {
    console.error("Error getting user from auth token:", err);
    return null;
  }
}

// Mock function to simulate fetching a user from an auth token
async function fetchUserFromAuthToken(authToken: string) {
  // Replace with real authentication logic
  return {
    id: "user-id",
    canEditBlog: true,
  };
}