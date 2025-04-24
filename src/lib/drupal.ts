// src/lib/drupal.ts
import { DrupalClient } from "next-drupal"

export const drupal = new DrupalClient(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL!, {
  auth: {
    clientId: process.env.DRUPAL_CLIENT_ID!,
    clientSecret: process.env.DRUPAL_CLIENT_SECRET!,
  },
  // Add any other default configuration here
})

export async function getSearchResults(indexName: string, query: any = {}) {
  try {
    // Construct the URL
    const url = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/index/${indexName}`;
    
    // Convert query to URLSearchParams
    const params = new URLSearchParams();
    
    // Add fulltext filter
    if (query.searchTerm) {
      params.append('filter[fulltext]', query.searchTerm);
    }
    
    // Add other filters
    if (query.filters) {
      Object.entries(query.filters).forEach(([key, value]) => {
        params.append(`filter[${key}]`, String(value));
      });
    }
    
    // Add includes
    if (query.include) {
      params.append('include', query.include);
    }
    
    // Add fields
    if (query.fields) {
      Object.entries(query.fields).forEach(([type, fields]) => {
        params.append(`fields[${type}]`, String(fields));
      });
    }
    
    // Get access token if using authentication
    let headers: Record<string, string> = {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    };
    
    // Add authorization if credentials are provided
    if (process.env.DRUPAL_CLIENT_ID && process.env.DRUPAL_CLIENT_SECRET) {
      const authString = Buffer.from(`${process.env.DRUPAL_CLIENT_ID}:${process.env.DRUPAL_CLIENT_SECRET}`).toString('base64');
      headers['Authorization'] = `Basic ${authString}`;
    }
    
    // Make the request
    const response = await fetch(`${url}?${params.toString()}`, {
      headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Search failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}