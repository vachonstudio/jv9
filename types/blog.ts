export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'quote' | 'heading' | 'divider' | 'code' | 'video' | 'gallery';
  content: {
    // For text blocks
    text?: string;
    // For heading blocks
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    // For image blocks
    src?: string;
    alt?: string;
    caption?: string;
    // For quote blocks
    quote?: string;
    author?: string;
    // For code blocks
    code?: string;
    language?: string;
    // For video blocks
    videoUrl?: string;
    thumbnail?: string;
    // For gallery blocks
    images?: Array<{
      src: string;
      alt: string;
      caption?: string;
    }>;
  };
  style?: {
    // Common styling options
    alignment?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    textColor?: string;
    // For text blocks
    fontSize?: 'small' | 'medium' | 'large';
    fontWeight?: 'normal' | 'medium' | 'bold';
    // For image blocks
    width?: 'small' | 'medium' | 'large' | 'full';
    aspectRatio?: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Keep for backward compatibility
  contentBlocks?: ContentBlock[]; // New block-based content structure
  author: string;
  authorRole: string;
  authorAvatar: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  coverImage: string;
  visibility: 'public' | 'private'; // Changed from isSubscriberOnly to match Project structure
  isFeatured?: boolean;
  likes?: number;
  views?: number;
  // Enhanced fields for admin management
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export const blogCategories = [
  "All",
  "UX Design",
  "Design Systems",
  "User Research",
  "Product Strategy",
  "Industry Insights",
  "Tools & Resources"
];

export const blogTags = [
  "Color Theory",
  "Psychology",
  "User Behavior",
  "Accessibility",
  "Design Systems",
  "Component Library",
  "Documentation",
  "Scalability",
  "Remote Work",
  "User Research",
  "Collaboration",
  "Tools",
  "ROI",
  "Metrics",
  "Business Value",
  "Stakeholder Management",
  "Trends",
  "AI",
  "Sustainability",
  "Figma",
  "Design Tools",
  "Workflow",
  "Productivity"
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Psychology of Color in UX Design: How Hues Influence User behavior",
    excerpt: "Discover how different colors impact user emotions, decision-making, and overall experience in digital products.",
    content: `
# The Psychology of Color in UX Design

Color is one of the most powerful tools in a designer's arsenal. It can evoke emotions, guide attention, and significantly impact user behavior. Understanding color psychology is crucial for creating effective user experiences.

## The Emotional Impact of Colors

Colors trigger immediate emotional responses. Red can create urgency and excitement, while blue instills trust and calmness. Green is associated with growth and harmony, making it perfect for financial and health applications.

## Practical Applications

When designing interfaces, consider your target audience and the emotions you want to evoke. For e-commerce, warm colors like orange can encourage purchases, while cool colors work better for productivity apps.

## Cultural Considerations

Remember that color meanings vary across cultures. What signifies prosperity in one culture might represent danger in another. Always research your target market's cultural associations with colors.

## Accessibility First

Color should never be the only way to convey information. Ensure your designs work for users with color vision deficiencies by using sufficient contrast ratios and alternative indicators.
    `,
    contentBlocks: [
      {
        id: "block-1",
        type: "heading",
        content: {
          text: "The Psychology of Color in UX Design",
          level: 1
        }
      },
      {
        id: "block-2",
        type: "text",
        content: {
          text: "Color is one of the most powerful tools in a designer's arsenal. It can evoke emotions, guide attention, and significantly impact user behavior. Understanding color psychology is crucial for creating effective user experiences."
        },
        style: {
          fontSize: "large"
        }
      },
      {
        id: "block-3",
        type: "image",
        content: {
          src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=400&fit=crop",
          alt: "Color wheel showing different hues and their relationships",
          caption: "Understanding color relationships is fundamental to creating effective design systems"
        },
        style: {
          width: "full",
          alignment: "center"
        }
      },
      {
        id: "block-4",
        type: "heading",
        content: {
          text: "The Emotional Impact of Colors",
          level: 2
        }
      },
      {
        id: "block-5",
        type: "text",
        content: {
          text: "Colors trigger immediate emotional responses. Red can create urgency and excitement, while blue instills trust and calmness. Green is associated with growth and harmony, making it perfect for financial and health applications."
        }
      },
      {
        id: "block-6",
        type: "quote",
        content: {
          quote: "Color does not add a pleasant quality to design — it reinforces it.",
          author: "Pierre Bonnard, Artist"
        }
      },
      {
        id: "block-7",
        type: "heading",
        content: {
          text: "Practical Applications",
          level: 2
        }
      },
      {
        id: "block-8",
        type: "text",
        content: {
          text: "When designing interfaces, consider your target audience and the emotions you want to evoke. For e-commerce, warm colors like orange can encourage purchases, while cool colors work better for productivity apps."
        }
      },
      {
        id: "block-9",
        type: "image",
        content: {
          src: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop",
          alt: "Mobile app interface showing color psychology in action",
          caption: "Example of how color choices influence user behavior in mobile interfaces"
        },
        style: {
          width: "medium",
          alignment: "center"
        }
      },
      {
        id: "block-10",
        type: "heading",
        content: {
          text: "Cultural Considerations",
          level: 2
        }
      },
      {
        id: "block-11",
        type: "text",
        content: {
          text: "Remember that color meanings vary across cultures. What signifies prosperity in one culture might represent danger in another. Always research your target market's cultural associations with colors."
        }
      },
      {
        id: "block-12",
        type: "heading",
        content: {
          text: "Accessibility First",
          level: 2
        }
      },
      {
        id: "block-13",
        type: "text",
        content: {
          text: "Color should never be the only way to convey information. Ensure your designs work for users with color vision deficiencies by using sufficient contrast ratios and alternative indicators."
        }
      }
    ],
    author: "Alex Chen",
    authorRole: "Senior UX Designer",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    publishedAt: "2024-12-20",
    readTime: "6 min read",
    category: "UX Design",
    tags: ["Color Theory", "Psychology", "User Behavior", "Accessibility"],
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
    visibility: "public",
    isFeatured: true,
    likes: 127,
    views: 1542
  },
  {
    id: "2",
    title: "Building Scalable Design Systems: A Complete Guide",
    excerpt: "Learn how to create design systems that grow with your product and team, from atomic components to comprehensive documentation.",
    content: `
# Building Scalable Design Systems

A well-crafted design system is the backbone of consistent, efficient product development. This comprehensive guide covers everything from foundation to implementation.

## Starting with Foundations

Begin with your core design tokens: colors, typography, spacing, and elevation. These form the DNA of your design system and should be carefully considered and documented.

## Component Architecture

Build components following atomic design principles. Start with atoms (buttons, inputs), progress to molecules (form groups), and finally organisms (headers, cards).

## Documentation Strategy

Great documentation is what separates good design systems from great ones. Include usage guidelines, do's and don'ts, and code examples for every component.

## Governance and Adoption

Establish clear governance processes for updating and maintaining your design system. Regular audits and stakeholder feedback ensure continued relevance and adoption.
    `,
    contentBlocks: [
      {
        id: "block-1",
        type: "heading",
        content: {
          text: "Building Scalable Design Systems",
          level: 1
        }
      },
      {
        id: "block-2",
        type: "text",
        content: {
          text: "A well-crafted design system is the backbone of consistent, efficient product development. This comprehensive guide covers everything from foundation to implementation."
        },
        style: {
          fontSize: "large"
        }
      },
      {
        id: "block-3",
        type: "image",
        content: {
          src: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=400&fit=crop",
          alt: "Component library showing atomic design principles",
          caption: "A systematic approach to component architecture ensures scalability"
        },
        style: {
          width: "full",
          alignment: "center"
        }
      },
      {
        id: "block-4",
        type: "heading",
        content: {
          text: "Starting with Foundations",
          level: 2
        }
      },
      {
        id: "block-5",
        type: "text",
        content: {
          text: "Begin with your core design tokens: colors, typography, spacing, and elevation. These form the DNA of your design system and should be carefully considered and documented."
        }
      },
      {
        id: "block-6",
        type: "code",
        content: {
          code: `// Design tokens example
const tokens = {
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    background: '#ffffff'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px'
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      mono: ['Fira Code', 'monospace']
    }
  }
};`,
          language: "javascript"
        }
      },
      {
        id: "block-7",
        type: "heading",
        content: {
          text: "Component Architecture",
          level: 2
        }
      },
      {
        id: "block-8",
        type: "text",
        content: {
          text: "Build components following atomic design principles. Start with atoms (buttons, inputs), progress to molecules (form groups), and finally organisms (headers, cards)."
        }
      },
      {
        id: "block-9",
        type: "quote",
        content: {
          quote: "Design systems are about relationships. How design decisions relate to one another and how those relationships scale.",
          author: "Nathan Curtis, Design System Expert"
        }
      }
    ],
    author: "Alex Chen",
    authorRole: "Senior UX Designer",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    publishedAt: "2024-12-18",
    readTime: "12 min read",
    category: "Design Systems",
    tags: ["Design Systems", "Component Library", "Documentation", "Scalability"],
    coverImage: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=400&fit=crop",
    visibility: "private",
    likes: 89,
    views: 956
  },
  {
    id: "3",
    title: "User Research Methods for Remote Teams",
    excerpt: "Adapt your user research practices for distributed teams and remote participants with these proven techniques and tools.",
    content: `
# User Research Methods for Remote Teams

The shift to remote work has transformed how we conduct user research. Here's how to maintain research quality while working distributed.

## Digital-First Research Tools

Leverage tools like Miro, Figma, and specialized research platforms to facilitate collaborative research sessions. These tools often provide better documentation than in-person sessions.

## Asynchronous Research Methods

Not all research needs to happen in real-time. Diary studies, survey research, and prototype testing can be conducted asynchronously, respecting participants' schedules.

## Building Rapport Remotely

Creating connection with research participants requires intentional effort in remote settings. Start sessions with casual conversation and ensure your setup is professional yet welcoming.

## Data Analysis Collaboration

Use collaborative analysis tools and structured workshops to ensure the entire team can participate in making sense of research findings.
    `,
    author: "Alex Chen",
    authorRole: "Senior UX Designer",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    publishedAt: "2024-12-15",
    readTime: "8 min read",
    category: "User Research",
    tags: ["Remote Work", "User Research", "Collaboration", "Tools"],
    coverImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=400&fit=crop",
    visibility: "public",
    likes: 67,
    views: 834
  },
  {
    id: "4",
    title: "The ROI of UX: Measuring Design Impact",
    excerpt: "Learn how to quantify the business value of UX design and communicate impact to stakeholders through metrics that matter.",
    content: `
# The ROI of UX: Measuring Design Impact

Proving the value of UX design is crucial for securing resources and organizational buy-in. Here's how to measure and communicate design impact effectively.

## Key UX Metrics

Focus on metrics that align with business goals: conversion rates, task completion rates, time on task, and user satisfaction scores. These translate directly to business value.

## Before and After Analysis

Conduct thorough baseline measurements before implementing design changes. This creates a clear narrative of improvement and impact.

## Stakeholder Communication

Present findings in business terms. Instead of "improved usability," say "reduced support tickets by 30%" or "increased conversion by 15%."

## Long-term Tracking

UX impact often compounds over time. Set up systems to track long-term metrics like customer lifetime value and retention rates.
    `,
    author: "Alex Chen",
    authorRole: "Senior UX Designer",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    publishedAt: "2024-12-12",
    readTime: "10 min read",
    category: "Product Strategy",
    tags: ["ROI", "Metrics", "Business Value", "Stakeholder Management"],
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    visibility: "private",
    likes: 145,
    views: 1203
  },
  {
    id: "5",
    title: "2024 UX Design Trends: What's Next",
    excerpt: "Explore the emerging trends shaping the future of user experience design, from AI integration to sustainable design practices.",
    content: `
# 2024 UX Design Trends: What's Next

The UX design landscape continues to evolve rapidly. Here are the key trends shaping the future of digital experiences.

## AI-Powered Personalization

Machine learning is enabling unprecedented levels of personalization. Interfaces that adapt to individual user preferences and behaviors are becoming the norm.

## Sustainable Design Practices

Environmental consciousness is driving design decisions. From dark mode to energy-efficient interactions, designers are considering the environmental impact of their work.

## Voice and Conversational Interfaces

As voice technology improves, conversational interfaces are becoming more sophisticated and widely adopted across various platforms.

## Inclusive Design by Default

Accessibility is shifting from compliance to innovation driver. Inclusive design principles are creating better experiences for everyone.
    `,
    author: "Alex Chen",
    authorRole: "Senior UX Designer",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    publishedAt: "2024-12-10",
    readTime: "7 min read",
    category: "Industry Insights",
    tags: ["Trends", "AI", "Sustainability", "Accessibility"],
    coverImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop",
    visibility: "public",
    likes: 203,
    views: 2156
  },
  {
    id: "6",
    title: "Advanced Figma Techniques for UX Designers",
    excerpt: "Master advanced Figma features including variables, advanced prototyping, and component systems for more efficient design workflows.",
    content: `
# Advanced Figma Techniques for UX Designers

Figma's advanced features can significantly improve your design workflow and collaboration. Here are the techniques every UX designer should master.

## Variables and Tokens

Use Figma's variable system to create scalable design tokens. This enables consistent theming and makes design updates across large projects much more manageable.

## Advanced Prototyping

Go beyond basic linking with smart animate, overlay positioning, and scroll behaviors. These features create more realistic prototypes for user testing.

## Component System Architecture

Build robust component systems using variants, component properties, and nested instances. This creates flexible, maintainable design systems.

## Collaboration Workflows

Leverage Figma's collaboration features like branching, commenting, and dev mode to streamline handoffs and maintain design quality.
    `,
    author: "Alex Chen",
    authorRole: "Senior UX Designer",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    publishedAt: "2024-12-08",
    readTime: "15 min read",
    category: "Tools & Resources",
    tags: ["Figma", "Design Tools", "Workflow", "Productivity"],
    coverImage: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=400&fit=crop",
    visibility: "private",
    likes: 176,
    views: 1432
  }
];

