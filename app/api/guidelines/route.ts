import { NextResponse } from 'next/server';

// TypeScript interfaces
interface ContentfulGuideline {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    slug: string;
    description: string;
    content: string | any;
    featuredImage: {
      fields: {
        file: {
          url: string;
          details: {
            image: {
              width: number;
              height: number;
            };
          };
        };
        title: string;
      };
    };
    metaTitle: string;
    metaDescription: string;
  };
}

interface ContentfulResponse {
  items: ContentfulGuideline[];
}

interface Guideline {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  featuredImage: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

export async function GET() {
  try {
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
    const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';

    if (!spaceId || !accessToken) {
      console.log('Contentful not configured');
      return NextResponse.json([]);
    }

    const url = new URL(`https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries`);
    url.searchParams.append('content_type', 'guideline');
    url.searchParams.append('include', '2'); // Include linked assets (images)
    url.searchParams.append('select', 'sys.id,sys.createdAt,sys.updatedAt,fields.title,fields.slug,fields.description,fields.content,fields.featuredImage,fields.metaTitle,fields.metaDescription');
    url.searchParams.append('order', '-sys.createdAt'); // Most recent first

    const response = await fetch(url.toString(), {
      headers: { 
        'Authorization': `Bearer ${accessToken}`, 
        'Content-Type': 'application/json'
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      throw new Error(`Contentful API error: ${response.status} ${response.statusText}`);
    }

    const data: ContentfulResponse = await response.json();
    
    const guidelines: Guideline[] = data.items.map(item => {
      // Handle featuredImage
      let featuredImage = {
        url: '',
        alt: '',
        width: 0,
        height: 0,
      };

      if (item.fields.featuredImage && item.fields.featuredImage.fields && item.fields.featuredImage.fields.file) {
        const imageUrl = item.fields.featuredImage.fields.file.url;
        featuredImage = {
          url: imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl,
          alt: item.fields.featuredImage.fields.title || 'Guideline Image',
          width: item.fields.featuredImage.fields.file.details?.image?.width || 1200,
          height: item.fields.featuredImage.fields.file.details?.image?.height || 630,
        };
      }

      // Handle content
      let content = '';
      if (typeof item.fields.content === 'string') {
        content = item.fields.content;
      } else if (item.fields.content && typeof item.fields.content === 'object') {
        content = JSON.stringify(item.fields.content); // For now, just stringify
      }

      return {
        id: item.sys.id,
        title: item.fields.title,
        slug: item.fields.slug,
        description: item.fields.description,
        content: content,
        featuredImage,
        metaTitle: item.fields.metaTitle,
        metaDescription: item.fields.metaDescription,
        createdAt: item.sys.createdAt,
        updatedAt: item.sys.updatedAt,
      };
    });

    return NextResponse.json(guidelines);
  } catch (error) {
    console.error('Error fetching guidelines:', error);
    return NextResponse.json([]);
  }
} 