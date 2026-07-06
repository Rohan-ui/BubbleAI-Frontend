export type ModuleId = 
  | 'script-making' 
  | 'storyboard' 
  | 'comics' 
  | 'ads-creation' 
  | 'project-hub';

export interface Module {
  id: ModuleId;
  title: string;
  description: string;
  icon: string;
  category: 'Writing' | 'Visuals' | 'Video' | 'Management';
}

export interface Scene {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: string;
  tone: string;
  location: string;
  timeOfDay: string;
  shots: Shot[];
}

export interface Shot {
  id: string;
  image?: string;
  prompt: string;
  cameraAngle: 'Wide' | 'Mid' | 'Close' | 'POV' | 'Drone';
  lensType: '24mm' | '50mm' | '85mm' | 'Anamorphic';
  movement: 'Pan' | 'Dolly' | 'Zoom' | 'Static' | 'Handheld';
  lighting: string;
  emotion: string;
}


export type DirectorMode = 'Scorsese' | 'Tarantino' | 'Rajamouli' | 'Default';


export interface DirectorStrategy {
  audienceImpact: number;
  commercialViability: number;
  festivalPotential: number;
  viralMoment: string;
  culturalDepth: number;
}

export interface ScriptVersion {
  id: string;
  timestamp: number;
  content: string;
  label: string;
}

export type MangaGenre = 'Shonen' | 'Seinen' | 'Shojo' | 'Horror' | 'Sci-Fi' | 'Superhero' | 'Fantasy' | 'Slice of Life';


export interface ComicPanel {
  id: string;
  type: 'Splash' | 'Medium' | 'Micro';
  content: string;
  image?: string;
  sfx?: string;
  position: { x: number; y: number };
}


export const MODULES: Module[] = [
  {
    id: 'script-making',
    title: 'Script',
    description: 'Professional scriptwriting tools with industry-standard formatting.',
    icon: 'FileText',
    category: 'Writing'
  },
  {
    id: 'storyboard',
    title: 'Storyboard',
    description: 'Visualize your narrative with interactive storyboarding tools.',
    icon: 'Layout',
    category: 'Visuals'
  },
  {
    id: 'comics',
    title: 'Comic & Manga',
    description: 'Tools for Manga, Webtoons, Graphic Novels, and Light Novels.',
    icon: 'BookOpen',
    category: 'Visuals'
  },
  {
    id: 'ads-creation',
    title: 'Ads Creation',
    description: 'Create high-impact advertisements and promotional content.',
    icon: 'Megaphone',
    category: 'Video'
  },
  {
    id: 'project-hub',
    title: 'Project Hub',
    description: 'Centralized management for all your creative assets.',
    icon: 'Grid',
    category: 'Management'
  }
];
