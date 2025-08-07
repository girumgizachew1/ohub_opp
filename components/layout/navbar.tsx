'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import OpportunitiesDropdown, { type OpportunityItem } from '@/components/ui/opportunities-dropdown';
import MobileMenu from '@/components/ui/mobile-menu';

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

// Nav items (static, but ready for CMS integration)
const navItems = [
  { href: '/guideline', label: 'Guidelines' },
];

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOpportunitiesDropdownOpen, setIsOpportunitiesDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

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

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Transform categories to opportunity items
  const opportunityItems: OpportunityItem[] = categories.map(category => ({
    href: `/${category.slug}`,
    label: category.name,
    description: category.description,
    icon: category.icon,
    color: category.color
  }));

  // Close menus on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
        setIsMobileDropdownOpen(false);
        setIsOpportunitiesDropdownOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard navigation for mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isMobileMenuOpen]);

  return (
    <nav className={`w-full fixed top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-md border-b border-gray-200' 
        : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Notion Style */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              OHUB
            </span>
          </Link>

          {/* Center Navigation - Notion Style */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/guideline"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Guidelines
            </Link>
            
            <OpportunitiesDropdown
              open={isOpportunitiesDropdownOpen}
              onToggle={() => setIsOpportunitiesDropdownOpen((v) => !v)}
              onClose={() => setIsOpportunitiesDropdownOpen(false)}
              items={opportunityItems}
              buttonId="opportunities-desktop-btn"
              menuId="opportunities-desktop-menu"
              isLoading={isLoadingCategories}
            />
          </div>

          {/* Right Side - Notion Style */}
          <div className="flex items-center gap-4">
            {/* Desktop - Apply Button */}
            <div className="hidden lg:block">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium">
                Apply with OHUB
              </Button>
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => { }}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg w-9 h-9"
                aria-label="Open search"
              >
                <Search className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg w-9 h-9"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        opportunityItems={opportunityItems}
        isMobileDropdownOpen={isMobileDropdownOpen}
        onMobileDropdownToggle={() => setIsMobileDropdownOpen((v) => !v)}
        isLoadingCategories={isLoadingCategories}
      />
    </nav>
  );
};

export default Navbar;