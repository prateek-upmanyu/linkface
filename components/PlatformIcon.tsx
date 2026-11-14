"use client";

import React, { useState } from "react";
import {
  Globe,
  Mail,
  Phone,
  MessageCircle,
  PhoneCall,
  Send,
  Headphones,
  Tv,
  Hash,
  Music,
  Disc,
  GitBranch,
  Layers,
  Palette,
  BookOpen,
  Bookmark,
  FileText,
  Feather,
  Flame,
  Smartphone,
  PlaySquare,
  Monitor,
  HeartHandshake,
  Coffee,
  ShoppingBag,
  CreditCard,
  Sparkles,
  Briefcase,
  Tag,
  ShoppingCart,
  Store,
  HardDrive,
  Box,
  Link2,
  Calendar,
  Mic,
  Gamepad2,
  Video,
  AtSign,
  LucideIcon,
} from "lucide-react";

interface PlatformIconProps {
  iconName?: string | null;
  platformId?: string | null;
  faviconUrl?: string | null;
  brandColor?: string | null;
  className?: string;
  size?: number;
}

// Dedicated brand SVGs for rock-solid zero-dependency brand logos
const BRAND_SVGS: Record<string, (size: number) => React.ReactNode> = {
  youtube: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  instagram: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  twitter: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  facebook: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  github: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  ),
  linkedin: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8z" />
    </svg>
  ),
  spotify: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  ),
  threads: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm0-2c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-15v6h2v-6h-2z" />
    </svg>
  ),
  dribbble: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm9.897 10.944c-.752-.089-2.316-.217-4.462.247-.333-.765-.688-1.535-1.066-2.296 2.404-1.282 3.865-2.825 4.093-3.076 1.002 1.488 1.583 3.279 1.435 5.125zm-2.825-6.304c-.212.233-1.585 1.688-3.87 2.898-1.26-2.28-2.695-4.135-2.851-4.336 1.794-.582 3.731-.486 5.485.438l1.236 1zm-7.616-2.617c.159.205 1.594 2.059 2.857 4.331-2.428.796-5.467 1.258-8.735 1.343.908-2.666 3.125-4.757 5.878-5.674zm-6.953 7.828c.071 0 .142-.001.213-.001 3.585 0 6.945-.499 9.61-1.373.349.704.675 1.417.981 2.126-3.896 1.25-7.464 4.053-8.818 5.215-1.246-1.639-1.986-3.704-1.986-5.967zm2.464 7.643c1.234-1.074 4.542-3.693 8.243-4.887.892 2.299 1.442 4.671 1.635 5.617-1.467.925-3.208 1.47-5.074 1.47-1.785 0-3.46-.503-4.804-1.38v-.82zm11.236 1.062c-.173-.85-.685-3.04-1.517-5.187 1.95-.445 3.398-.314 3.486-.305-.181 2.193-1.01 4.2-2.348 5.766l.379-.274z" />
    </svg>
  ),
  figma: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 0a4 4 0 0 0-4 4 4 4 0 0 0 4 4h4V0H8zm0 8a4 4 0 0 0-4 4 4 4 0 0 0 4 4h4V8H8zm0 8a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4v-4H8zm8-16h-4v8h4a4 4 0 0 0 0-8zm0 8h-4v8h4a4 4 0 0 0 0-8z" />
    </svg>
  ),
};

const LUCIDE_MAP: Record<string, LucideIcon> = {
  Mail,
  Phone,
  MessageCircle,
  PhoneCall,
  Send,
  Headphones,
  Tv,
  Hash,
  Music,
  Disc,
  GitBranch,
  Layers,
  Palette,
  BookOpen,
  Bookmark,
  FileText,
  Feather,
  Flame,
  Smartphone,
  PlaySquare,
  Monitor,
  HeartHandshake,
  Coffee,
  ShoppingBag,
  CreditCard,
  Sparkles,
  Briefcase,
  Tag,
  ShoppingCart,
  Store,
  HardDrive,
  Box,
  Link2,
  Calendar,
  Mic,
  Gamepad2,
  Video,
  AtSign,
  Globe,
};

export function PlatformIcon({
  iconName,
  platformId,
  faviconUrl,
  className = "w-5 h-5",
  size = 20,
}: PlatformIconProps) {
  const [imgError, setImgError] = useState(false);

  // 1. Check if platformId has a dedicated SVG
  if (platformId && BRAND_SVGS[platformId.toLowerCase()]) {
    return <span className={`inline-flex shrink-0 ${className}`}>{BRAND_SVGS[platformId.toLowerCase()](size)}</span>;
  }

  // 2. Check Lucide mapping
  if (iconName && LUCIDE_MAP[iconName]) {
    const Component = LUCIDE_MAP[iconName];
    return <Component className={className} size={size} />;
  }

  // 3. Fallback to Google Favicon if available
  if (faviconUrl && !imgError) {
    return (
      <img
        src={faviconUrl}
        alt={platformId || "icon"}
        width={size}
        height={size}
        onError={() => setImgError(true)}
        className={`rounded-sm object-contain shrink-0 ${className}`}
        loading="lazy"
      />
    );
  }

  // 4. Default Globe fallback
  return <Globe className={className} size={size} />;
}
