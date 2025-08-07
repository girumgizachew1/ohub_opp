import React from 'react';
import { notFound } from 'next/navigation';

// TypeScript interfaces
interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  deadline?: string;
  location?: string;
  type: 'scholarship' | 'internship' | 'job' | 'conference' | 'competition' | 'exchange';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

interface PageProps {
  params: {
    slug: string;
  };
}

// Fetch category data
async function getCategory(slug: string): Promise<Category | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/categories/${slug}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

// Fetch opportunities for category
async function getOpportunitiesByCategory(categorySlug: string): Promise<Opportunity[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/opportunities?category=${categorySlug}`, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });
    
    if (!response.ok) {
      return [];
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return [];
  }
}

const CategoryPage: React.FC<PageProps> = async ({ params }) => {
  const { slug } = params;

  // Fetch category and opportunities
  const [category, opportunities] = await Promise.all([
    getCategory(slug),
    getOpportunitiesByCategory(slug)
  ]);

  // If category doesn't exist, show 404
  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Category Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {category.name}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>{opportunities.length} opportunities available</span>
            <span>•</span>
            <span>Updated regularly</span>
          </div>
        </div>

        {/* Opportunities Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              Available Opportunities
            </h2>
            <div className="text-sm text-gray-500">
              Showing {opportunities.length} results
            </div>
          </div>

          {opportunities.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No opportunities found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any opportunities in this category at the moment.
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                ← Back to all opportunities
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opportunity) => (
                <div
                  key={opportunity.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
                        {opportunity.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {opportunity.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Type Badge */}
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {opportunity.type}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm text-gray-500">
                      {opportunity.location && (
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span>{opportunity.location}</span>
                        </div>
                      )}
                      {opportunity.deadline && (
                        <div className="flex items-center gap-2">
                          <span>⏰</span>
                          <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <a
                      href={`/opportunity/${opportunity.id}`}
                      className="block w-full text-center bg-gray-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage; 