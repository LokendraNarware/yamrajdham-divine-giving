"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Search,
  FileText,
  Mail,
  Printer,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";

interface Donation {
  id: string;
  user_id: string;
  amount: number;
  donation_type: string;
  payment_status: string;
  payment_id: string;
  payment_gateway: string;
  receipt_number: string;
  is_anonymous: boolean;
  dedication_message: string;
  preacher_name: string;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    email: string;
    mobile: string;
  };
}

interface DashboardStats {
  completedDonations: number;
  pendingDonations: number;
  totalAmount: number;
  averageDonation: number;
  thisMonthDonations: number;
  highValueDonations: number; // ₹50,000+
  mediumValueDonations: number; // ₹10,000+
  lowValueDonations: number; // ₹1,000+
  smallValueDonations: number; // ₹500+
}

export default function DonationsManagement() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    completedDonations: 0,
    pendingDonations: 0,
    totalAmount: 0,
    averageDonation: 0,
    thisMonthDonations: 0,
    highValueDonations: 0,
    mediumValueDonations: 0,
    lowValueDonations: 0,
    smallValueDonations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [amountRange, setAmountRange] = useState("all");
  const [donationType, setDonationType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  // Fetch donations on component mount
  useEffect(() => {
    if (user) {
      fetchDonations();
    }
  }, [user]);

  // Apply filters when search/filter state changes
  useEffect(() => {
    applyFilters();
  }, [donations, searchTerm, dateRange, amountRange, donationType]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      
      // Fetch ONLY completed donations with user data
      const { data: donationsData, error } = await supabase
        .from('user_donations')
        .select(`
          *,
          user:users(name, email, mobile)
        `)
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setDonations(donationsData || []);
      await calculateStats(donationsData || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast({
        title: "Error",
        description: "Failed to load donations.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const calculateStats = async (donationsData: Donation[]) => {
    // All donations are already completed due to the filter in fetchDonations
    const completedDonations = donationsData;
    
    // Fetch pending donations count
    const { count: pendingCount } = await supabase
      .from('user_donations')
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'pending');
    
    const totalAmount = completedDonations.reduce((sum, d) => sum + d.amount, 0);
    const averageDonation = completedDonations.length > 0 ? totalAmount / completedDonations.length : 0;
    
    // This month's donations
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthDonations = completedDonations.filter(d => {
      const donationDate = new Date(d.created_at);
      return donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear;
    }).length;
    
    // Amount range breakdowns
    const highValueDonations = completedDonations.filter(d => d.amount >= 50000).length;
    const mediumValueDonations = completedDonations.filter(d => d.amount >= 10000 && d.amount < 50000).length;
    const lowValueDonations = completedDonations.filter(d => d.amount >= 1000 && d.amount < 10000).length;
    const smallValueDonations = completedDonations.filter(d => d.amount >= 500 && d.amount < 1000).length;
    
    const stats = {
      completedDonations: completedDonations.length,
      pendingDonations: pendingCount || 0,
      totalAmount: totalAmount,
      averageDonation: averageDonation,
      thisMonthDonations: thisMonthDonations,
      highValueDonations: highValueDonations,
      mediumValueDonations: mediumValueDonations,
      lowValueDonations: lowValueDonations,
      smallValueDonations: smallValueDonations,
    };
    
    setStats(stats);
  };

  const applyFilters = () => {
    let filtered = [...donations];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(donation => 
        donation.receipt_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.user?.mobile?.includes(searchTerm)
      );
    }

    // Date range filter
    if (dateRange !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateRange) {
        case "7days":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "30days":
          filterDate.setDate(now.getDate() - 30);
          break;
        case "90days":
          filterDate.setDate(now.getDate() - 90);
          break;
        case "1year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(donation => 
        new Date(donation.created_at) >= filterDate
      );
    }

    // Amount range filter
    if (amountRange !== "all") {
      switch (amountRange) {
        case "50000+":
          filtered = filtered.filter(donation => donation.amount >= 50000);
          break;
        case "10000-50000":
          filtered = filtered.filter(donation => donation.amount >= 10000 && donation.amount < 50000);
          break;
        case "1000-10000":
          filtered = filtered.filter(donation => donation.amount >= 1000 && donation.amount < 10000);
          break;
        case "500-1000":
          filtered = filtered.filter(donation => donation.amount >= 500 && donation.amount < 1000);
          break;
        case "0-500":
          filtered = filtered.filter(donation => donation.amount < 500);
          break;
      }
    }

    // Donation type filter
    if (donationType !== "all") {
      filtered = filtered.filter(donation => donation.donation_type === donationType);
    }

    setFilteredDonations(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Receipt Number', 'Donor Name', 'Email', 'Mobile', 'Amount', 'Type', 'Date', 'Payment Gateway', 'Dedication Message'].join(','),
      ...filteredDonations.map(donation => [
        donation.receipt_number || `DON-${donation.id.slice(-8).toUpperCase()}`,
        donation.is_anonymous ? 'Anonymous' : (donation.user?.name || 'Unknown'),
        donation.is_anonymous ? 'Hidden' : (donation.user?.email || ''),
        donation.is_anonymous ? 'Hidden' : (donation.user?.mobile || ''),
        donation.amount,
        donation.donation_type,
        new Date(donation.created_at).toLocaleDateString('en-IN'),
        donation.payment_gateway || 'Cashfree',
        donation.dedication_message || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `completed-donations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Completed donations data exported successfully.",
    });
  };

  const handleRefresh = () => {
    fetchDonations();
    toast({
      title: "Refreshed",
      description: "Donations data has been refreshed.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending" },
      completed: { variant: "default" as const, label: "Completed" },
      failed: { variant: "destructive" as const, label: "Failed" },
      refunded: { variant: "outline" as const, label: "Refunded" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };


  // Pagination calculations
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDonations = filteredDonations.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">🏛️ Yamraj Dham Divine Giving - Admin Dashboard</h2>
          <p className="text-gray-600">Donations Management - Manage completed temple donations and track contributions</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">✅ Completed Donations</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedDonations}</div>
              <p className="text-xs text-gray-500">Successfully processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">💰 Total Amount Collected</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(stats.totalAmount)}
              </div>
              <p className="text-xs text-gray-500">From completed donations only</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">📊 Average Donation</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(stats.averageDonation)}
              </div>
              <p className="text-xs text-gray-500">Per donation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">📅 This Month</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.thisMonthDonations}</div>
              <p className="text-xs text-gray-500">Completed donations</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Summary */}
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">📈 Donation Summary (Completed Payments Only)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-red-600">₹50,000+</div>
                <div className="text-xs text-gray-600">Donations</div>
                <div className="text-lg font-bold text-red-600">{stats.highValueDonations}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-orange-600">₹10,000+</div>
                <div className="text-xs text-gray-600">Donations</div>
                <div className="text-lg font-bold text-orange-600">{stats.mediumValueDonations}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-blue-600">₹1,000+</div>
                <div className="text-xs text-gray-600">Donations</div>
                <div className="text-lg font-bold text-blue-600">{stats.lowValueDonations}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-green-600">₹500+</div>
                <div className="text-xs text-gray-600">Donations</div>
                <div className="text-lg font-bold text-green-600">{stats.smallValueDonations}</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-600 text-center">
              <p>💡 All calculations based on completed payments only</p>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              🔍 Search & Filter Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by receipt number, donor name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleRefresh} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={handleExportCSV} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">📅 Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">💰 Amount Range</label>
                <Select value={amountRange} onValueChange={setAmountRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select amount range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Amounts</SelectItem>
                    <SelectItem value="50000+">₹50,000+</SelectItem>
                    <SelectItem value="10000-50000">₹10,000 - ₹50,000</SelectItem>
                    <SelectItem value="1000-10000">₹1,000 - ₹10,000</SelectItem>
                    <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                    <SelectItem value="0-500">Under ₹500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">📋 Donation Type</label>
                <Select value={donationType} onValueChange={setDonationType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select donation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="temple_construction">Temple Construction</SelectItem>
                    <SelectItem value="seva">Seva</SelectItem>
                    <SelectItem value="festival">Festival</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Donations Table */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Completed Donations ({filteredDonations.length} total)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading completed donations...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Receipt Number</TableHead>
                        <TableHead>Donor Info</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedDonations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="text-gray-500">
                              <Search className="w-8 h-8 mx-auto mb-2" />
                              <p>No completed donations found</p>
                              <p className="text-sm">Try adjusting your search or filters</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedDonations.map((donation) => (
                          <TableRow 
                            key={donation.id}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => setSelectedDonation(donation)}
                          >
                            <TableCell>
                              <span className="font-mono text-sm">
                                {donation.receipt_number || `DON-${donation.id.slice(-8).toUpperCase()}`}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {donation.is_anonymous ? 'Anonymous' : (donation.user?.name || 'Unknown')}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {donation.is_anonymous ? '' : (donation.user?.email || '')}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold text-green-600">
                                {formatCurrency(donation.amount)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {donation.donation_type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-600">
                                {formatDate(donation.created_at)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDonation(donation);
                                }}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-500">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDonations.length)} of {filteredDonations.length} completed donations
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Donation Details Modal */}
        {selectedDonation && (
          <Dialog open={!!selectedDonation} onOpenChange={() => setSelectedDonation(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>📄 Donation Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Receipt Information */}
                <Card>
            <CardHeader>
                    <CardTitle className="text-lg">Receipt Information</CardTitle>
            </CardHeader>
                  <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                        <label className="text-sm font-medium text-gray-600">Receipt #</label>
                  <p className="text-lg font-mono">
                    {selectedDonation.receipt_number || `DON-${selectedDonation.id.slice(-8).toUpperCase()}`}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Amount</label>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(selectedDonation.amount)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedDonation.payment_status)}</div>
                </div>
                <div>
                        <label className="text-sm font-medium text-gray-600">Payment Gateway</label>
                        <p>{selectedDonation.payment_gateway || 'Cashfree'}</p>
                      </div>
                </div>
                  </CardContent>
                </Card>

                {/* Donor Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Donor Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                <div>
                        <label className="text-sm font-medium text-gray-600">Name</label>
                  <p>{selectedDonation.is_anonymous ? 'Anonymous' : (selectedDonation.user?.name || 'Unknown')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p>{selectedDonation.is_anonymous ? 'Hidden' : (selectedDonation.user?.email || 'N/A')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Mobile</label>
                  <p>{selectedDonation.is_anonymous ? 'Hidden' : (selectedDonation.user?.mobile || 'N/A')}</p>
                </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Anonymous</label>
                        <p>{selectedDonation.is_anonymous ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Donation Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Donation Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Type</label>
                        <p className="capitalize">{selectedDonation.donation_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date</label>
                  <p>{formatDate(selectedDonation.created_at)}</p>
                </div>
              </div>
              
              {selectedDonation.dedication_message && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Dedication Message</label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">
                    {selectedDonation.dedication_message}
                  </p>
                </div>
              )}

              {selectedDonation.preacher_name && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Preacher Name</label>
                  <p>{selectedDonation.preacher_name}</p>
                </div>
              )}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm">
                    <Printer className="w-4 h-4 mr-2" />
                    Print Receipt
                    </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Receipt
                    </Button>
                <Button 
                  onClick={() => setSelectedDonation(null)}
                  variant="outline"
                    size="sm"
                >
                  Close
                </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
}
