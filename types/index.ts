// ==========================================
// MORA Tube — Type Definitions
// ==========================================

export interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  videoUrl: string;
  creator: Creator;
  views: number;
  likes: number;
  duration: string;
  uploadDate: string;
  tags: string[];
  comments: Comment[];
  isShort: boolean;
  visibility?: string;
}

export interface Short {
  id: string;
  title: string;
  category: string;
  creator: Creator;
  views: number;
  likes: number;
  comments: number;
  duration: string;
  gradient: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

export interface Creator {
  name: string;
  username: string;
  avatar: string;
  title: string;
  subscribers: string;
  bio: string;
  bannerGradient: string;
}

export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  title: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  name: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

export interface AITool {
  id: string;
  name: string;
  category: string;
  description: string;
  useCases: string[];
  pricing: "Free" | "Freemium" | "Paid";
  iconColor: string;
  iconBg: string;
  url: string;
}

export interface FinanceLesson {
  id: string;
  title: string;
  description: string;
  level: string;
  section: string;
  icon: string;
  duration: string;
  topics: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
}

export interface Channel {
  id: string;
  username: string;
  name: string;
  bio: string;
  bannerGradient: string;
  avatarLetter: string;
  subscribersCount: number;
  videosCount: number;
  totalViews: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  relatedVideos?: Video[];
  timestamp: Date;
}

export interface StatsData {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  coverGradient: string;
  coverUrl?: string;
  purchaseUrl?: string | null;
  rating: number;
  pages: number;
}
