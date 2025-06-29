import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check, AlertCircle, Calendar, MessageCircle, User, Mail, Building, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
  services: string[];
  projectType: string;
  timeline: string;
  budget: string;
  availability: string;
  message: string;
}

const serviceOptions = [
  { id: 'ux-design', label: 'UX Design & Research', description: 'User experience design, research, and strategy' },
  { id: 'product-strategy', label: 'Product Strategy', description: 'Product roadmapping and strategic planning' },
  { id: 'design-systems', label: 'Design Systems', description: 'Component libraries and design standards' },
  { id: 'user-research', label: 'User Research', description: 'User interviews, testing, and insights' },
  { id: 'cx-consulting', label: 'CX Consulting', description: 'Customer experience optimization' },
  { id: 'leadership', label: 'Design Leadership', description: 'Team building and design operations' },
  { id: 'workshops', label: 'Workshops & Training', description: 'Design thinking and UX training sessions' },
  { id: 'audits', label: 'UX Audits', description: 'Comprehensive UX evaluation and recommendations' }
];

const projectTypes = [
  { value: 'new-product', label: 'New Product Development' },
  { value: 'redesign', label: 'Product Redesign' },
  { value: 'optimization', label: 'Conversion Optimization' },
  { value: 'research', label: 'User Research Project' },
  { value: 'consulting', label: 'Strategic Consulting' },
  { value: 'other', label: 'Other' }
];

const timelines = [
  { value: 'urgent', label: 'ASAP (Rush Project)' },
  { value: '1-month', label: '1-2 Months' },
  { value: '3-month', label: '3-6 Months' },
  { value: '6-month', label: '6+ Months' },
  { value: 'ongoing', label: 'Ongoing Partnership' }
];

const budgetRanges = [
  { value: 'under-25k', label: 'Under $25K' },
  { value: '25-50k', label: '$25K - $50K' },
  { value: '50-100k', label: '$50K - $100K' },
  { value: '100-250k', label: '$100K - $250K' },
  { value: '250k-plus', label: '$250K+' },
  { value: 'discuss', label: 'Let\'s Discuss' }
];

const availabilityOptions = [
  { value: 'immediately', label: 'Available Immediately' },
  { value: '2-weeks', label: 'Available in 2 Weeks' },
  { value: '1-month', label: 'Available in 1 Month' },
  { value: '2-months', label: 'Available in 2+ Months' },
  { value: 'flexible', label: 'Flexible Timeline' }
];

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
    services: [],
    projectType: '',
    timeline: '',
    budget: '',
    availability: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (formData.services.length === 0) newErrors.services = ['At least one service must be selected'];
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: checked 
        ? [...prev.services, serviceId]
        : prev.services.filter(id => id !== serviceId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock email sending - In a real app, this would call your backend API
      await mockSendEmail(formData);
      
      setIsSubmitted(true);
      toast.success("Message sent successfully! I'll get back to you within 24 hours.");
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          role: '',
          services: [],
          projectType: '',
          timeline: '',
          budget: '',
          availability: '',
          message: ''
        });
        setIsSubmitted(false);
      }, 3000);
      
    } catch (error) {
      toast.error("Failed to send message. Please try again or email directly.");
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const mockSendEmail = async (data: ContactFormData): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real implementation, this would send to your backend:
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     to: 'vachon@gmail.com',
    //     subject: `New Inquiry from ${data.firstName} ${data.lastName} at ${data.company}`,
    //     ...data
    //   })
    // });
    
    console.log('Email sent to vachon@gmail.com:', data);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
          <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="mb-2">Message Sent Successfully!</h3>
        <p className="text-muted-foreground">
          Thank you for reaching out. I'll review your inquiry and get back to you within 24 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <CardTitle>Personal Information</CardTitle>
          </div>
          <CardDescription>Tell me about yourself and your role</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              className={errors.firstName ? 'border-destructive' : ''}
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
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              className={errors.lastName ? 'border-destructive' : ''}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive mt-1">{errors.lastName}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="role">Your Role</Label>
            <Input
              id="role"
              placeholder="e.g., Product Manager, CEO"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className={errors.company ? 'border-destructive' : ''}
            />
            {errors.company && (
              <p className="text-sm text-destructive mt-1">{errors.company}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <CardTitle>Services Needed *</CardTitle>
          </div>
          <CardDescription>Select all services you're interested in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceOptions.map((service) => (
              <div key={service.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={service.id}
                  checked={formData.services.includes(service.id)}
                  onCheckedChange={(checked) => handleServiceToggle(service.id, checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor={service.id} className="cursor-pointer">
                    {service.label}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
          {errors.services && (
            <p className="text-sm text-destructive mt-2">Please select at least one service</p>
          )}
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            <CardTitle>Project Details</CardTitle>
          </div>
          <CardDescription>Help me understand your project requirements</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="projectType">Project Type</Label>
            <Select value={formData.projectType} onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                {projectTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="timeline">Desired Timeline</Label>
            <Select value={formData.timeline} onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                {timelines.map((timeline) => (
                  <SelectItem key={timeline.value} value={timeline.value}>
                    {timeline.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="budget">Budget Range</Label>
            <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                {budgetRanges.map((budget) => (
                  <SelectItem key={budget.value} value={budget.value}>
                    {budget.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="availability">My Availability</Label>
            <Select value={formData.availability} onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                {availabilityOptions.map((availability) => (
                  <SelectItem key={availability.value} value={availability.value}>
                    {availability.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Message */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            <CardTitle>Project Details *</CardTitle>
          </div>
          <CardDescription>Tell me more about your project and goals</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe your project, current challenges, and what you're hoping to achieve..."
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            className={`min-h-32 ${errors.message ? 'border-destructive' : ''}`}
          />
          {errors.message && (
            <p className="text-sm text-destructive mt-1">{errors.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-center">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="min-w-48"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Sending Message...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </>
          )}
        </Button>
      </div>
      
      <p className="text-center text-sm text-muted-foreground">
        I typically respond within 24 hours. For urgent inquiries, email me directly at{' '}
        <a href="mailto:vachon@gmail.com" className="text-primary hover:underline">
          vachon@gmail.com
        </a>
      </p>
    </motion.form>
  );
}