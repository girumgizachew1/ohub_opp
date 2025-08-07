import { NextRequest, NextResponse } from 'next/server';

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

// Fallback data for policy pages
function getFallbackPolicyPage(slug: string): PolicyPage | null {
  const fallbackData: Record<string, PolicyPage> = {
    'privacy-policy': {
      id: 'fallback-privacy',
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      content: `
        <h1>Privacy Policy</h1>
        <p>Last updated: ${new Date().toLocaleDateString()}</p>
        
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support.</p>
        
        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, communicate with you, and personalize your experience.</p>
        
        <h2>3. Information Sharing</h2>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
        
        <h2>4. Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        
        <h2>5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Update or correct your information</li>
          <li>Delete your personal information</li>
          <li>Opt out of marketing communications</li>
          <li>Request data portability</li>
        </ul>
        
        <h2>6. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at privacy@ohub.com.</p>
      `,
      metaTitle: 'Privacy Policy - OHUB',
      metaDescription: 'Learn about how OHUB collects, uses, and protects your personal information.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    'term-of-service': {
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
    },
    'cookies': {
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
    },
  };

  return fallbackData[slug] || null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

    if (!spaceId || !accessToken) {
      console.log('Contentful not configured, returning fallback data');
      const fallbackPage = getFallbackPolicyPage(slug);
      if (!fallbackPage) {
        return NextResponse.json({ error: 'Policy page not found' }, { status: 404 });
      }
      return NextResponse.json(fallbackPage);
    }

    const response = await fetch(
      `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries?content_type=policyPage&fields.slug=${slug}&include=2`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Contentful API error:', response.status);
      const fallbackPage = getFallbackPolicyPage(slug);
      if (!fallbackPage) {
        return NextResponse.json({ error: 'Policy page not found' }, { status: 404 });
      }
      return NextResponse.json(fallbackPage);
    }

    const data: ContentfulResponse = await response.json();
    
    if (data.items.length === 0) {
      const fallbackPage = getFallbackPolicyPage(slug);
      if (!fallbackPage) {
        return NextResponse.json({ error: 'Policy page not found' }, { status: 404 });
      }
      return NextResponse.json(fallbackPage);
    }

    const item = data.items[0];
    const content = typeof item.fields.content === 'string' 
      ? item.fields.content 
      : convertRichTextToHtml(item.fields.content);

    const policyPage: PolicyPage = {
      id: item.sys.id,
      title: item.fields.title,
      slug: item.fields.slug,
      content: content,
      metaTitle: item.fields.metaTitle,
      metaDescription: item.fields.metaDescription,
      createdAt: item.sys.createdAt,
      updatedAt: item.sys.updatedAt,
    };

    return NextResponse.json(policyPage);
  } catch (error) {
    console.error('Error fetching policy page:', error);
    const { slug } = await params;
    const fallbackPage = getFallbackPolicyPage(slug);
    if (!fallbackPage) {
      return NextResponse.json({ error: 'Policy page not found' }, { status: 404 });
    }
    return NextResponse.json(fallbackPage);
  }
}
