# Contentful Setup Guide

## 🔧 Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```bash
# Contentful Configuration
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
CONTENTFUL_ENVIRONMENT=master
```

## 📋 Content Type Setup

### 1. Create Policy Page Content Type

In your Contentful space, create a new content type called `policyPage` with these fields:

| Field Name | Field Type | Required | Description |
|------------|------------|----------|-------------|
| `title` | Short text | ✅ | Page title |
| `slug` | Short text | ✅ | URL slug (e.g., "privacy-policy") |
| `content` | Rich text | ✅ | Page content |
| `metaTitle` | Short text | ❌ | SEO title |
| `metaDescription` | Long text | ❌ | SEO description |

### 2. Create Policy Page Entries

Create three entries with these slugs:

#### Privacy Policy Entry
- **Title:** Privacy Policy
- **Slug:** `privacy-policy`
- **Content:** Your privacy policy content
- **Meta Title:** Privacy Policy - OHUB
- **Meta Description:** Learn about how OHUB collects, uses, and protects your personal information.

#### Terms of Service Entry
- **Title:** Terms of Service
- **Slug:** `term-of-service`
- **Content:** Your terms of service content
- **Meta Title:** Terms of Service - OHUB
- **Meta Description:** Read OHUB's terms of service and user agreement.

#### Cookie Policy Entry
- **Title:** Cookie Policy
- **Slug:** `cookies`
- **Content:** Your cookie policy content
- **Meta Title:** Cookie Policy - OHUB
- **Meta Description:** Learn about how OHUB uses cookies and your options for managing them.

## 🔍 Testing the Integration

1. Set up your environment variables
2. Create the content type and entries in Contentful
3. Restart your development server
4. Visit the policy pages to see the content from Contentful

## 🐛 Troubleshooting

### If content is not loading:
1. Check that environment variables are set correctly
2. Verify the content type name is exactly `policyPage`
3. Ensure the slug values match exactly
4. Check the browser console for any API errors

### Common Issues:
- **400 Bad Request:** Check your space ID and access token
- **404 Not Found:** Verify the content type exists and entries are published
- **Fallback content showing:** Environment variables not set or API errors

## 📞 Support

If you need help setting up Contentful, refer to their [official documentation](https://www.contentful.com/developers/docs/).
