export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  team: string;
  role: string;
  image: string;
  visibility: 'public' | 'private';
  featured: boolean;
  technologies: string[];
  impact: {
    metric: string;
    value: string;
  }[];
  sections: {
    title: string;
    content: string;
    image?: string;
    metrics?: {
      value: string;
      label: string;
    }[];
  }[];
  // Enhanced fields for admin management
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export const projectCategories = [
  "All",
  "E-commerce",
  "Enterprise SaaS",
  "FinTech",
  "Healthcare",
  "Mobile App",
  "Web Platform",
  "Design System",
  "Research"
];

export const projects: Project[] = [
  // PUBLIC CASE STUDIES - Visible to all visitors
  {
    id: "public-1",
    title: "Smart Home Dashboard",
    description: "Redesigning IoT device management for seamless smart home control with intuitive automation and energy insights.",
    category: "Mobile App",
    duration: "4 months",
    team: "5 people",
    role: "Lead UX Designer",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop",
    visibility: "public",
    featured: true,
    technologies: ["React Native", "IoT Integration", "Node.js", "MongoDB"],
    impact: [
      {
        metric: "Setup Time Reduction",
        value: "75%"
      },
      {
        metric: "User Satisfaction",
        value: "4.9/5"
      },
      {
        metric: "Energy Savings",
        value: "$180/year"
      },
      {
        metric: "Device Adoption",
        value: "3x increase"
      }
    ],
    sections: [
      {
        title: "The Challenge",
        content: "Smart home device management was fragmented across multiple apps, creating user confusion and low adoption rates. Users struggled with device setup, automation creation, and understanding their energy consumption patterns.\n\nOur research showed 67% of users abandoned smart home setup after the first device due to complexity.",
        image: "https://images.unsplash.com/photo-1558618666-d2c458c9f530?w=800&h=500&fit=crop"
      },
      {
        title: "Research & Discovery",
        content: "Conducted 20+ in-home interviews observing user interactions with existing smart home systems. Key insights:\n\n• 78% wanted unified device control\n• Setup complexity was the #1 barrier\n• Energy insights drove purchasing decisions\n• Voice control expectations were high",
        metrics: [
          {
            value: "20+",
            label: "User Interviews"
          },
          {
            value: "78%",
            label: "Want Unified Control"
          },
          {
            value: "67%",
            label: "Setup Abandonment"
          }
        ]
      },
      {
        title: "Design Solution",
        content: "Created an intuitive hub that auto-discovers devices, provides guided setup flows, and offers intelligent automation suggestions based on usage patterns.\n\nThe dashboard prioritizes energy insights and quick controls while maintaining advanced features for power users.",
        image: "https://images.unsplash.com/photo-1558618666-5c350d0d3c56?w=800&h=500&fit=crop"
      },
      {
        title: "Implementation & Testing",
        content: "Iterative testing with 15 households over 8 weeks. Refined micro-interactions, simplified onboarding flow, and optimized energy visualization based on user feedback.\n\nFinal usability testing achieved 94% task completion rate with 4.9/5 satisfaction scores."
      }
    ]
  },
  {
    id: "public-2",
    title: "Sustainable Fashion Marketplace",
    description: "Creating a transparent, community-driven platform that connects conscious consumers with sustainable fashion brands worldwide.",
    category: "E-commerce",
    duration: "6 months",
    team: "8 people",
    role: "Senior UX Designer & Sustainability Lead",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
    visibility: "public",
    featured: true,
    technologies: ["React", "Blockchain", "AI Recommendations", "GraphQL"],
    impact: [
      {
        metric: "Brand Partners",
        value: "200+"
      },
      {
        metric: "Sustainability Score",
        value: "98% accuracy"
      },
      {
        metric: "Customer Retention",
        value: "68%"
      },
      {
        metric: "Carbon Footprint Reduction",
        value: "40% per purchase"
      }
    ],
    sections: [
      {
        title: "Market Opportunity",
        content: "The sustainable fashion market was growing rapidly but lacked transparency and trust. Consumers wanted to make ethical choices but struggled to verify sustainability claims and find quality alternatives to fast fashion.\n\nMarket research revealed 73% of millennials would pay more for sustainable products, but only 23% trusted brand sustainability claims.",
        metrics: [
          {
            value: "73%",
            label: "Willing to Pay More"
          },
          {
            value: "23%",
            label: "Trust Brand Claims"
          },
          {
            value: "$15B",
            label: "Market Opportunity"
          }
        ]
      },
      {
        title: "User Research",
        content: "Interviewed 45 conscious consumers and 25 sustainable fashion brands to understand pain points in the current ecosystem.\n\nKey findings: transparency was paramount, community recommendations mattered more than advertising, and size/fit uncertainty was a major barrier to online sustainable shopping.",
        image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=500&fit=crop"
      },
      {
        title: "Platform Design",
        content: "Designed a marketplace featuring verified sustainability scores, community reviews, virtual try-on technology, and brand transparency dashboards.\n\nImplemented blockchain verification for supply chain transparency and AI-powered recommendations based on personal values and style preferences.",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop"
      },
      {
        title: "Community Features",
        content: "Built social features including style inspiration boards, sustainability challenges, and local swap events to foster community engagement and brand loyalty.\n\nLaunched with ambassador program featuring 50 sustainability influencers, achieving 15K user signups in first month."
      }
    ]
  },
  {
    id: "public-3",
    title: "AR Learning Platform for Kids",
    description: "Transforming early childhood education through immersive augmented reality experiences that make learning science and math engaging and interactive.",
    category: "Mobile App",
    duration: "8 months",
    team: "12 people",
    role: "Principal UX Designer & Child Development Specialist",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=800&fit=crop",
    visibility: "public",
    featured: true,
    technologies: ["Unity", "ARKit", "Machine Learning", "Firebase"],
    impact: [
      {
        metric: "Learning Retention",
        value: "89% improvement"
      },
      {
        metric: "Engagement Time",
        value: "3x longer"
      },
      {
        metric: "Parent Satisfaction",
        value: "4.8/5"
      },
      {
        metric: "Schools Adopted",
        value: "500+"
      }
    ],
    sections: [
      {
        title: "Educational Challenge",
        content: "Traditional STEM education methods showed declining engagement among 6-12 year olds, with 58% of students reporting science and math as 'boring' subjects.\n\nParents and teachers sought interactive tools that could make abstract concepts tangible and maintain children's natural curiosity about how things work.",
        metrics: [
          {
            value: "58%",
            label: "Find STEM Boring"
          },
          {
            value: "67%",
            label: "Prefer Visual Learning"
          },
          {
            value: "42%",
            label: "Lose Interest by Age 10"
          }
        ]
      },
      {
        title: "Child-Centered Research",
        content: "Conducted playtest sessions with 120 children across different learning styles and abilities. Observed natural interaction patterns with AR technology and identified optimal session lengths, gesture preferences, and reward mechanisms.\n\nPartnered with child development experts to ensure age-appropriate cognitive load and learning progression.",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=500&fit=crop"
      },
      {
        title: "AR Experience Design",
        content: "Created immersive modules where children can explore the solar system, build virtual molecules, and conduct physics experiments in their living room.\n\nDesigned intuitive gesture controls, progressive difficulty levels, and collaborative features for group learning sessions.",
        image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&h=500&fit=crop"
      },
      {
        title: "Learning Outcomes",
        content: "8-month study with 15 schools showed significant improvements in STEM engagement and retention. Children using AR modules demonstrated 89% better concept retention compared to traditional methods.\n\nParents reported increased curiosity and voluntary exploration of science topics at home."
      }
    ]
  },

  // PRIVATE CASE STUDIES - Require authentication
  {
    id: "private-1",
    title: "Enterprise Financial Dashboard",
    description: "Redesigning complex financial analytics for Fortune 500 CFOs with real-time insights, predictive modeling, and collaborative planning tools.",
    category: "Enterprise SaaS",
    duration: "12 months",
    team: "15 people",
    role: "Principal UX Designer & Strategy Lead",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
    visibility: "private",
    featured: true,
    technologies: ["React", "D3.js", "Python", "Kubernetes", "Tableau"],
    impact: [
      {
        metric: "Decision Speed",
        value: "5x faster"
      },
      {
        metric: "Forecast Accuracy",
        value: "94%"
      },
      {
        metric: "User Adoption",
        value: "98%"
      },
      {
        metric: "ROI",
        value: "$2.4M saved annually"
      }
    ],
    sections: [
      {
        title: "Enterprise Context",
        content: "CFOs at Fortune 500 companies were drowning in disparate financial systems, requiring 40+ hours weekly to compile executive reports. Existing tools lacked real-time capabilities and predictive insights needed for strategic decision-making.\n\nThe client sought a unified platform that could integrate with 12 different financial systems while providing actionable intelligence for C-suite executives.",
        metrics: [
          {
            value: "40+",
            label: "Hours per Week on Reports"
          },
          {
            value: "12",
            label: "Disconnected Systems"
          },
          {
            value: "72h",
            label: "Average Report Delay"
          }
        ]
      },
      {
        title: "Executive Research",
        content: "Conducted confidential interviews with 25 Fortune 500 CFOs and finance leaders to understand strategic needs, pain points, and decision-making processes.\n\nKey insights: real-time visibility was critical, predictive analytics drove competitive advantage, and collaborative planning across departments was essential for accuracy.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop"
      },
      {
        title: "Dashboard Architecture",
        content: "Designed modular dashboard system with role-based permissions, customizable KPI tracking, and intelligent alerting for anomalies.\n\nImplemented predictive modeling visualizations that translate complex algorithms into executive-friendly insights and actionable recommendations.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop"
      },
      {
        title: "Security & Compliance",
        content: "Ensured SOX compliance, implemented granular access controls, and designed audit trails for all financial data interactions.\n\nBuilt change management workflows that maintain data integrity while enabling collaborative planning across finance, operations, and strategy teams."
      }
    ]
  },
  {
    id: "private-2",
    title: "Healthcare AI Diagnostic Tool",
    description: "Developing AI-powered diagnostic assistance for radiologists with advanced image analysis, collaborative review workflows, and patient outcome tracking.",
    category: "Healthcare",
    duration: "18 months",
    team: "20+ people",
    role: "Senior UX Researcher & Clinical Workflow Designer",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=800&fit=crop",
    visibility: "private",
    featured: false,
    technologies: ["TensorFlow", "FHIR", "React", "DICOM", "HL7"],
    impact: [
      {
        metric: "Diagnostic Accuracy",
        value: "97.3%"
      },
      {
        metric: "Reading Time Reduction",
        value: "40%"
      },
      {
        metric: "False Positive Rate",
        value: "2.1% decrease"
      },
      {
        metric: "Radiologist Satisfaction",
        value: "4.9/5"
      }
    ],
    sections: [
      {
        title: "Clinical Research",
        content: "Embedded with radiology departments at 3 major hospital systems for 6 months, observing workflow patterns, collaboration needs, and diagnostic decision-making processes.\n\nIdentified critical points where AI assistance could enhance accuracy without disrupting established clinical workflows or physician autonomy.",
        metrics: [
          {
            value: "240h",
            label: "Clinical Observation"
          },
          {
            value: "45",
            label: "Radiologists Interviewed"
          },
          {
            value: "12,000+",
            label: "Cases Analyzed"
          }
        ]
      },
      {
        title: "AI Integration Design",
        content: "Designed intuitive interfaces that present AI findings as decision support rather than replacement for clinical judgment. Created confidence scoring systems and explainable AI visualizations.\n\nFocused on reducing cognitive load while maintaining physician control over diagnostic decisions and patient care.",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=500&fit=crop"
      },
      {
        title: "Collaborative Workflows",
        content: "Implemented multi-radiologist review capabilities, structured reporting templates, and integration with hospital information systems.\n\nDesigned quality assurance workflows that track diagnostic accuracy and continuous learning for both AI models and clinical teams."
      }
    ]
  },
  {
    id: "private-3",
    title: "Cryptocurrency Trading Platform",
    description: "Building institutional-grade crypto trading infrastructure with advanced order management, risk analytics, and regulatory compliance features.",
    category: "FinTech",
    duration: "10 months",
    team: "25 people",
    role: "Lead UX Designer & Risk Management Specialist",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=800&fit=crop",
    visibility: "private",
    featured: false,
    technologies: ["React", "WebSocket", "Blockchain", "Redis", "Kubernetes"],
    impact: [
      {
        metric: "Trading Volume",
        value: "$500M+ monthly"
      },
      {
        metric: "Execution Speed",
        value: "12ms latency"
      },
      {
        metric: "Uptime",
        value: "99.99%"
      },
      {
        metric: "Institutional Clients",
        value: "150+"
      }
    ],
    sections: [
      {
        title: "Institutional Requirements",
        content: "Institutional crypto traders required professional-grade tools comparable to traditional financial markets. Existing platforms lacked sophisticated order types, risk management, and regulatory reporting needed for institutional compliance.\n\nConducted requirements gathering with hedge funds, family offices, and trading firms to understand workflow needs and regulatory constraints.",
        metrics: [
          {
            value: "15",
            label: "Institutional Interviews"
          },
          {
            value: "8",
            label: "Order Types Required"
          },
          {
            value: "24/7",
            label: "Market Availability"
          }
        ]
      },
      {
        title: "Trading Interface Design",
        content: "Created high-density information displays optimized for multi-monitor setups, real-time market data visualization, and rapid order execution.\n\nDesigned advanced charting tools, algorithmic trading controls, and portfolio management features that match Bloomberg Terminal functionality.",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop"
      },
      {
        title: "Risk & Compliance",
        content: "Implemented real-time risk monitoring with customizable limits, automatic position sizing, and regulatory reporting workflows.\n\nDesigned compliance dashboards for AML monitoring, transaction reporting, and audit trail maintenance required by institutional investors."
      }
    ]
  }
];

