import Image from "next/image";
import Link from "next/link";

// Guidelines data interface
interface Guideline {
  id: string;
  title: string;
  description: string;
  slug: string;
  featuredImage: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  createdAt: string;
}

interface GuidelinesSectionProps {
  guidelines: Guideline[];
}

export default function GuidelinesSection({ guidelines }: GuidelinesSectionProps) {
  return (
    <section className="py-24 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header - Matching Guidelines Page Style */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/20 shadow-lg mb-8">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700">Expert Knowledge Base</span>
          </div>
          
          <h2 className="text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-6 tracking-tight">
            Latest Guidelines
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Master your academic and professional journey with our comprehensive collection of expert guides, 
            tips, and strategies curated to help you succeed.
          </p>
        </div>

        {/* Guidelines Grid - Exact Match to Guidelines Page */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guidelines.map((guideline, index) => (
            <Link
              key={guideline.id}
              href={`/guideline/${guideline.slug}`}
              className="group relative block"
            >
              {/* Card with Gradient Border - Exact Match */}
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
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors line-clamp-2 leading-tight">
                      {guideline.title}
                    </h3>
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

        {/* CTA Section - Matching Guidelines Page Style */}
        <div className="text-center mt-16">
          <Link
            href="/guideline"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white font-medium rounded-lg hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            View all guidelines
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 