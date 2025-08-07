import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Statistic } from "./data";
import { ArrowRight, Sparkles, Globe, Award, Users, Clock, Mail, ChevronRight } from "lucide-react";

interface HeroSectionProps {
  statistics: Statistic[];
}

export default function HeroSection({ statistics }: HeroSectionProps) {
  return (
    <section className="min-h-screen bg-white overflow-hidden">
      {/* Minimal Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-50 rounded-full blur-3xl opacity-40"></div>

      <div className="mt-20 max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Content */}
          <div className="text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
              <Sparkles className="w-4 h-4" />
              New Opportunities Daily
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Unlock Your
                <span className="block text-blue-600">Global Future</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 max-w-lg leading-relaxed">
                Discover scholarships, internships, and career opportunities from around the world. 
                Your gateway to international success starts here.
              </p>
            </div>

            {/* Email Signup */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Get notified about new opportunities</span>
              </div>
              <div className="flex gap-3 max-w-md">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Opportunities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Main Card */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 lg:p-12 border border-blue-100">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Global Opportunities</h3>
                      <p className="text-sm text-gray-600">Updated daily</p>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>

                {/* Opportunity Cards */}
                <div className="space-y-4">
                  {[
                    { title: "Fully Funded Scholarships", country: "Germany", type: "Masters" },
                    { title: "Research Internships", country: "Japan", type: "PhD" },
                    { title: "Tech Fellowships", country: "USA", type: "Graduate" }
                  ].map((item, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{item.country}</span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{item.type}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Explore All Opportunities
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 