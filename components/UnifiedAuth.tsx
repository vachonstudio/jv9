import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Github,
  Chrome,
  Loader2,
  UserPlus,
  LogIn
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { PasswordResetModal } from './PasswordResetModal';
import { PasswordResetEmail } from '../types/auth';

interface UnifiedAuthProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
  onSuccess?: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot-password';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  newsletter: boolean;
}

export function UnifiedAuth({ 
  isOpen, 
  onClose, 
  defaultMode = 'signup',
  onSuccess 
}: UnifiedAuthProps) {
  const { login, requestPasswordReset } = useAuth();
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = useState<PasswordResetEmail | null>(null);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: true
  });

  // Check for reset token in URL on mount
  useEffect(() => {
    if (isOpen) {
      const urlParams = new URLSearchParams(window.location.search);
      const resetToken = urlParams.get('reset-token');
      
      if (resetToken) {
        // Close auth modal and open password reset modal
        onClose();
        setIsPasswordResetModalOpen(true);
        
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [isOpen, onClose]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
        newsletter: true
      });
      setError('');
      setResetEmail(null);
    }
  }, [isOpen, defaultMode]);

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
  };

  const validateForm = (): boolean => {
    if (mode === 'signup') {
      if (!formData.name.trim()) {
        setError('Please enter your name');
        return false;
      }
      if (!formData.email.trim()) {
        setError('Please enter your email');
        return false;
      }
      if (!formData.password) {
        setError('Please enter a password');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (!formData.acceptTerms) {
        setError('Please accept the terms and conditions');
        return false;
      }
    } else if (mode === 'login') {
      if (!formData.email.trim()) {
        setError('Please enter your email');
        return false;
      }
      if (!formData.password) {
        setError('Please enter your password');
        return false;
      }
    } else if (mode === 'forgot-password') {
      if (!formData.email.trim()) {
        setError('Please enter your email');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        // Handle signup
        const userData = {
          name: formData.name,
          email: formData.email,
          profileImage: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`,
          preferences: {
            newsletter: formData.newsletter,
            notifications: true,
            theme: 'system'
          }
        };
        
        localStorage.setItem('user-signed-up', 'true');
        localStorage.setItem('user-data', JSON.stringify(userData));
        
        toast.success('Account created successfully! Welcome to the community!');
        onSuccess?.();
        onClose();
        
      } else if (mode === 'login') {
        // Handle login - this will work for all legitimate users
        await login(formData.email, formData.password);
        toast.success('Successfully logged in!');
        onSuccess?.();
        onClose();
        
      } else if (mode === 'forgot-password') {
        // Handle password reset request
        const resetEmailData = await requestPasswordReset(formData.email);
        setResetEmail(resetEmailData);
        
        // Close auth modal and open password reset modal
        onClose();
        setIsPasswordResetModalOpen(true);
        
        toast.success('Password reset email generated! Check the modal for your reset link.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Mock social login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`${provider} login would be implemented here`);
      
      onSuccess?.();
      onClose();
    } catch (error) {
      setError('Social login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getModeConfig = () => {
    switch (mode) {
      case 'signup':
        return {
          title: 'Join the Community',
          subtitle: 'Create your account to access exclusive content',
          submitText: 'Create Account',
          switchText: 'Already have an account?',
          switchAction: 'Sign In',
          icon: <UserPlus className="w-5 h-5" />
        };
      case 'login':
        return {
          title: 'Welcome Back',
          subtitle: 'Sign in to your account',
          submitText: 'Sign In',
          switchText: 'Don\'t have an account?',
          switchAction: 'Join Now',
          icon: <LogIn className="w-5 h-5" />
        };
      case 'forgot-password':
        return {
          title: 'Reset Password',
          subtitle: 'Enter your email to receive a reset link',
          submitText: 'Send Reset Link',
          switchText: 'Remember your password?',
          switchAction: 'Sign In',
          icon: <Mail className="w-5 h-5" />
        };
      default:
        return {
          title: 'Authentication',
          subtitle: '',
          submitText: 'Continue',
          switchText: '',
          switchAction: '',
          icon: <User className="w-5 h-5" />
        };
    }
  };

  const config = getModeConfig();

  // Get reset token from URL for password reset modal
  const urlParams = new URLSearchParams(window.location.search);
  const resetToken = urlParams.get('reset-token');

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {config.icon}
              {config.title}
            </DialogTitle>
            {config.subtitle && (
              <p className="text-sm text-muted-foreground">{config.subtitle}</p>
            )}
          </DialogHeader>

          <div className="space-y-6">
            {/* Social Login Options */}
            {(mode === 'login' || mode === 'signup') && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('Google')}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Chrome className="w-4 h-4" />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('GitHub')}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      or continue with email
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* Name Field - Signup Only */}
                  {mode === 'signup' && (
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => updateFormData('name', e.target.value)}
                          className="pl-10"
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field - Not for Forgot Password */}
                  {mode !== 'forgot-password' && (
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => updateFormData('password', e.target.value)}
                          className="pl-10 pr-10"
                          disabled={isLoading}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Confirm Password - Signup Only */}
                  {mode === 'signup' && (
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="text-sm font-medium">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                          className="pl-10 pr-10"
                          disabled={isLoading}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Terms and Newsletter - Signup Only */}
                  {mode === 'signup' && (
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.acceptTerms}
                          onCheckedChange={(checked) => updateFormData('acceptTerms', !!checked)}
                          disabled={isLoading}
                        />
                        <label htmlFor="terms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          I agree to the{' '}
                          <button
                            type="button"
                            className="underline hover:no-underline"
                            onClick={() => toast.info('Terms would be shown here')}
                          >
                            Terms of Service
                          </button>{' '}
                          and{' '}
                          <button
                            type="button"
                            className="underline hover:no-underline"
                            onClick={() => toast.info('Privacy policy would be shown here')}
                          >
                            Privacy Policy
                          </button>
                        </label>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="newsletter"
                          checked={formData.newsletter}
                          onCheckedChange={(checked) => updateFormData('newsletter', !!checked)}
                          disabled={isLoading}
                        />
                        <label htmlFor="newsletter" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Subscribe to our newsletter for UX insights and resources
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Forgot Password Link - Login Only */}
                  {mode === 'login' && (
                    <div className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setMode('forgot-password')}
                        disabled={isLoading}
                      >
                        Forgot your password?
                      </Button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {mode === 'forgot-password' ? 'Sending...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    {config.submitText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Mode Switching */}
            <div className="text-center space-y-2">
              {config.switchText && (
                <p className="text-sm text-muted-foreground">
                  {config.switchText}{' '}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm font-medium p-0 h-auto"
                    onClick={() => {
                      if (mode === 'signup') setMode('login');
                      else if (mode === 'login') setMode('signup');
                      else if (mode === 'forgot-password') setMode('login');
                    }}
                    disabled={isLoading}
                  >
                    {config.switchAction}
                  </Button>
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Reset Modal */}
      <PasswordResetModal
        isOpen={isPasswordResetModalOpen}
        onClose={() => {
          setIsPasswordResetModalOpen(false);
          setResetEmail(null);
        }}
        resetEmail={resetEmail}
        resetToken={resetToken}
      />
    </>
  );
}