// Content management functions for admin/editor users
export const createNewBlogPost = (): Partial<BlogPost> => {
  return {
    id: `post-${Date.now()}`,
    title: "New Blog Post",
    excerpt: "Add a compelling excerpt here...",
    content: "# New Blog Post\n\nStart writing your blog content here...",
    contentBlocks: [
      {
        id: `block-${Date.now()}-1`,
        type: "heading",
        content: {
          text: "New Blog Post",
          level: 1
        }
      },
      {
        id: `block-${Date.now()}-2`,
        type: "text",
        content: {
          text: "Start writing your blog content here..."
        }
      }
    ],
    author: "Alex Chen",
    authorRole: "Senior UX Designer",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    publishedAt: new Date().toISOString().split('T')[0],
    readTime: "5 min read",
    category: "UX Design",
    tags: [],
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
    visibility: "public",
    isFeatured: false,
    likes: 0,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const duplicateBlogPost = (post: BlogPost): BlogPost => {
  return {
    ...post,
    id: `post-${Date.now()}`,
    title: `${post.title} (Copy)`,
    publishedAt: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const addBlogCategory = (category: string): void => {
  if (!blogCategories.includes(category)) {
    blogCategories.push(category);
    localStorage.setItem('custom-blog-categories', JSON.stringify(blogCategories));
  }
};

export const removeBlogCategory = (category: string): void => {
  const index = blogCategories.indexOf(category);
  if (index > 0) { // Don't allow removing "All"
    blogCategories.splice(index, 1);
    localStorage.setItem('custom-blog-categories', JSON.stringify(blogCategories));
  }
};

export const addBlogTag = (tag: string): void => {
  if (!blogTags.includes(tag)) {
    blogTags.push(tag);
    localStorage.setItem('custom-blog-tags', JSON.stringify(blogTags));
  }
};

export const removeBlogTag = (tag: string): void => {
  const index = blogTags.indexOf(tag);
  if (index > -1) {
    blogTags.splice(index, 1);
    localStorage.setItem('custom-blog-tags', JSON.stringify(blogTags));
  }
};

export const getFeaturedPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.isFeatured);
};

export const getPublicPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.visibility === 'public');
};