// Content management functions for admin/editor users
export const createNewProject = (): Partial<Project> => {
  return {
    id: `project-${Date.now()}`,
    title: "New Project",
    description: "Project description goes here...",
    category: "Web Platform",
    duration: "3 months",
    team: "5 people",
    role: "UX Designer",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop",
    visibility: "public",
    featured: false,
    technologies: [],
    impact: [],
    sections: [{
      title: "Project Overview",
      content: "Add your project content here..."
    }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const duplicateProject = (project: Project): Project => {
  return {
    ...project,
    id: `project-${Date.now()}`,
    title: `${project.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const addProjectCategory = (category: string): void => {
  if (!projectCategories.includes(category)) {
    projectCategories.push(category);
    // Save to localStorage for persistence
    localStorage.setItem('custom-project-categories', JSON.stringify(projectCategories));
  }
};

export const removeProjectCategory = (category: string): void => {
  const index = projectCategories.indexOf(category);
  if (index > 0) { // Don't allow removing "All"
    projectCategories.splice(index, 1);
    localStorage.setItem('custom-project-categories', JSON.stringify(projectCategories));
  }
};

// Get featured projects for hero slider
export const getFeaturedProjects = (): Project[] => {
  return projects.filter(project => project.featured).slice(0, 4);
};

// Get public projects that don't require authentication
export const getPublicProjects = (): Project[] => {
  return projects.filter(project => project.visibility === 'public');
};

// Get projects by category with visibility filtering
export const getProjectsByCategory = (category: string, includePrivate: boolean = false): Project[] => {
  let filteredProjects = includePrivate ? projects : getPublicProjects();
  
  if (category === "All") return filteredProjects;
  return filteredProjects.filter(project => project.category === category);
};

// Check if a project requires authentication
export const requiresAuthentication = (project: Project): boolean => {
  return project.visibility === 'private';
};