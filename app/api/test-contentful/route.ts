import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

    if (!spaceId || !accessToken) {
      return NextResponse.json({
        status: 'error',
        message: 'Contentful environment variables not configured',
        spaceId: spaceId ? 'Set' : 'Not set',
        accessToken: accessToken ? 'Set' : 'Not set',
        instructions: [
          'Create a .env.local file in your project root',
          'Add CONTENTFUL_SPACE_ID=your_space_id',
          'Add CONTENTFUL_ACCESS_TOKEN=your_access_token',
          'Restart your development server'
        ]
      });
    }

    // Test the Contentful connection
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries?limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({
        status: 'error',
        message: 'Contentful API connection failed',
        statusCode: response.status,
        statusText: response.statusText,
        possibleIssues: [
          'Invalid space ID or access token',
          'Space ID or access token not found',
          'Network connectivity issues'
        ]
      });
    }

    const data = await response.json();

    return NextResponse.json({
      status: 'success',
      message: 'Contentful connection successful',
      spaceId: spaceId,
      totalItems: data.total,
      items: data.items?.length || 0,
      contentTypes: data.items?.map((item: any) => item.sys.contentType.sys.id) || [],
      nextSteps: [
        'Create a content type called "policyPage"',
        'Add entries with slugs: privacy-policy, term-of-service, cookies',
        'Publish the entries',
        'Visit the policy pages to see the content'
      ]
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
