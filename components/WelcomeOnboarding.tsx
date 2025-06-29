import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  User,
  Mail,
  Shield,
  BookOpen,
  Palette,
  Heart,
  Star,
  Gift,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface WelcomeOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  action?: {
    label: string;
    handler: () => void;
  };
}

export function WelcomeOnboarding({ 
  isOpen, 
  onClose, 
  userName, 
  userEmail 
}: WelcomeOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: `Welcome, ${userName.split(' ')[0]}! 🎉`,
      description: 'Thanks for joining our creative community',
      icon: <Sparkles className="w-6 h-6 text-yellow-500" />,
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">You're all set!</h3>
            <p className="text-muted-foreground">
              Your account has been created and you now have access to:
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm">Exclusive UX case studies</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm">Premium blog content</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <span className="text-sm">Gradient gallery access</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'features',
      title: 'Explore What\'s Available',
      description: 'Discover all the features you can access',
      icon: <Star className="w-6 h-6 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Portfolio & Case Studies</h4>
                    <p className="text-sm text-muted-foreground">
                      Access detailed UX case studies and portfolio projects
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <Palette className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Gradient Gallery</h4>
                    <p className="text-sm text-muted-foreground">
                      Browse, create, and share beautiful gradients
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Stories & Blog</h4>
                    <p className="text-sm text-muted-foreground">
                      Read exclusive content and industry insights
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'account',
      title: 'Your Account Details',
      description: 'Review your account information',
      icon: <User className="w-6 h-6 text-green-500" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-semibold mb-1">{userName}</h3>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm">Account Status</span>
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm">Account Type</span>
              <Badge variant="outline">
                <Shield className="w-3 h-3 mr-1" />
                Subscriber
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm">Newsletter</span>
              <Badge variant="secondary">
                <Mail className="w-3 h-3 mr-1" />
                Subscribed
              </Badge>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Welcome Bonus!</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  As a new member, you get early access to new features and exclusive content for your first month.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'next-steps',
      title: 'Ready to Explore?',
      description: 'Here are some suggested next steps',
      icon: <ArrowRight className="w-6 h-6 text-purple-500" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-semibold mb-2">You're ready to go!</h3>
            <p className="text-muted-foreground">
              Start exploring the community and all the resources available to you.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => {
                toast.success('Portfolio opened!');
                onClose();
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Browse Portfolio</p>
                  <p className="text-sm text-muted-foreground">Check out UX case studies</p>
                </div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => {
                toast.success('Stories opened!');
                onClose();
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Read Stories</p>
                  <p className="text-sm text-muted-foreground">Explore blog posts and insights</p>
                </div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => {
                toast.success('Gradient gallery opened!');
                onClose();
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Explore Gradients</p>
                  <p className="text-sm text-muted-foreground">Browse beautiful gradients</p>
                </div>
              </div>
            </Button>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="sr-only">
          <DialogTitle>Welcome Onboarding - {steps[currentStep].title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {steps[currentStep].icon}
              <div>
                <h2 className="text-lg font-semibold">{steps[currentStep].title}</h2>
                <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
              aria-label="Close welcome onboarding"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-96"
            >
              {steps[currentStep].content}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-primary'
                      : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {currentStep === steps.length - 1 ? (
              <Button onClick={onClose} className="flex items-center gap-2">
                Get Started
                <Sparkles className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}