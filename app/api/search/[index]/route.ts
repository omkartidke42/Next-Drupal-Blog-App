// import { NextRequest, NextResponse } from 'next/server';
// import { drupal } from '@/lib/drupal';

// export async function POST(
//   request: NextRequest,
//   { params }: { params: { index: string } }
// ) {
//   try {
//     const { index } =  params;
    
//     // Parse the request body
//     const body = await  request.json();
    
//     // Get search results from Drupal Search API
//     const results = await drupal.getSearchIndex(
//       index,
//       body
//     );
    
//     // Return the results
//     return NextResponse.json(results);
//   } catch (error: any) {
//     console.error("Search API error:", error);
//     return NextResponse.json(
//       { message: "Search API error", error: error.message },
//       { status: 500 }
//     );
//   }
// }
// app/api/search/[index]/route.ts
// app/api/search/route.ts



import { NextRequest, NextResponse } from 'next/server';
import { drupal } from '@/lib/drupal';

// In your Next.js API route
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const indexName = 'search_api_index'; // Use your exact index machine name
    
    const url = new URL(`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/index/${indexName}`);
    
    // Add query parameters
    url.searchParams.append('fields[node--blog]', 'title,created,field_images');
    url.searchParams.append('filter[fulltext]', body.searchTerm); // Corrected parameter
    url.searchParams.append('filter[status]', '1');
    url.searchParams.append('include', 'field_images');
    
    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      }
    });
    
    // ... rest of your error handling
  }
}