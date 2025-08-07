import HeroSection from "./__components/hero-section";
import { statistics, categories } from "./__components/data";
import GuidelinesSection from "./__components/guidelines-section";

// Fetch latest guidelines from Contentful
async function getLatestGuidelines(): Promise<any[]> {
  try {
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
    const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';

    if (!spaceId || !accessToken) {
      return [];
    }

    const url = new URL(`https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries`);
    url.searchParams.append('content_type', 'guideline');
    url.searchParams.append('order', '-sys.createdAt');
    url.searchParams.append('limit', '3'); // Only get latest 3
    url.searchParams.append('include', '2');
    url.searchParams.append('select', 'sys.id,sys.createdAt,fields.title,fields.slug,fields.description,fields.featuredImage');

    const response = await fetch(url.toString(), {
      headers: { 
        'Authorization': `Bearer ${accessToken}`, 
        'Content-Type': 'application/json'
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    
    return data.items.map((item: any) => {
      let featuredImage = {
        url: '',
        alt: '',
        width: 0,
        height: 0,
      };

      // Handle featuredImage
      if (item.fields.featuredImage) {
        if (item.fields.featuredImage.sys && item.fields.featuredImage.sys.id) {
          const assetId = item.fields.featuredImage.sys.id;
          if (data.includes && data.includes.Asset) {
            const asset = data.includes.Asset.find((asset: any) => asset.sys.id === assetId);
            if (asset) {
              const imageUrl = asset.fields.file.url;
              let finalUrl = imageUrl;
              if (imageUrl.startsWith('//')) {
                finalUrl = `https:${imageUrl}`;
              } else if (!imageUrl.startsWith('http')) {
                finalUrl = `https://${imageUrl}`;
              }

              featuredImage = {
                url: finalUrl,
                alt: asset.fields.title || 'Guideline Image',
                width: asset.fields.file.details?.image?.width || 1200,
                height: asset.fields.file.details?.image?.height || 630,
              };
            }
          }
        } else if (item.fields.featuredImage.fields && item.fields.featuredImage.fields.file) {
          const imageUrl = item.fields.featuredImage.fields.file.url;
          let finalUrl = imageUrl;
          if (imageUrl.startsWith('//')) {
            finalUrl = `https:${imageUrl}`;
          } else if (!imageUrl.startsWith('http')) {
            finalUrl = `https://${imageUrl}`;
          }

          featuredImage = {
            url: finalUrl,
            alt: item.fields.featuredImage.fields.title || 'Guideline Image',
            width: item.fields.featuredImage.fields.file.details?.image?.width || 1200,
            height: item.fields.featuredImage.fields.file.details?.image?.height || 630,
          };
        }
      }

      return {
        id: item.sys.id,
        title: item.fields.title,
        slug: item.fields.slug,
        description: item.fields.description,
        featuredImage,
        createdAt: item.sys.createdAt,
      };
    });
  } catch (error) {
    console.error('Error fetching guidelines:', error);
    return [];
  }
}

export default async function Home() {
  const latestGuidelines = await getLatestGuidelines();
  return (
    <div className="min-h-screen bg-background">
      <HeroSection statistics={statistics} />
      <GuidelinesSection guidelines={latestGuidelines} />
    </div>
  );
}