export const getPrivatePosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.visibility === 'private');
};

export const getPostsByCategory = (category: string): BlogPost[] => {
  if (category === "All") return blogPosts;
  return blogPosts.filter(post => post.category === category);
};

// Check if a blog post requires authentication
export const requiresBlogAuthentication = (post: BlogPost): boolean => {
  return post.visibility === 'private';
};

// Utility functions for content blocks
export const createContentBlock = (type: ContentBlock['type']): ContentBlock => {
  const id = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  switch (type) {
    case 'text':
      return {
        id,
        type: 'text',
        content: { text: 'Enter your text here...' }
      };
    case 'heading':
      return {
        id,
        type: 'heading',
        content: { text: 'New Heading', level: 2 }
      };
    case 'image':
      return {
        id,
        type: 'image',
        content: { 
          src: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
          alt: 'Placeholder image',
          caption: ''
        },
        style: { width: 'full', alignment: 'center' }
      };
    case 'quote':
      return {
        id,
        type: 'quote',
        content: { quote: 'Insert inspiring quote here...', author: '' }
      };
    case 'code':
      return {
        id,
        type: 'code',
        content: { code: '// Your code here', language: 'javascript' }
      };
    case 'divider':
      return {
        id,
        type: 'divider',
        content: {}
      };
    case 'video':
      return {
        id,
        type: 'video',
        content: { 
          videoUrl: '',
          thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop'
        }
      };
    case 'gallery':
      return {
        id,
        type: 'gallery',
        content: { 
          images: [
            {
              src: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
              alt: 'Gallery image 1'
            }
          ]
        }
      };
    default:
      return {
        id,
        type: 'text',
        content: { text: 'Enter your text here...' }
      };
  }
};