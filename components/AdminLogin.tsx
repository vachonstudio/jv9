import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, Shield, Edit, ArrowUp, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleRequestClick?: () => void;
  onUserManagementClick?: () => void;
}

export function AdminLogin({ 
  isOpen, 
  onClose, 
  onRoleRequestClick, 
  onUserManagementClick 
}: AdminLoginProps) {
  const { login, user, isSuperAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      toast.success('Successfully logged in');
      onClose();
      setEmail('');
      setPassword('');
    } catch (error) {
      setError('Invalid credentials or account not found');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuperAdminLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      await login('vachon@gmail.com', 'demo');
      toast.success('Logged in as Super Admin');
      onClose();
    } catch (error) {
      setError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {user ? 'Admin Panel' : 'Admin Access'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {user ? (
            // User is logged in - show admin panel options
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {user.role === 'super_admin' ? (
                    <Shield className="w-5 h-5 text-red-600" />
                  ) : user.role === 'admin' ? (
                    <Shield className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Edit className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Badge className={
                  user.role === 'super_admin' ? 'bg-red-600' :
                  user.role === 'admin' ? 'bg-blue-600' :
                  user.role === 'editor' ? 'bg-green-600' : 'bg-gray-600'
                }>
                  {user.role.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-2">
                {isSuperAdmin() && (
                  <Button
                    onClick={() => {
                      onUserManagementClick?.();
                      onClose();
                    }}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    User Management Dashboard
                  </Button>
                )}

                {(user.role === 'subscriber' || user.role === 'editor') && (
                  <Button
                    onClick={() => {
                      onRoleRequestClick?.();
                      onClose();
                    }}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <ArrowUp className="w-4 h-4 mr-2" />
                    Request Role Upgrade
                  </Button>
                )}

                <p className="text-xs text-muted-foreground px-2">
                  {user.role === 'super_admin' 
                    ? 'You have full system access and can manage all users.'
                    : user.role === 'admin'
                    ? 'You have full content management access.'
                    : user.role === 'editor'
                    ? 'You can edit portfolio projects and blog posts.'
                    : 'You have subscriber access. Request an upgrade for editing permissions.'
                  }
                </p>
              </div>
            </div>
          ) : (
            // User not logged in - show login options
            <>
              {/* Super Admin Demo Login */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Super Admin Access</h4>
                <Button
                  variant="outline"
                  onClick={handleSuperAdminLogin}
                  disabled={isLoading}
                  className="w-full justify-start"
                >
                  <Shield className="w-4 h-4 mr-2 text-red-600" />
                  Login as Super Admin
                  <Badge variant="secondary" className="ml-auto">Full System Access</Badge>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Super admin can manage all users and approve role requests.
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or login with existing account
                  </span>
                </div>
              </div>

              {/* Manual Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>

              <div className="text-center space-y-2">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Super Admin:</strong> vachon@gmail.com (manages all users)</p>
                  <p><strong>Note:</strong> Admin and Editor roles require super admin approval</p>
                  <p><strong>Subscribers:</strong> Can request role upgrades through the system</p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}