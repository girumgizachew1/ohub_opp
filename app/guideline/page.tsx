import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// TypeScript interfaces
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
    content: string;
    featuredImage?: {
      sys?: {
        id: string;
        type: string;
        linkType: string;
      };
      fields?: {
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

interface ContentfulAsset {
  sys: {
    id: string;
    type: string;
  };
  fields: {
    title: string;
    description?: string;
    file: {
      url: string;
      details: {
        image: {
          width: number;
          height: number;
        };
      };
    };
  };
}

interface ContentfulResponse {
  items: ContentfulGuideline[];
  includes?: {
    Asset?: ContentfulAsset[];
  };
}

// Fetch guidelines from Contentful
async function getGuidelines(): Promise<Guideline[]> {
  try {
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
    const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';

    if (!spaceId || !accessToken) {
      console.log('Contentful not configured');
      return [];
    }

    const url = new URL(`https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries`);
    url.searchParams.append('content_type', 'guideline');
    url.searchParams.append('order', '-sys.createdAt');
    url.searchParams.append('include', '2'); // Include linked assets (images)
    url.searchParams.append('select', 'sys.id,sys.createdAt,sys.updatedAt,fields.title,fields.slug,fields.description,fields.content,fields.featuredImage,fields.metaTitle,fields.metaDescription');

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
    
    const guidelines: Guideline[] = data.items.map((item: ContentfulGuideline) => {
      // Safely handle featuredImage
      let featuredImage = {
        url: '',
        alt: '',
        width: 0,
        height: 0,
      };

      // Check for featuredImage field - handle both direct fields and linked assets
      if (item.fields.featuredImage) {
        // If it's a linked asset (has sys.id), we need to find it in the includes
        if (item.fields.featuredImage.sys && item.fields.featuredImage.sys.id) {
          const assetId = item.fields.featuredImage.sys.id;

          // Look for the asset in the includes
          if (data.includes && data.includes.Asset) {
            const asset = data.includes.Asset.find((asset: any) => asset.sys.id === assetId);
            if (asset) {
              const imageUrl = asset.fields.file.url;

              // Ensure proper URL formatting
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
        }
        // If it has direct fields (old format)
        else if (item.fields.featuredImage.fields && item.fields.featuredImage.fields.file) {
          const imageUrl = item.fields.featuredImage.fields.file.url;

          // Ensure proper URL formatting
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
        content: item.fields.content,
        featuredImage,
        metaTitle: item.fields.metaTitle,
        metaDescription: item.fields.metaDescription,
        createdAt: item.sys.createdAt,
        updatedAt: item.sys.updatedAt,
      };
    });

    return guidelines;
  } catch (error) {
    console.error('Error fetching guidelines:', error);
    return [];
  }
}

const GuidelinesPage: React.FC = async () => {
  const guidelines = await getGuidelines();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-indigo-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/20 shadow-lg mb-8">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700">Expert Knowledge Base</span>
            </div>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-6 tracking-tight">
              Guidelines Hub
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
              Master your academic and professional journey with our comprehensive collection of expert guides, 
              tips, and strategies curated to help you succeed.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-1">{guidelines.length}</div>
                <div className="text-sm text-slate-500">Expert Guides</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-1">24/7</div>
                <div className="text-sm text-slate-500">Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-1">100%</div>
                <div className="text-sm text-slate-500">Free Access</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guidelines Grid */}
      <div className="relative max-w-7xl mx-auto px-6 pb-24">
        {guidelines.length === 0 ? (
          <div className="text-center py-32">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              No guidelines yet
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Our expert guidelines will appear here once they're published. 
              Check back soon for valuable insights and strategies.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guidelines.map((guideline, index) => (
              <Link
                key={guideline.id}
                href={`/guideline/${guideline.slug}`}
                className="group relative block"
              >
                {/* Card with Gradient Border */}
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100">
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white rounded-2xl m-0.5 overflow-hidden">
                    {/* Thumbnail with Overlay */}
                    {guideline.featuredImage.url ? (
                      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                        <div className="relative w-full h-full p-1 border border-border rounded-lg bg-zinc-200">
                          <Image
                            src={guideline.featuredImage.url}
                            alt={guideline.featuredImage.alt}
                            fill
                            className="object-cover rounded-lg border border-border group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            unoptimized
                          />
                        </div>
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                        
                        {/* Floating Badge */}
                        <div className="absolute top-4 left-4">
                          <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-700 shadow-lg">
                            Guide #{index + 1}
                          </div>
                        </div>
                        
                        {/* Read More Indicator */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-600 shadow-sm">
                            Guide #{index + 1}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors line-clamp-2 leading-tight">
                        {guideline.title}
                      </h2>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {guideline.description}
                      </p>
                      
                      {/* Meta Info with Icons */}
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>
                            {new Date(guideline.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-medium text-slate-600">
                          <span>Read guide</span>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA Section */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to level up your skills?
          </h2>
          <p className="text-slate-300 mb-8 text-lg">
            Explore our comprehensive guidelines and unlock your full potential
          </p>
          <div className="flex justify-center gap-4">
            <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/20">
              {guidelines.length} Expert Guides
            </div>
            <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/20">
              100% Free Access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidelinesPage;