'use client';
import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ChevronRight, Sparkles, BookOpen, GraduationCap, Briefcase, Globe, Award, Building2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

interface OpportunityItem {
  href: string;
  label: string;
  description: string;
  icon?: string;
  color?: string;
}

interface OpportunitiesDropdownProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  items: OpportunityItem[];
  buttonId: string;
  menuId: string;
  isLoading?: boolean;
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
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  };

  return (
    <div className={cn(
      "border-gray-300 border-t-gray-600 rounded-full animate-spin",
      sizeClasses[size]
    )} />
  );
};

// Opportunity Item Component - Notion Style
const OpportunityItem: React.FC<{
  item: OpportunityItem;
  onClose: () => void;
}> = ({ item, onClose }) => {
  const IconComponent = getCategoryIcon(item.icon || 'BookOpen');

  return (
    <Link
      href={`/opportunity${item.href}`}
      className="group block p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      role="menuitem"
      tabIndex={0}
      onClick={onClose}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
            <IconComponent className="w-5 h-5 text-gray-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm mb-1">
            {item.label}
          </h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            {item.description}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200 flex-shrink-0" />
      </div>
    </Link>
  );
};

// Loading State Component - Notion Style
const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="text-gray-500 text-sm mt-3">Loading opportunities...</p>
    </div>
  </div>
);

// Empty State Component - Notion Style
const EmptyState: React.FC = () => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <BookOpen className="w-8 h-8 text-gray-400" />
    </div>
    <p className="text-gray-500 text-sm">No categories available</p>
  </div>
);

// Main Dropdown Component - Notion Style
const OpportunitiesDropdown: React.FC<OpportunitiesDropdownProps> = ({ 
  open, 
  onToggle, 
  onClose, 
  items, 
  buttonId, 
  menuId,
  isLoading = false 
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={onToggle}
        disabled={isLoading}
        className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 flex items-center gap-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        id={buttonId}
      >
        Opportunities
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : open ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>
      
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-labelledby={buttonId}
          className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-[600px] overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Explore Opportunities</h3>
            <p className="text-xs text-gray-500 mt-1">Find scholarships, internships, and career opportunities</p>
          </div>

          {/* Content */}
          <div className="p-4">
            {isLoading ? (
              <LoadingState />
            ) : items.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 gap-1">
                {items.map((item) => (
                  <OpportunityItem key={item.href} item={item} onClose={onClose} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
            <Link
              href="/opportunity"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              onClick={onClose}
            >
              View all opportunities
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunitiesDropdown;
export type { Category, OpportunityItem, OpportunitiesDropdownProps }; 