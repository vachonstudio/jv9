import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, UserPlus, Star, Award, Users, User, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface ProtectedContentProps {
  isAuthenticated: boolean;
  onSignupClick: () => void;
  children: ReactNode;
  fallbackType?: 'portfolio' | 'project' | 'profile' | 'minimal';
  projectTitle?: string;
  projectCategory?: string;
}

export function ProtectedContent({ 
  isAuthenticated, 
  onSignupClick, 
  children, 
  fallbackType = 'portfolio',
  projectTitle,
  projectCategory
}: ProtectedContentProps) {
  if (isAuthenticated) {
    return <>{children}</>;
  }

  if (fallbackType === 'minimal') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            Sign up to view this content
          </p>
          <Button onClick={onSignupClick} size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Join Community
          </Button>
        </div>
      </div>
    );
  }

  if (fallbackType === 'profile') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen p-6"
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h1 className="mb-4">Create Your Profile</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Join our community to create and customize your personal profile, 
              showcase your work, and connect with other designers.
            </p>
          </div>

          <Card className="mb-8 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Settings className="w-5 h-5" />
                Profile Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="mb-1">Custom Avatar</h4>
                    <p className="text-sm text-muted-foreground">
                      Upload and customize your profile picture
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="mb-1">Background Image</h4>
                    <p className="text-sm text-muted-foreground">
                      Personalize your profile with a custom background
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="mb-1">Personal Bio</h4>
                    <p className="text-sm text-muted-foreground">
                      Share your story with up to 2000 words
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="mb-1">Activity Stats</h4>
                    <p className="text-sm text-muted-foreground">
                      Track your projects, likes, and engagement
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Button 
              onClick={onSignupClick} 
              size="lg" 
              className="inline-flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Create Your Profile - Free
            </Button>
            
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free forever
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No spam
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Full customization
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (fallbackType === 'project') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <Card className="max-w-md w-full bg-background border-border">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              <Eye className="w-5 h-5" />
              Premium Content
            </CardTitle>
            <CardDescription>
              {projectTitle && projectCategory && (
                <div className="mb-3">
                  <Badge variant="outline" className="mb-2">{projectCategory}</Badge>
                  <p className="font-medium">{projectTitle}</p>
                </div>
              )}
              This detailed case study is available to community members only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="mb-2 text-sm">What you'll get access to:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <Award className="w-3 h-3" />
                  Full case study with detailed process
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-3 h-3" />
                  User research insights and findings
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-3 h-3" />
                  Design decisions and impact metrics
                </li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={onSignupClick} className="flex-1">
                <UserPlus className="w-4 h-4 mr-2" />
                Join Free
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                Back
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              Free forever • No spam • Exclusive resources
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Default portfolio fallback
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen p-6"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="mb-4">Premium Portfolio Access</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My detailed case studies and work examples are available to community members. 
            Join to get exclusive access to in-depth UX processes, research insights, and design decisions.
          </p>
        </div>

        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Eye className="w-5 h-5" />
              What's Inside
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="mb-1">Detailed Case Studies</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete project walkthroughs with process, challenges, and solutions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="mb-1">User Research</h4>
                  <p className="text-sm text-muted-foreground">
                    Research methodologies, user insights, and validation approaches
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="mb-1">Impact Metrics</h4>
                  <p className="text-sm text-muted-foreground">
                    Measurable results and business impact of design decisions
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button 
            onClick={onSignupClick} 
            size="lg" 
            className="inline-flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Join Community - Free Access
          </Button>
          
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Free forever
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No spam
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Exclusive resources
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}