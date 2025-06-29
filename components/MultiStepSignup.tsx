import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, User, Target, Briefcase, Settings, Sparkles, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { toast } from "sonner@2.0.3";
import { 
  SignupFormData, 
  interestOptions, 
  primaryGoalOptions, 
  roleOptions, 
  experienceOptions, 
  teamSizeOptions, 
  challengeOptions,
  communicationOptions 
} from "../types/signup";

interface MultiStepSignupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: SignupFormData) => void;
}

const steps = [
  { 
    id: 1, 
    title: "Welcome", 
    subtitle: "Let's get to know you",
    icon: User,
    description: "Tell us your basic information to get started"
  },
  { 
    id: 2, 
    title: "Interests", 
    subtitle: "What drives you?",
    icon: Target,
    description: "Help us understand what you're passionate about"
  },
  { 
    id: 3, 
    title: "Professional", 
    subtitle: "Your background",
    icon: Briefcase,
    description: "Share your professional experience and role"
  },
  { 
    id: 4, 
    title: "Goals", 
    subtitle: "What you want to achieve",
    icon: Sparkles,
    description: "Let us know how we can best support you"
  },
  { 
    id: 5, 
    title: "Complete", 
    subtitle: "You're all set!",
    icon: Check,
    description: "Welcome to the community"
  }
];

