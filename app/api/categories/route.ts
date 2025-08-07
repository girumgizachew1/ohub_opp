import { NextRequest, NextResponse } from 'next/server';

// TypeScript interfaces
interface ContentfulCategory {
  sys: {
    id: string;
  };
  fields: {
    name: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
    sortOrder: number;
    isActive: boolean;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
}

interface ContentfulResponse {
  items: ContentfulCategory[];
  total: number;
}

export async function GET(request: NextRequest) {
  try {
    // Get environment variables
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
    const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';

    if (!spaceId || !accessToken) {
      console.error('Missing Contentful environment variables');
      return NextResponse.json(
        { error: 'Contentful configuration error' },
        { status: 500 }
      );
    }

    // Build Contentful API URL
    const url = new URL(`https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries`);
    url.searchParams.append('content_type', 'category');
    url.searchParams.append('fields.isActive', 'true');
    url.searchParams.append('order', 'fields.sortOrder');
    url.searchParams.append('select', 'sys.id,fields.name,fields.slug,fields.description,fields.icon,fields.color,fields.sortOrder,fields.isActive');

    // Fetch data from Contentful
    const response = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      next: { revalidate: 60 }, // Cache for 1 minute instead of 1 hour
    });

    if (!response.ok) {
      throw new Error(`Contentful API error: ${response.status} ${response.statusText}`);
    }

    const data: ContentfulResponse = await response.json();
    
    // Transform Contentful data to our format
    const categories: Category[] = data.items.map((item: ContentfulCategory) => ({
      id: item.sys.id,
      name: item.fields.name,
      slug: item.fields.slug,
      description: item.fields.description,
      icon: item.fields.icon,
      color: item.fields.color,
      sortOrder: item.fields.sortOrder,
      isActive: item.fields.isActive,
    }));

    // Return success response with cache headers
    return NextResponse.json(categories, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    
    // Return error response
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}