import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Shield, Edit, User, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, ROLE_DISPLAY_INFO, getAvailableRoleUpgrades } from '../types/auth';
import { toast } from 'sonner';

interface RoleRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoleRequestModal({ isOpen, onClose }: RoleRequestModalProps) {
  const { user, requestRoleUpgrade, getRoleRequests } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const existingRequests = getRoleRequests();
  const hasPendingRequest = existingRequests.some(
    r => r.userId === user.id && r.status === 'pending'
  );

  // Get available role upgrades for the current user
  const availableRoles = getAvailableRoleUpgrades(user.role);

  const handleSubmit = async () => {
    if (!selectedRole || !reason.trim()) {
      toast.error('Please select a role and provide a reason');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await requestRoleUpgrade(selectedRole as UserRole, reason.trim());
      if (result.error) {
        throw new Error(result.error);
      }
      onClose();
      setSelectedRole('');
      setReason('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <Shield className="w-4 h-4 text-red-600" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'editor':
        return <Edit className="w-4 h-4 text-green-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowUp className="w-5 h-5" />
            Request Role Upgrade
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Role */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              {getRoleIcon(user.role)}
              <div>
                <p className="font-medium">Current Role</p>
                <p className="text-sm text-muted-foreground">
                  {ROLE_DISPLAY_INFO[user.role].name}
                </p>
              </div>
            </div>
            <Badge className={`bg-${ROLE_DISPLAY_INFO[user.role].color}-100 text-${ROLE_DISPLAY_INFO[user.role].color}-700`}>
              {ROLE_DISPLAY_INFO[user.role].name}
            </Badge>
          </div>

          {hasPendingRequest ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You already have a pending role request. Please wait for approval before submitting another request.
              </AlertDescription>
            </Alert>
          ) : availableRoles.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You have the highest available role. No upgrades are available.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Requested Role</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role to request" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(role)}
                          <span>{ROLE_DISPLAY_INFO[role].name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedRole && (
                  <p className="text-xs text-muted-foreground">
                    {ROLE_DISPLAY_INFO[selectedRole as UserRole].description}
                  </p>
                )}
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Reason for Request <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder="Please explain why you need this role upgrade and how you plan to use the additional permissions..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Provide a detailed explanation to help with the approval process.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedRole || !reason.trim() || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>

              {/* Info */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Role requests are reviewed by administrators</p>
                <p>• You will be notified once your request is reviewed</p>
                <p>• Only one pending request is allowed at a time</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}