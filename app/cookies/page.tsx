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

// Fallback data for cookie policy
function getFallbackPolicyPage(slug: string): PolicyPage | null {
  if (slug === 'cookies') {
    return {
      id: 'fallback-cookies',
      title: 'Cookie Policy',
      slug: 'cookies',
      content: `
        <h1>Cookie Policy</h1>
        <p>Last updated: ${new Date().toLocaleDateString()}</p>
        
        <h2>1. What Are Cookies</h2>
        <p>Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience and understand how you use our site.</p>
        
        <h2>2. How We Use Cookies</h2>
        <p>We use cookies for several purposes:</p>
        <ul>
          <li><strong>Essential cookies:</strong> These are necessary for the website to function properly</li>
          <li><strong>Analytics cookies:</strong> These help us understand how visitors interact with our website</li>
          <li><strong>Functional cookies:</strong> These remember your preferences and settings</li>
          <li><strong>Marketing cookies:</strong> These help us deliver relevant advertisements</li>
        </ul>
        
        <h2>3. Types of Cookies We Use</h2>
        <h3>Session Cookies</h3>
        <p>These cookies are temporary and are deleted when you close your browser. They help us maintain your session while you browse our website.</p>
        
        <h3>Persistent Cookies</h3>
        <p>These cookies remain on your device for a set period or until you delete them. They help us remember your preferences and provide personalized content.</p>
        
        <h2>4. Third-Party Cookies</h2>
        <p>We may use third-party services that place cookies on your device. These services help us with analytics, advertising, and other website functionality.</p>
        
        <h2>5. Managing Cookies</h2>
        <p>You can control and manage cookies in several ways:</p>
        <ul>
          <li>Browser settings: Most browsers allow you to block or delete cookies</li>
          <li>Cookie consent: We provide options to accept or decline non-essential cookies</li>
          <li>Third-party opt-outs: You can opt out of third-party cookies through their respective websites</li>
        </ul>
        
        <h2>6. Your Choices</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Accept or decline cookies</li>
          <li>Delete existing cookies</li>
          <li>Set your browser to block cookies</li>
          <li>Contact us with questions about our cookie usage</li>
        </ul>
        
        <h2>7. Updates to This Policy</h2>
        <p>We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
        
        <h2>8. Contact Us</h2>
        <p>If you have any questions about our Cookie Policy, please contact us at privacy@ohub.com.</p>
      `,
      metaTitle: 'Cookie Policy - OHUB',
      metaDescription: 'Learn about how OHUB uses cookies and your options for managing them.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  
  return null;
}

export default async function CookiePolicyPage() {
  const policyPage = await getPolicyPage('cookies');

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
                Cookie Policy
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
            <div 
              className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-900 prose-code:text-slate-800 prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
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
