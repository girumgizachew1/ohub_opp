import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// TypeScript interfaces
interface PolicyPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

interface ContentfulPolicyPage {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    slug: string;
    content: string | any;
    metaTitle: string;
    metaDescription: string;
  };
}

interface ContentfulResponse {
  items: ContentfulPolicyPage[];
}

// Helper function to convert rich text to HTML
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
    }
  }

  return html;
}

// Fetch policy page data from Contentful
async function getPolicyPage(slug: string): Promise<PolicyPage | null> {
  try {
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

    if (!spaceId || !accessToken) {
      console.log('Contentful not configured, returning fallback data');
      console.log('To configure Contentful:');
      console.log('1. Create a .env.local file in your project root');
      console.log('2. Add CONTENTFUL_SPACE_ID=your_space_id');
      console.log('3. Add CONTENTFUL_ACCESS_TOKEN=your_access_token');
      console.log('4. Restart your development server');
      return getFallbackPolicyPage(slug);
    }

    const response = await fetch(
      `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries?content_type=policyPage&fields.slug=${slug}&include=2`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      console.error('Contentful API error:', response.status);
      return getFallbackPolicyPage(slug);
    }

    const data: ContentfulResponse = await response.json();
    
    if (data.items.length === 0) {
      return getFallbackPolicyPage(slug);
    }

    const item = data.items[0];
    const content = typeof item.fields.content === 'string' 
      ? item.fields.content 
      : convertRichTextToHtml(item.fields.content);

    return {
      id: item.sys.id,
      title: item.fields.title,
      slug: item.fields.slug,
      content: content,
      metaTitle: item.fields.metaTitle,
      metaDescription: item.fields.metaDescription,
      createdAt: item.sys.createdAt,
      updatedAt: item.sys.updatedAt,
    };
  } catch (error) {
    console.error('Error fetching policy page:', error);
    return getFallbackPolicyPage(slug);
  }
}

// Fallback data for terms of service
function getFallbackPolicyPage(slug: string): PolicyPage | null {
  if (slug === 'term-of-service') {
    return {
      id: 'fallback-terms',
      title: 'Terms of Service',
      slug: 'term-of-service',
      content: `
        <h1>Terms of Service</h1>
        <p>Last updated: ${new Date().toLocaleDateString()}</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using OHUB's services, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials on OHUB's website for personal, non-commercial transitory viewing only.</p>
        
        <h2>3. Disclaimer</h2>
        <p>The materials on OHUB's website are provided on an 'as is' basis. OHUB makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        
        <h2>4. Limitations</h2>
        <p>In no event shall OHUB or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on OHUB's website.</p>
        
        <h2>5. Accuracy of Materials</h2>
        <p>The materials appearing on OHUB's website could include technical, typographical, or photographic errors. OHUB does not warrant that any of the materials on its website are accurate, complete or current.</p>
        
        <h2>6. Links</h2>
        <p>OHUB has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by OHUB of the site.</p>
        
        <h2>7. Modifications</h2>
        <p>OHUB may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.</p>
        
        <h2>8. Contact Information</h2>
        <p>If you have any questions about these Terms of Service, please contact us at legal@ohub.com.</p>
      `,
      metaTitle: 'Terms of Service - OHUB',
      metaDescription: 'Read OHUB\'s terms of service and user agreement.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  
  return null;
}

export default async function TermsOfServicePage() {
  const policyPage = await getPolicyPage('term-of-service');

  if (!policyPage) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="relative pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-r from-indigo-400/8 to-pink-400/8 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-gray-900 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li className="text-gray-900 font-medium">
                Terms of Service
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-sm font-semibold text-white mb-6">
              <div className="w-2 h-2 bg-white rounded-md animate-pulse"></div>
              Legal Information
            </div>
            
            <h1 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">
              {policyPage.title}
            </h1>
            
            <div className="flex items-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Last updated: {new Date(policyPage.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 lg:p-12">
            {policyPage.id.startsWith('fallback') && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-blue-800 font-semibold">Contentful Not Configured</span>
                </div>
                <p className="text-blue-700 text-sm">
                  This is fallback content. To display content from Contentful, please configure your environment variables and create the content in Contentful.
                </p>
                <div className="mt-3">
                  <a 
                    href="/api/test-contentful" 
                    target="_blank" 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                  >
                    Test Contentful Connection →
                  </a>
                </div>
              </div>
            )}
            <div 
              className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-900 prose-code:text-slate-800 prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:mb-2"
              dangerouslySetInnerHTML={{ __html: policyPage.content }}
            />
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
