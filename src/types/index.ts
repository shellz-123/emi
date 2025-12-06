export interface User {
  id: string;
  name: string;
  email: string;
  skills: Skill[];
  completedCourses: string[];
  currentLevel: string;
  targetRole: string;
  assessmentScore?: number;
  careerGoals?: string[];
  preferredLearningStyle?: 'visual' | 'reading' | 'interactive' | 'video';
  experience?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  lastUpdated?: string;
  progress?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  rating: number;
  enrolled: number;
  skills: string[];
  modules: Module[];
  progress?: number;
  instructor?: string;
  completionCertificate?: boolean;
}

export interface Module {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: number;
  type: 'video' | 'reading' | 'quiz' | 'project';
  completed: boolean;
  content?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  matchScore: number;
  requiredSkills: string[];
  description: string;
  postedDate: string;
  benefits?: string[];
  applicationDeadline?: string;
  remote?: boolean;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  skill: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

export interface AIRecommendation {
  id: string;
  type: 'course' | 'skill' | 'job' | 'career';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  actionItems: string[]; 
}