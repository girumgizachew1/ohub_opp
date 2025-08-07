'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ArrowRight, GraduationCap, Briefcase, Globe, Award, Building2, Trophy, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// TypeScript interfaces
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

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Fetch categories from Contentful
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await fetch('/api/categories');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to empty array
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);



  const socialLinks = [
    { href: '#', icon: Facebook, label: 'Facebook' },
    { href: '#', icon: Twitter, label: 'Twitter' },
    { href: '#', icon: Instagram, label: 'Instagram' },
    { href: '#', icon: Linkedin, label: 'LinkedIn' },
    { href: '#', icon: Youtube, label: 'YouTube' },
  ];

  // Icon mapping function
  const getCategoryIcon = (iconName: string) => {
    const icons = {
      GraduationCap,
      Briefcase,
      Globe,
      Award,
      Building2,
      Trophy,
      BookOpen
    };
    return icons[iconName as keyof typeof icons] || BookOpen;
  };

  // Color mapping function for category cards
  const getCategoryColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 border-green-200 hover:bg-green-100',
      purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      red: 'bg-red-50 border-red-200 hover:bg-red-100',
      yellow: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-50 border-gray-200 hover:bg-gray-100';
  };

  // Icon color mapping
  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600'
    };
    return colors[color as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Opportunities */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">
              Opportunities
            </h4>
            {isLoadingCategories ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : (
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/${category.slug}`}
                      className="text-gray-600 hover:text-blue-600 text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Guidelines */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">
              Guidelines
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/guideline"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  All Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/guideline/scholarship-guides"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Scholarship Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/guideline/application-tips"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Application Tips
                </Link>
              </li>
              <li>
                <Link
                  href="/guideline/career-advice"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Career Advice
                </Link>
              </li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">
              Contact
            </h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center group">

                <span className="group-hover:text-gray-900 transition-colors">info@ohub.com</span>
              </div>
              <div className="flex items-center group">
                <span className="group-hover:text-gray-900 transition-colors">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start group">
                <span className="group-hover:text-gray-900 transition-colors">
                  123 Opportunity Street<br />Education City, EC 12345
                </span>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="lg:col-span-1">
            {/* Newsletter Subscription */}
            <div className="mb-6">
              <h4 className="text-base font-semibold text-gray-900 mb-3">
                Stay Updated
              </h4>
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm"
                />
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 text-sm font-medium py-3 transition-all duration-200 transform hover:scale-105 shadow-md">
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-3">Connect With Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110 hover:shadow-md"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-gray-600 hover:text-blue-600 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-sm">
              © {currentYear} <span className="font-semibold">OHUB</span>. All Rights Reserved.
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gray-900 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-gray-900 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;