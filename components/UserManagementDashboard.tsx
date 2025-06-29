import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Shield, 
  Edit, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ChevronDown,
  Mail,
  Calendar
} from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { User as UserType, RoleRequest, UserRole, ROLE_DISPLAY_INFO } from '../types/auth';
import { toast } from 'sonner';

interface UserManagementDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserManagementDashboard({ isOpen, onClose }: UserManagementDashboardProps) {
  const { 
    user, 
    getAllUsers, 
    getRoleRequests, 
    approveRoleRequest, 
    rejectRoleRequest,
    updateUserRole,
    isSuperAdmin 
  } = useAuth();
  
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  if (!user || !isSuperAdmin()) return null;

  const allUsers = getAllUsers();
  const roleRequests = getRoleRequests();
  const pendingRequests = roleRequests.filter(r => r.status === 'pending');

  const handleApproveRequest = async (requestId: string) => {
    try {
      await approveRoleRequest(requestId);
      toast.success('Request approved successfully');
    } catch (error) {
      toast.error('Failed to approve request');
      console.error('Error approving request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectRoleRequest(requestId);
      toast.success('Request rejected');
    } catch (error) {
      toast.error('Failed to reject request');
      console.error('Error rejecting request:', error);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success('User role updated successfully');
    } catch (error) {
      toast.error('Failed to update user role');
      console.error('Error updating user role:', error);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'denied':
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const roleStats = allUsers.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<UserRole, number>);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full lg:max-w-7xl lg:h-auto overflow-hidden">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Management Dashboard
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 flex-shrink-0 mb-4">
              <TabsTrigger value="overview" className="text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="users" className="text-sm">
                All Users
              </TabsTrigger>
              <TabsTrigger value="requests" className="relative text-sm">
                <span className="truncate">Role Requests</span>
                {pendingRequests.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 min-w-4 p-0 flex items-center justify-center bg-red-600 text-white text-xs rounded-full">
                    {pendingRequests.length > 9 ? '9+' : pendingRequests.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-sm">
                Analytics
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto">
              <TabsContent value="overview" className="space-y-6 mt-0">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{allUsers.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {allUsers.filter(u => u.status === 'active').length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Editors & Admins</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {allUsers.filter(u => u.role === 'admin' || u.role === 'editor' || u.role === 'super_admin').length}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Role Requests */}
                {pendingRequests.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        Pending Role Requests
                        <Badge className="bg-red-600 text-white ml-2">
                          {pendingRequests.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {pendingRequests.slice(0, 3).map((request) => (
                        <div key={request.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg">
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <Avatar className="w-10 h-10 flex-shrink-0">
                              <img 
                                src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`} 
                                alt={request.userName || 'User'} 
                                className="w-full h-full object-cover" 
                              />
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">{request.userName}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                Requesting {ROLE_DISPLAY_INFO[request.requestedRole].name}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveRequest(request.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRejectRequest(request.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                      {pendingRequests.length > 3 && (
                        <p className="text-sm text-muted-foreground text-center">
                          +{pendingRequests.length - 3} more pending requests
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="users" className="space-y-4 mt-0">
                <div className="grid gap-4">
                  {allUsers.map((userItem) => (
                    <Card key={userItem.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <Avatar className="w-12 h-12 flex-shrink-0">
                              <img 
                                src={userItem.avatar || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`} 
                                alt={userItem.name || 'User'} 
                                className="w-full h-full object-cover" 
                              />
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium truncate">{userItem.name}</p>
                                {userItem.role === 'super_admin' && (
                                  <Badge className="bg-red-600 text-white text-xs flex-shrink-0">SUPER ADMIN</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Mail className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{userItem.email}</span>
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-3 h-3 flex-shrink-0" />
                                Joined {new Date(userItem.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="text-left sm:text-right">
                              <Badge className={`bg-${ROLE_DISPLAY_INFO[userItem.role].color}-100 text-${ROLE_DISPLAY_INFO[userItem.role].color}-700 mb-1`}>
                                {getRoleIcon(userItem.role)}
                                <span className="ml-1">{ROLE_DISPLAY_INFO[userItem.role].name}</span>
                              </Badge>
                              <p className="text-xs text-muted-foreground">
                                Status: {userItem.status}
                              </p>
                            </div>
                            {userItem.role !== 'super_admin' && (
                              <Select
                                value={userItem.role}
                                onValueChange={(newRole: UserRole) => handleUpdateUserRole(userItem.id, newRole)}
                              >
                                <SelectTrigger className="w-32 flex-shrink-0">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="subscriber">Subscriber</SelectItem>
                                  <SelectItem value="editor">Editor</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="requests" className="space-y-4 mt-0">
                {roleRequests.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No role requests found</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {roleRequests.map((request) => (
                      <Card key={request.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                            <div className="flex items-start gap-4 min-w-0 flex-1">
                              <Avatar className="w-12 h-12 flex-shrink-0">
                                <img 
                                  src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`} 
                                  alt={request.userName || 'User'} 
                                  className="w-full h-full object-cover" 
                                />
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                  <p className="font-medium">{request.userName}</p>
                                  <Badge variant="outline" className="text-xs w-fit">
                                    {request.userEmail}
                                  </Badge>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                                  <div className="flex items-center gap-2">
                                    {getRoleIcon(request.currentRole)}
                                    <span className="text-sm">{ROLE_DISPLAY_INFO[request.currentRole].name}</span>
                                  </div>
                                  <span className="text-muted-foreground hidden sm:inline">→</span>
                                  <div className="flex items-center gap-2">
                                    {getRoleIcon(request.requestedRole)}
                                    <span className="text-sm font-medium">{ROLE_DISPLAY_INFO[request.requestedRole].name}</span>
                                  </div>
                                </div>
                                {request.reason && (
                                  <div className="bg-muted/30 p-3 rounded-lg mb-3">
                                    <p className="text-sm font-medium mb-1">Reason:</p>
                                    <p className="text-sm text-muted-foreground">{request.reason}</p>
                                  </div>
                                )}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                                  <span>Requested: {new Date(request.createdAt).toLocaleDateString()}</span>
                                  {request.reviewedAt && (
                                    <span>Reviewed: {new Date(request.reviewedAt).toLocaleDateString()}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-shrink-0">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(request.status)}
                                <Badge 
                                  variant={request.status === 'pending' ? 'secondary' : 
                                          request.status === 'approved' ? 'default' : 'destructive'}
                                >
                                  {request.status}
                                </Badge>
                              </div>
                              {request.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleApproveRequest(request.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleRejectRequest(request.id)}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Role Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(roleStats).map(([role, count]) => (
                        <div key={role} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getRoleIcon(role as UserRole)}
                            <span>{ROLE_DISPLAY_INFO[role as UserRole].name}</span>
                          </div>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Request Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          <span>Pending</span>
                        </div>
                        <Badge variant="outline">
                          {roleRequests.filter(r => r.status === 'pending').length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Approved</span>
                        </div>
                        <Badge variant="outline">
                          {roleRequests.filter(r => r.status === 'approved').length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span>Rejected</span>
                        </div>
                        <Badge variant="outline">
                          {roleRequests.filter(r => r.status === 'denied' || r.status === 'rejected').length}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}