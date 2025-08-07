import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import type { Document } from '@contentful/rich-text-types';

// Helper function to convert rich text to HTML manually
function convertRichTextToHtml(richText: any): string {
  if (!richText || !richText.content) {
    return '<p>Content could not be loaded.</p>';
  }

  let html = '';

  for (const node of richText.content) {
    if (node.nodeType === 'paragraph') {
      html += '<p>';
      if (node.content) {
        for (const textNode of node.content) {
          let text = textNode.value || '';
          if (textNode.marks) {
            for (const mark of textNode.marks) {
              switch (mark.type) {
                case 'bold':
                  text = `<strong>${text}</strong>`;
                  break;
                case 'italic':
                  text = `<em>${text}</em>`;
                  break;
                case 'underline':
                  text = `<u>${text}</u>`;
                  break;
                case 'code':
                  text = `<code>${text}</code>`;
                  break;
              }
            }
          }
          html += text;
        }
      }
      html += '</p>';
    } else if (node.nodeType === 'heading-1') {
      html += '<h1>';
      if (node.content) {
        for (const textNode of node.content) {
          html += textNode.value || '';
        }
      }
      html += '</h1>';
    } else if (node.nodeType === 'heading-2') {
      html += '<h2>';
      if (node.content) {
        for (const textNode of node.content) {
          html += textNode.value || '';
        }
      }
      html += '</h2>';
    } else if (node.nodeType === 'heading-3') {
      html += '<h3>';
      if (node.content) {
        for (const textNode of node.content) {
          html += textNode.value || '';
        }
      }
      html += '</h3>';
    } else if (node.nodeType === 'unordered-list') {
      html += '<ul>';
      if (node.content) {
        for (const listItem of node.content) {
          html += '<li>';
          if (listItem.content) {
            for (const textNode of listItem.content) {
              html += textNode.value || '';
            }
          }
          html += '</li>';
        }
      }
      html += '</ul>';
    } else if (node.nodeType === 'ordered-list') {
      html += '<ol>';
      if (node.content) {
        for (const listItem of node.content) {
          html += '<li>';
          if (listItem.content) {
            for (const textNode of listItem.content) {
              html += textNode.value || '';
            }
          }
          html += '</li>';
        }
      }
      html += '</ol>';
    } else if (node.nodeType === 'embedded-asset-block') {
      // Handle embedded images
      if (node.data && node.data.target && node.data.target.fields) {
        const imageUrl = node.data.target.fields.file?.url;
        const imageTitle = node.data.target.fields.title || 'Image';
        const imageDescription = node.data.target.fields.description || '';

        if (imageUrl) {
          let finalUrl = imageUrl;
          if (imageUrl.startsWith('//')) {
            finalUrl = `https:${imageUrl}`;
          } else if (!imageUrl.startsWith('http')) {
            finalUrl = `https://${imageUrl}`;
          }

          html += `<div class="my-6">
            <img src="${finalUrl}" alt="${imageTitle}" class="w-full h-auto rounded-lg shadow-lg" />
            ${imageDescription ? `<p class="text-sm text-gray-600 mt-2 text-center">${imageDescription}</p>` : ''}
          </div>`;
        }
      }
    } else if (node.nodeType === 'embedded-entry-block') {
      // Handle embedded entries (like rich content blocks)
      if (node.data && node.data.target) {
        html += `<div class="my-4 p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-600">Embedded content</p>
        </div>`;
      }
    }
  }

  return html || '<p>Content could not be loaded.</p>';
}

       // Custom renderer that handles images properly
       function convertRichTextWithImages(richText: any, data?: any): string {
  if (!richText || !richText.content) {
    return '<p>Content could not be loaded.</p>';
  }

  let html = '';

  for (const node of richText.content) {
    if (node.nodeType === 'paragraph') {
      html += '<p class="mb-4 leading-relaxed">';
      if (node.content) {
        for (const textNode of node.content) {
          let text = textNode.value || '';
          if (textNode.marks) {
            for (const mark of textNode.marks) {
              switch (mark.type) {
                case 'bold':
                  text = `<strong>${text}</strong>`;
                  break;
                case 'italic':
                  text = `<em>${text}</em>`;
                  break;
                case 'underline':
                  text = `<u>${text}</u>`;
                  break;
                case 'code':
                  text = `<code class="bg-gray-100 px-2 py-1 rounded text-sm">${text}</code>`;
                  break;
              }
            }
          }
          html += text;
        }
      }
      html += '</p>';
    } else if (node.nodeType === 'heading-1') {
      html += '<h1 class="text-3xl font-bold text-gray-900 mb-6 mt-8">';
      if (node.content) {
        for (const textNode of node.content) {
          html += textNode.value || '';
        }
      }
      html += '</h1>';
    } else if (node.nodeType === 'heading-2') {
      html += '<h2 class="text-2xl font-semibold text-gray-800 mb-4 mt-6">';
      if (node.content) {
        for (const textNode of node.content) {
          html += textNode.value || '';
        }
      }
      html += '</h2>';
    } else if (node.nodeType === 'heading-3') {
      html += '<h3 class="text-xl font-medium text-gray-800 mb-3 mt-5">';
      if (node.content) {
        for (const textNode of node.content) {
          html += textNode.value || '';
        }
      }
      html += '</h3>';
    } else if (node.nodeType === 'unordered-list') {
      html += '<ul class="list-disc pl-6 mb-4 space-y-2">';
      if (node.content) {
        for (const listItem of node.content) {
          html += '<li>';
          if (listItem.content) {
            for (const textNode of listItem.content) {
              html += textNode.value || '';
            }
          }
          html += '</li>';
        }
      }
      html += '</ul>';
    } else if (node.nodeType === 'ordered-list') {
      html += '<ol class="list-decimal pl-6 mb-4 space-y-2">';
      if (node.content) {
        for (const listItem of node.content) {
          html += '<li>';
          if (listItem.content) {
            for (const textNode of listItem.content) {
              html += textNode.value || '';
            }
          }
          html += '</li>';
        }
      }
      html += '</ol>';
    } else if (node.nodeType === 'embedded-asset-block') {
      // Handle embedded images with proper styling
      if (node.data && node.data.target) {
        const assetId = node.data.target.sys?.id;
        let imageUrl = '';
        let imageTitle = 'Content Image';
        let imageDescription = '';

        // Try to get image data from the target directly
        if (node.data.target.fields) {
          imageUrl = node.data.target.fields.file?.url;
          imageTitle = node.data.target.fields.title || 'Content Image';
          imageDescription = node.data.target.fields.description || '';
        }
        // If not found, try to find it in the includes
        else if (assetId && data.includes && data.includes.Asset) {
          const asset = data.includes.Asset.find((asset: any) => asset.sys.id === assetId);
          if (asset) {
            imageUrl = asset.fields.file.url;
            imageTitle = asset.fields.title || 'Content Image';
            imageDescription = asset.fields.description || '';
          }
        }

        if (imageUrl) {
          let finalUrl = imageUrl;
          if (imageUrl.startsWith('//')) {
            finalUrl = `https:${imageUrl}`;
          } else if (!imageUrl.startsWith('http')) {
            finalUrl = `https://${imageUrl}`;
          }

          html += `<div class="my-6">
            <div class="relative w-full p-1 border border-border rounded-lg bg-zinc-200">
              <img 
                src="${finalUrl}" 
                alt="${imageTitle}" 
                class="w-full h-auto rounded-lg border border-border"
                style="max-width: 100%; height: auto;"
              />
            </div>
            ${imageDescription ? `<p class="text-sm text-slate-500 mt-2 text-center italic">${imageDescription}</p>` : ''}
          </div>`;
        }
      }
    } else if (node.nodeType === 'embedded-entry-block') {
      // Handle embedded entries (like rich content blocks)
      if (node.data && node.data.target) {
        html += `<div class="my-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p class="text-sm text-gray-600 mb-2">📄 Embedded content</p>
          <div class="text-gray-800">Content block</div>
        </div>`;
      }
    } else if (node.nodeType === 'blockquote') {
      html += '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-6">';
      if (node.content) {
        for (const textNode of node.content) {
          html += textNode.value || '';
        }
      }
      html += '</blockquote>';
    }
  }

  return html || '<p>Content could not be loaded.</p>';
}

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
    content: string | any; // Can be string or rich text object
    body?: string | any; // Alternative content field
    text?: string | any; // Alternative content field
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
    image?: {
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
    thumbnail?: {
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

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Fetch guideline by slug
async function getGuidelineBySlug(slug: string): Promise<Guideline | null> {
  try {
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
    const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';

    if (!spaceId || !accessToken) {
      return null;
    }

    const url = new URL(`https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries`);
    url.searchParams.append('content_type', 'guideline');
    url.searchParams.append('fields.slug', slug);
    url.searchParams.append('include', '10'); // Include all linked assets (images)
    url.searchParams.append('limit', '1');



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

    if (data.items.length === 0) {
      return null;
    }

    const item = data.items[0];


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
    // Check for alternative image field names
    else if (item.fields.image && item.fields.image.fields && item.fields.image.fields.file) {
      const imageUrl = item.fields.image.fields.file.url;

      let finalUrl = imageUrl;
      if (imageUrl.startsWith('//')) {
        finalUrl = `https:${imageUrl}`;
      } else if (!imageUrl.startsWith('http')) {
        finalUrl = `https://${imageUrl}`;
      }

      featuredImage = {
        url: finalUrl,
        alt: item.fields.image.fields.title || 'Guideline Image',
        width: item.fields.image.fields.file.details?.image?.width || 1200,
        height: item.fields.image.fields.file.details?.image?.height || 630,
      };
    }
    // Check for thumbnail field
    else if (item.fields.thumbnail && item.fields.thumbnail.fields && item.fields.thumbnail.fields.file) {
      const imageUrl = item.fields.thumbnail.fields.file.url;

      let finalUrl = imageUrl;
      if (imageUrl.startsWith('//')) {
        finalUrl = `https:${imageUrl}`;
      } else if (!imageUrl.startsWith('http')) {
        finalUrl = `https://${imageUrl}`;
      }

      featuredImage = {
        url: finalUrl,
        alt: item.fields.thumbnail.fields.title || 'Guideline Image',
        width: item.fields.thumbnail.fields.file.details?.image?.width || 1200,
        height: item.fields.thumbnail.fields.file.details?.image?.height || 630,
      };
    }

    // Handle content - check for different possible field names
    let content = '';
    const contentField = item.fields.content || item.fields.body || item.fields.text || item.fields.description;

    if (typeof contentField === 'string') {
      content = contentField;
    } else if (contentField && typeof contentField === 'object') {
      // If it's a rich text object, convert it to HTML
      try {
        // Use custom renderer for better image handling
        content = convertRichTextWithImages(contentField, data);
      } catch (error) {
        // Fallback: try to manually convert common rich text elements
        content = convertRichTextToHtml(contentField);
      }
    }

    const guideline: Guideline = {
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

    return guideline;
  } catch (error) {
    // If it's a network error, return a fallback guideline
    if (error instanceof Error && error.message.includes('fetch failed')) {
      return {
        id: 'fallback',
        title: 'Guideline Temporarily Unavailable',
        slug: slug,
        description: 'We are experiencing connectivity issues. Please try again later.',
        content: '<p>This guideline is temporarily unavailable due to network connectivity issues. Please check your internet connection and try again.</p>',
        featuredImage: {
          url: '',
          alt: '',
          width: 0,
          height: 0,
        },
        metaTitle: 'Guideline Temporarily Unavailable',
        metaDescription: 'This guideline is temporarily unavailable due to network connectivity issues.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return null;
  }
}

const GuidelinePage: React.FC<PageProps> = async ({ params }) => {
  const { slug } = await params;
  const guideline = await getGuidelineBySlug(slug);
  console.log(guideline)
  if (!guideline) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="relative mt-10">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-r from-indigo-400/8 to-pink-400/8 rounded-full blur-3xl"></div>
        </div>


        {/* Article Header with Thumbnail */}
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="overflow-hidden">
            {/* Article Header */}
            <div className="py-8">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-sm font-semibold text-white mb-6">
                  <div className="w-2 h-2 bg-white rounded-md animate-pulse"></div>
                  Expert Knowledge
                </div>

                {guideline.id === 'fallback' && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-yellow-800 font-semibold">Network connectivity issue detected</span>
                    </div>
                  </div>
                )}

                <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                  {guideline.title}
                </h1>
                {/*                 
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8 max-w-4xl">
                  {guideline.description}
                </p> */}

                {/* Thumbnail Image */}
                {guideline.featuredImage.url && (
                  <div className="mb-8">
                    <div className="relative w-full p-1 border border-border rounded-lg bg-zinc-200">
                      <Image
                        src={guideline.featuredImage.url}
                        alt={guideline.featuredImage.alt}
                        width={1200}
                        height={630}
                        className="w-full h-auto rounded-lg border border-border"
                        priority
                        unoptimized
                      />
                    </div>
                  </div>
                )}

                {/* Meta Info with Icons */}
                <div className="flex flex-wrap items-center gap-8 text-sm text-slate-500">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-700">Published</div>
                      <div className="text-slate-500">{new Date(guideline.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-700">OHUB Team</div>
                      <div className="text-slate-500">Expert Content</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="py-2">
              <div className="prose prose-base max-w-none">
                <div
                  className="text-slate-900 leading-relaxed space-y-6 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-slate-900 [&>h1]:mb-6 [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:text-slate-800 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-medium [&>h3]:text-slate-800 [&>h3]:mb-3 [&>p]:text-base [&>p]:leading-relaxed [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>li]:mb-2 [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-600 [&>blockquote]:mb-4 [&>strong]:font-semibold [&>em]:italic [&>u]:underline [&>code]:bg-slate-100 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm [&>img]:rounded-lg [&>img]:shadow-lg [&>img]:my-6"
                  dangerouslySetInnerHTML={{ __html: guideline.content }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-16 mt-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready for more expert insights?
          </h2>
          <p className="text-slate-300 mb-8 text-lg">
            Explore our complete collection of guidelines and unlock your full potential
          </p>
          <Link
            href="/guideline"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span>Browse All Guidelines</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuidelinePage; 