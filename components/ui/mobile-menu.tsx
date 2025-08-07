'use client';
import React from 'react';
import Link from 'next/link';
import { Search, ChevronDown, ChevronUp, Sparkles, BookOpen, GraduationCap, Briefcase, Globe, Award, Building2, Trophy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// TypeScript interfaces
interface OpportunityItem {
  href: string;
  label: string;
  description: string;
  icon?: string;
  color?: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: Array<{ href: string; label: string }>;
  opportunityItems: OpportunityItem[];
  isMobileDropdownOpen: boolean;
  onMobileDropdownToggle: () => void;
  isLoadingCategories: boolean;
}

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

// Loading Spinner Component
const LoadingSpinner: React.FC = () => (
  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
);

// Mobile Opportunity Item Component
const MobileOpportunityItem: React.FC<{
  item: OpportunityItem;
  onClose: () => void;
}> = ({ item, onClose }) => {
  const IconComponent = getCategoryIcon(item.icon || 'BookOpen');

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className="flex items-start gap-4 p-4 rounded-lg bg-white hover:bg-gray-50 transition-all duration-200 group border border-gray-200"
      role="menuitem"
      tabIndex={0}
    >
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
        <IconComponent className="w-6 h-6 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 mb-1">{item.label}</div>
        <div className="text-sm text-gray-600 line-clamp-2">{item.description}</div>
      </div>
    </Link>
  );
};

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navItems,
  opportunityItems,
  isMobileDropdownOpen,
  onMobileDropdownToggle,
  isLoadingCategories
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="lg:hidden fixed inset-0 bg-white/95 backdrop-blur-xl z-50 flex flex-col items-center justify-start pt-24 p-6 gap-6 animate-in fade-in-0 slide-in-from-top-4 duration-300"
      role="dialog"
      aria-modal="true"
    >
      <ul className="w-full max-w-sm space-y-4">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onClose}
              className="block text-center text-base font-medium text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg focus-visible:ring-2 focus-visible:ring-gray-400 px-4 py-3 hover:bg-gray-50"
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <button
            onClick={onMobileDropdownToggle}
            disabled={isLoadingCategories}
            className="flex justify-center items-center w-full text-base font-medium text-gray-700 hover:text-gray-900 gap-2 rounded-lg focus-visible:ring-2 focus-visible:ring-gray-400 px-4 py-3 hover:bg-gray-50 transition-all duration-200"
            aria-expanded={isMobileDropdownOpen}
            aria-haspopup="menu"
            aria-controls="opportunities-mobile-menu"
            id="opportunities-mobile-btn"
          >
            <Sparkles className="w-4 h-4" />
            Opportunities
            {isLoadingCategories ? (
              <LoadingSpinner />
            ) : isMobileDropdownOpen ? (
              <ChevronUp className="w-4 h-4 transition-transform duration-200" />
            ) : (
              <ChevronDown className="w-4 h-4 transition-transform duration-200" />
            )}
          </button>
          {isMobileDropdownOpen && (
            <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="space-y-3">
                {opportunityItems.map((item) => (
                  <MobileOpportunityItem key={item.href} item={item} onClose={onClose} />
                ))}
              </div>
            </div>
          )}
        </li>
      </ul>

      <div className="w-full max-w-sm mt-8">
        <div className="relative group">
          <Input
            type="text"
            placeholder="Search opportunities..."
            className="pl-12 pr-4 py-3 text-sm border-gray-200 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
            aria-label="Search opportunities"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none group-focus-within:text-gray-600 transition-colors duration-200" />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
export type { MobileMenuProps, OpportunityItem }; 