import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Copy,
  ExternalLink,
  CheckCircle,
  Loader2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { PasswordResetEmail } from '../types/auth';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  resetEmail?: PasswordResetEmail | null;
  resetToken?: string | null;
}

export function PasswordResetModal({ 
  isOpen, 
  onClose, 
  resetEmail,
  resetToken 
}: PasswordResetModalProps) {
  const { resetPassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isResetComplete, setIsResetComplete] = useState(false);

  const handleCopyLink = () => {
    if (resetEmail?.resetLink) {
      navigator.clipboard.writeText(resetEmail.resetLink);
      toast.success('Reset link copied to clipboard!');
    }
  };

  const handleUseResetLink = () => {
    if (resetEmail?.token) {
      // Simulate clicking the reset link by parsing the token
      const urlParams = new URLSearchParams();
      urlParams.set('reset-token', resetEmail.token);
      window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
      window.location.reload();
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetToken) {
      setError('Invalid reset token');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await resetPassword(resetToken, newPassword);
      setIsResetComplete(true);
      toast.success('Password reset successfully! You can now sign in with your new password.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setIsResetComplete(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {resetToken ? (
              <>
                <Lock className="w-5 h-5" />
                Reset Your Password
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                Password Reset Email Sent
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Password Reset Form */}
          {resetToken && !isResetComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your reset token is valid. Please enter your new password below.
                </AlertDescription>
              </Alert>

              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError('');
                      }}
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
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError('');
                      }}
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

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          )}

          {/* Success State */}
          {isResetComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Password Reset Complete!</h3>
              <p className="text-muted-foreground">
                Your password has been successfully updated. You can now sign in with your new password.
              </p>
              <Button onClick={handleClose} className="w-full">
                Continue to Sign In
              </Button>
            </motion.div>
          )}

          {/* Email Display */}
          {resetEmail && !resetToken && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Password reset email sent successfully! Since this is a demo, we're showing you the email content below.
                </AlertDescription>
              </Alert>

              {/* Email Preview */}
              <Card className="border-2 border-primary/20">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Password Reset Email
                    </CardTitle>
                    <Badge variant="secondary">Demo Email</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">To:</span>
                      <span className="text-muted-foreground">{resetEmail.to}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Subject:</span>
                      <span className="text-muted-foreground">{resetEmail.subject}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Email Body */}
                  <div className="space-y-4 text-sm leading-relaxed">
                    <p>Hi {resetEmail.userName},</p>
                    
                    <p>
                      We received a request to reset the password for your account associated with this email address. 
                      If you made this request, please click the link below to reset your password:
                    </p>

                    <div className="p-4 bg-muted/50 rounded-lg border border-dashed border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Reset Link:</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyLink}
                          className="h-6 px-2"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground break-all font-mono bg-background p-2 rounded border">
                        {resetEmail.resetLink}
                      </div>
                    </div>

                    <p>
                      <strong>This link will expire in 1 hour</strong> for security reasons. If you didn't request this 
                      password reset, you can safely ignore this email.
                    </p>

                    <p>
                      If you're having trouble clicking the reset link, you can copy and paste it into your web browser.
                    </p>

                    <div className="pt-2 border-t border-dashed border-border">
                      <p className="text-xs text-muted-foreground">
                        Best regards,<br />
                        Alex Chen Portfolio Team
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleUseResetLink}
                      className="flex-1"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Use Reset Link
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleCopyLink}
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Demo Note:</strong> In a real application, this email would be sent to your inbox. 
                  For this demo, we're showing the email content here. Click "Use Reset Link" to proceed with the password reset.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}