export function MultiStepSignup({ isOpen, onClose, onComplete }: MultiStepSignupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    interests: [],
    primaryGoal: '',
    role: '',
    company: '',
    experience: '',
    teamSize: '',
    challenges: [],
    newsletter: true,
    updates: true,
    communityAccess: true,
    communicationPreference: 'email',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('signup-progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, [isOpen]);

  // Save progress to localStorage
  useEffect(() => {
    if (isOpen) {
      localStorage.setItem('signup-progress', JSON.stringify(formData));
    }
  }, [formData, isOpen]);

  const updateFormData = (updates: Partial<SignupFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear related errors
    const newErrors = { ...errors };
    Object.keys(updates).forEach(key => {
      delete newErrors[key];
    });
    setErrors(newErrors);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
      
      case 2:
        if (formData.interests.length === 0) {
          newErrors.interests = 'Please select at least one interest';
        }
        if (!formData.primaryGoal) newErrors.primaryGoal = 'Please select your primary goal';
        break;
      
      case 3:
        if (!formData.role) newErrors.role = 'Please select your role';
        if (!formData.experience) newErrors.experience = 'Please select your experience level';
        break;
      
      case 4:
        if (formData.challenges.length === 0) {
          newErrors.challenges = 'Please select at least one challenge';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast.error("Please complete all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCurrentStep(5);
      
      // Clear saved progress
      localStorage.removeItem('signup-progress');
      
      // Complete after showing success step
      setTimeout(() => {
        onComplete(formData);
        toast.success("Welcome! You're now part of our community.");
      }, 2000);
      
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInterestToggle = (interestId: string, checked: boolean) => {
    const newInterests = checked 
      ? [...formData.interests, interestId]
      : formData.interests.filter(id => id !== interestId);
    updateFormData({ interests: newInterests });
  };

  const handleChallengeToggle = (challengeId: string, checked: boolean) => {
    const newChallenges = checked 
      ? [...formData.challenges, challengeId]
      : formData.challenges.filter(id => id !== challengeId);
    updateFormData({ challenges: newChallenges });
  };

  const progress = (currentStep / steps.length) * 100;
  const currentStepData = steps[currentStep - 1];
  const IconComponent = currentStepData?.icon;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen py-8 px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="max-w-2xl mx-auto bg-background border border-border rounded-3xl overflow-hidden shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with progress */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {IconComponent && (
                    <IconComponent className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div>
                  <h2 className="text-foreground">{currentStepData?.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {currentStepData?.subtitle}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Step {currentStep} of {steps.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* Step content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && <Step1 formData={formData} updateFormData={updateFormData} errors={errors} />}
                {currentStep === 2 && <Step2 formData={formData} updateFormData={updateFormData} onInterestToggle={handleInterestToggle} errors={errors} />}
                {currentStep === 3 && <Step3 formData={formData} updateFormData={updateFormData} errors={errors} />}
                {currentStep === 4 && <Step4 formData={formData} updateFormData={updateFormData} onChallengeToggle={handleChallengeToggle} errors={errors} />}
                {currentStep === 5 && <Step5 formData={formData} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          {currentStep < 5 && (
            <div className="p-6 border-t border-border">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>

                {currentStep < 4 ? (
                  <Button onClick={nextStep} className="flex items-center gap-2">
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Complete Signup
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

// Step 1: Personal Information
function Step1({ formData, updateFormData, errors }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          Let's start with some basic information about you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => updateFormData({ firstName: e.target.value })}
            className={errors.firstName ? 'border-destructive' : ''}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="text-sm text-destructive mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => updateFormData({ lastName: e.target.value })}
            className={errors.lastName ? 'border-destructive' : ''}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="text-sm text-destructive mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          className={errors.email ? 'border-destructive' : ''}
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          We'll use this to send you updates and resources
        </p>
      </div>
    </div>
  );
}

// Step 2: Interests and Goals
function Step2({ formData, updateFormData, onInterestToggle, errors }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          Help us understand what you're interested in learning about
        </p>
      </div>

      <div>
        <Label>What interests you most? *</Label>
        <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {interestOptions.map((interest) => (
            <div key={interest.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox
                id={interest.id}
                checked={formData.interests.includes(interest.id)}
                onCheckedChange={(checked) => onInterestToggle(interest.id, checked)}
              />
              <div className="flex-1">
                <Label htmlFor={interest.id} className="cursor-pointer">
                  {interest.label}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">{interest.description}</p>
              </div>
            </div>
          ))}
        </div>
        {errors.interests && (
          <p className="text-sm text-destructive mt-2">{errors.interests}</p>
        )}
      </div>

      <div>
        <Label>What's your primary goal? *</Label>
        <RadioGroup 
          value={formData.primaryGoal} 
          onValueChange={(value) => updateFormData({ primaryGoal: value })}
          className="mt-3"
        >
          {primaryGoalOptions.map((goal) => (
            <div key={goal.value} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
              <RadioGroupItem value={goal.value} id={goal.value} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={goal.value} className="cursor-pointer">
                  {goal.label}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
        {errors.primaryGoal && (
          <p className="text-sm text-destructive mt-2">{errors.primaryGoal}</p>
        )}
      </div>
    </div>
  );
}

// Step 3: Professional Information
function Step3({ formData, updateFormData, errors }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          Tell us about your professional background
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="role">Your Role *</Label>
          <Select value={formData.role} onValueChange={(value) => updateFormData({ role: value })}>
            <SelectTrigger className={errors.role ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-sm text-destructive mt-1">{errors.role}</p>
          )}
        </div>

        <div>
          <Label htmlFor="experience">Experience Level *</Label>
          <Select value={formData.experience} onValueChange={(value) => updateFormData({ experience: value })}>
            <SelectTrigger className={errors.experience ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              {experienceOptions.map((exp) => (
                <SelectItem key={exp.value} value={exp.value}>
                  {exp.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.experience && (
            <p className="text-sm text-destructive mt-1">{errors.experience}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="company">Company/Organization</Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => updateFormData({ company: e.target.value })}
          placeholder="Where do you work?"
        />
      </div>

      <div>
        <Label htmlFor="teamSize">Team Size</Label>
        <Select value={formData.teamSize} onValueChange={(value) => updateFormData({ teamSize: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select team size" />
          </SelectTrigger>
          <SelectContent>
            {teamSizeOptions.map((size) => (
              <SelectItem key={size.value} value={size.value}>
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Step 4: Goals and Preferences
function Step4({ formData, updateFormData, onChallengeToggle, errors }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          What challenges are you facing? This helps us provide better resources.
        </p>
      </div>

      <div>
        <Label>Current Challenges *</Label>
        <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
        <div className="space-y-3">
          {challengeOptions.map((challenge) => (
            <div key={challenge.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox
                id={challenge.id}
                checked={formData.challenges.includes(challenge.id)}
                onCheckedChange={(checked) => onChallengeToggle(challenge.id, checked)}
              />
              <div className="flex-1">
                <Label htmlFor={challenge.id} className="cursor-pointer">
                  {challenge.label}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
              </div>
            </div>
          ))}
        </div>
        {errors.challenges && (
          <p className="text-sm text-destructive mt-2">{errors.challenges}</p>
        )}
      </div>

      <div>
        <Label>Communication Preferences</Label>
        <RadioGroup 
          value={formData.communicationPreference} 
          onValueChange={(value) => updateFormData({ communicationPreference: value })}
          className="mt-3"
        >
          {communicationOptions.map((option) => (
            <div key={option.value} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
              <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={option.value} className="cursor-pointer">
                  {option.label}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="newsletter"
            checked={formData.newsletter}
            onCheckedChange={(checked) => updateFormData({ newsletter: checked })}
          />
          <Label htmlFor="newsletter" className="text-sm">
            Subscribe to newsletter with design tips and resources
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="updates"
            checked={formData.updates}
            onCheckedChange={(checked) => updateFormData({ updates: checked })}
          />
          <Label htmlFor="updates" className="text-sm">
            Get notified about new portfolio projects and case studies
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="communityAccess"
            checked={formData.communityAccess}
            onCheckedChange={(checked) => updateFormData({ communityAccess: checked })}
          />
          <Label htmlFor="communityAccess" className="text-sm">
            Join our design community for networking and collaboration
          </Label>
        </div>
      </div>
    </div>
  );
}

// Step 5: Confirmation
function Step5({ formData }: any) {
  const selectedInterests = interestOptions.filter(option => 
    formData.interests.includes(option.id)
  );
  
  const selectedChallenges = challengeOptions.filter(option => 
    formData.challenges.includes(option.id)
  );

  return (
    <div className="space-y-6 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
        <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      
      <div>
        <h3 className="mb-2">Welcome to the community, {formData.firstName}! 🎉</h3>
        <p className="text-muted-foreground mb-6">
          You're all set! Here's a summary of your preferences:
        </p>
      </div>

      <Card>
        <CardContent className="p-6 text-left">
          <div className="space-y-4">
            <div>
              <h4 className="mb-2">Your Interests</h4>
              <div className="flex flex-wrap gap-2">
                {selectedInterests.map((interest) => (
                  <Badge key={interest.id} variant="secondary">
                    {interest.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2">Primary Goal</h4>
              <p className="text-sm text-muted-foreground">
                {primaryGoalOptions.find(g => g.value === formData.primaryGoal)?.label}
              </p>
            </div>

            <div>
              <h4 className="mb-2">Current Challenges</h4>
              <div className="space-y-1">
                {selectedChallenges.slice(0, 3).map((challenge) => (
                  <p key={challenge.id} className="text-sm text-muted-foreground">
                    • {challenge.label}
                  </p>
                ))}
                {selectedChallenges.length > 3 && (
                  <p className="text-sm text-muted-foreground">
                    + {selectedChallenges.length - 3} more
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <Mail className="w-4 h-4 inline mr-2" />
          Check your email for a welcome message with next steps and exclusive resources!
        </p>
      </div>
    </div>
  );
}