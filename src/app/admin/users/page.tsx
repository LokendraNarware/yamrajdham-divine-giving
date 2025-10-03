"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Filter, MoreVertical, Eye, Edit, Trash2, UserCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatCurrencyClean } from "@/lib/currency-utils";

interface User {
  id: string;
  email: string;
  name: string;
  mobile: string;
  address?: string;
  city?: string;
  state?: string;
  pin_code?: string;
  country?: string;
  pan_no?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
  created_at: string;
  updated_at: string;
  donation_count?: number;
  total_donated?: number;
}

interface UserWithStats extends User {
  donation_count: number;
  total_donated: number;
  is_admin?: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch users with ONLY completed donation stats
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          *,
          user_donations!inner(
            id,
            amount,
            payment_status
          )
        `)
        .eq('user_donations.payment_status', 'completed')
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('Error fetching users:', usersError);
        toast({
          title: "Error",
          description: "Failed to load users.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Also fetch users without donations
      const { data: usersWithoutDonations, error: usersWithoutDonationsError } = await supabase
        .from('users')
        .select('*')
        .not('id', 'in', `(${(usersData as Array<{id: string}> || []).map(u => u.id).join(',') || 'null'})`);

      if (usersWithoutDonationsError) {
        console.error('Error fetching users without donations:', usersWithoutDonationsError);
      }

      // Fetch admin users to check roles
      const { data: adminData, error: adminError } = await supabase
        .from('admin')
        .select('email, role');

      if (adminError) {
        console.error('Error fetching admin data:', adminError);
      }

      const adminEmails = new Set((adminData as Array<{email: string}> || []).map(admin => admin.email));

      // Process users with completed donations only
      const usersWithStats: UserWithStats[] = (usersData as any || []).map((user: any) => {
        const donations = user.user_donations || [];
        // All donations here are already completed due to the filter above
        const donationCount = donations.length;
        const totalDonated = donations.reduce((sum: number, d: any) => sum + d.amount, 0);

        return {
          ...user,
          donation_count: donationCount,
          total_donated: totalDonated,
          is_admin: adminEmails.has(user.email),
        };
      }) || [];

      // Add users without donations
      const usersWithoutDonationsStats: UserWithStats[] = (usersWithoutDonations as any || []).map((user: any) => ({
        ...user,
        donation_count: 0,
        total_donated: 0,
        is_admin: adminEmails.has(user.email),
      }));

      // Combine all users
      const allUsers = [...usersWithStats, ...usersWithoutDonationsStats];
      setUsers(allUsers);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user, fetchUsers]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.includes(searchTerm)
  );

  const getStatusBadge = (user: UserWithStats) => {
    const status = user.status || 'active';
    const statusConfig = {
      active: { className: "bg-green-100 text-green-800", label: "Active" },
      inactive: { className: "bg-gray-100 text-gray-800", label: "Inactive" },
      suspended: { className: "bg-red-100 text-red-800", label: "Suspended" },
      pending: { className: "bg-yellow-100 text-yellow-800", label: "Pending" },
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getRoleBadge = (user: UserWithStats) => {
    // Use the is_admin field from database query
    return user.is_admin ? 
      <Badge className="bg-purple-100 text-purple-800">Admin</Badge> :
      <Badge className="bg-blue-100 text-blue-800">User</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return formatCurrencyClean(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "User deleted successfully.",
      });

      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600">Manage users, roles, and permissions</p>
          </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Users className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => (u.status || 'active') === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Users with active status</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donors</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.donation_count > 0).length}</div>
            <p className="text-xs text-muted-foreground">Users with completed donations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.is_admin).length}</div>
            <p className="text-xs text-muted-foreground">Administrators</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading users...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Donations</TableHead>
                  <TableHead>Total Donated</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">{user.mobile}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user)}</TableCell>
                    <TableCell>{getStatusBadge(user)}</TableCell>
                    <TableCell>{user.donation_count}</TableCell>
                    <TableCell>{formatCurrency(user.total_donated)}</TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      </div>
    </AdminLayout>
  );
}
