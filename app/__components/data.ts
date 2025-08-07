// Interfaces for home page data
export interface Statistic {
  value: string;
  label: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  count: number;
}

export interface Guideline {
  id: string;
  title: string;
  slug: string;
  description: string;
  featuredImage: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  createdAt: string;
}



// Mock data for home page
export const statistics: Statistic[] = [
  { value: "500+", label: "Opportunities" },
  { value: "50+", label: "Countries" },
  { value: "10K+", label: "Students" },
  { value: "24/7", label: "Support" },
];

export const categories: Category[] = [
  {
    id: "1",
    name: "Scholarships",
    slug: "scholarships",
    description: "Fully funded academic opportunities worldwide",
    icon: "GraduationCap",
    color: "blue",
    count: 150,
  },
  {
    id: "2",
    name: "Jobs",
    slug: "jobs",
    description: "Professional career opportunities",
    icon: "Briefcase",
    color: "green",
    count: 200,
  },
  {
    id: "3",
    name: "Internships",
    slug: "internships",
    description: "Hands-on experience and learning",
    icon: "Building2",
    color: "purple",
    count: 100,
  },
  {
    id: "4",
    name: "Conferences",
    slug: "conferences",
    description: "Networking and knowledge sharing",
    icon: "Globe",
    color: "orange",
    count: 75,
  },
  {
    id: "5",
    name: "Competitions",
    slug: "competitions",
    description: "Showcase your skills and win prizes",
    icon: "Trophy",
    color: "red",
    count: 50,
  },
  {
    id: "6",
    name: "Exchange Programs",
    slug: "exchange-programs",
    description: "Cultural and academic exchange",
    icon: "Plane",
    color: "indigo",
    count: 25,
  },
];



 