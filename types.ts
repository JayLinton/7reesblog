import React from 'react';

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

export interface NavItem {
  label: string;
  targetId: string;
}

export type Category = string;
export type Language = 'zh' | 'en';

export interface Article {
  id: string;
  // Bilingual titles
  titleCN: string;
  titleEN: string;
  date: string;
  category: Category;
  // Bilingual Markdown content
  contentCN: string; 
  contentEN: string; 
  hidden?: boolean;
  pinned?: boolean;
}

export interface Project {
  id: string;
  title: string;
  descriptionCN: string;
  descriptionEN: string;
  url: string;
  year: string;
}

export interface FriendLink {
  id: string;
  name: string;
  title: string; // Changed/Added title field
  avatar: string; // URL to avatar image
  url: string;
  description?: string; // Kept for backward compatibility if needed, but title is preferred
}

export interface UsefulLink {
  id: string;
  name: string;
  url: string;
  description?: string;
}