export interface SignupFormData {
  // Step 1: Personal Information
  firstName: string;
  lastName: string;
  email: string;
  
  // Step 2: Interests
  interests: string[];
  primaryGoal: string;
  
  // Step 3: Professional Information
  role: string;
  company: string;
  experience: string;
  teamSize: string;
  
  // Step 4: Goals & Preferences
  challenges: string[];
  newsletter: boolean;
  updates: boolean;
  communityAccess: boolean;
  
  // Step 5: Additional preferences
  communicationPreference: string;
  timezone: string;
}

export const interestOptions = [
  { id: 'ux-design', label: 'UX Design', description: 'User experience design principles and methods' },
  { id: 'ui-design', label: 'UI Design', description: 'User interface design and visual design systems' },
  { id: 'design-systems', label: 'Design Systems', description: 'Component libraries and design standards' },
  { id: 'user-research', label: 'User Research', description: 'Research methodologies and user insights' },
  { id: 'prototyping', label: 'Prototyping', description: 'Interactive prototypes and design tools' },
  { id: 'accessibility', label: 'Accessibility', description: 'Inclusive design and WCAG compliance' },
  { id: 'product-strategy', label: 'Product Strategy', description: 'Product planning and strategic design' },
  { id: 'design-leadership', label: 'Design Leadership', description: 'Managing teams and design operations' }
];

export const primaryGoalOptions = [
  { value: 'learn', label: 'Learn New Skills', description: 'Expand knowledge and capabilities' },
  { value: 'improve', label: 'Improve Current Work', description: 'Enhance existing projects and processes' },
  { value: 'network', label: 'Network & Connect', description: 'Meet other professionals and build relationships' },
  { value: 'hire', label: 'Find Design Talent', description: 'Recruit designers or consultants' },
  { value: 'inspiration', label: 'Get Inspired', description: 'Discover new ideas and trends' },
  { value: 'collaboration', label: 'Collaborate on Projects', description: 'Work together on design initiatives' }
];

export const roleOptions = [
  { value: 'ux-designer', label: 'UX Designer' },
  { value: 'ui-designer', label: 'UI Designer' },
  { value: 'product-designer', label: 'Product Designer' },
  { value: 'design-manager', label: 'Design Manager' },
  { value: 'product-manager', label: 'Product Manager' },
  { value: 'developer', label: 'Developer' },
  { value: 'founder', label: 'Founder/CEO' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'student', label: 'Student' },
  { value: 'other', label: 'Other' }
];

export const experienceOptions = [
  { value: 'beginner', label: 'Just Starting (0-1 years)' },
  { value: 'junior', label: 'Junior (1-3 years)' },
  { value: 'mid', label: 'Mid-level (3-5 years)' },
  { value: 'senior', label: 'Senior (5-8 years)' },
  { value: 'lead', label: 'Lead/Principal (8+ years)' },
  { value: 'executive', label: 'Executive/Director' }
];

export const teamSizeOptions = [
  { value: 'solo', label: 'Just me' },
  { value: 'small', label: '2-5 people' },
  { value: 'medium', label: '6-15 people' },
  { value: 'large', label: '16-50 people' },
  { value: 'enterprise', label: '50+ people' }
];

export const challengeOptions = [
  { id: 'user-research', label: 'Conducting User Research', description: 'Learning research methods and gathering insights' },
  { id: 'design-process', label: 'Improving Design Process', description: 'Streamlining workflows and methodologies' },
  { id: 'stakeholder-buy-in', label: 'Getting Stakeholder Buy-in', description: 'Communicating design value to leadership' },
  { id: 'team-collaboration', label: 'Team Collaboration', description: 'Working effectively with cross-functional teams' },
  { id: 'technical-constraints', label: 'Technical Constraints', description: 'Balancing design with development limitations' },
  { id: 'measuring-impact', label: 'Measuring Design Impact', description: 'Proving ROI and tracking success metrics' },
  { id: 'scaling-design', label: 'Scaling Design Systems', description: 'Building consistent experiences across products' },
  { id: 'career-growth', label: 'Career Development', description: 'Advancing skills and progressing professionally' }
];

export const communicationOptions = [
  { value: 'email', label: 'Email Updates', description: 'Weekly newsletter and important announcements' },
  { value: 'minimal', label: 'Minimal Contact', description: 'Only essential updates and major releases' },
  { value: 'frequent', label: 'Regular Updates', description: 'Tips, resources, and community highlights' }
];