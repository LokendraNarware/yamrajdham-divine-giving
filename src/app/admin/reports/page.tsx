"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FileText, Download, Calendar as CalendarIcon, Filter, BarChart3, Loader2 } from "lucide-react";
import { format as formatDate } from "date-fns";
import { cn } from "@/lib/utils";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ReportData {
  donations: any[];
  users: any[];
  totalRevenue: number;
  totalDonations: number;
  totalUsers: number;
  averageDonation: number;
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [format, setFormat] = useState("pdf");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const reportTypes = [
    { value: "donations", label: "Donation Report", description: "Detailed completed donation transactions" },
    { value: "users", label: "User Report", description: "User activity and donation statistics" },
    { value: "financial", label: "Financial Summary", description: "Revenue and financial overview from completed donations" },
    { value: "monthly", label: "Monthly Report", description: "Monthly performance summary" },
    { value: "yearly", label: "Annual Report", description: "Yearly comprehensive report" },
    { value: "tax", label: "Tax Report", description: "Tax-deductible donations report" }
  ];

  const fetchReportData = async () => {
    try {
      setIsGenerating(true);

      // Build date filter
      let dateFilter = supabase.from('user_donations').select('*');
      if (startDate) {
        dateFilter = dateFilter.gte('created_at', startDate.toISOString());
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        dateFilter = dateFilter.lte('created_at', endDateTime.toISOString());
      }

      // Fetch completed donations with user data
      const { data: donationsData, error: donationsError } = await dateFilter
        .eq('payment_status', 'completed')
        .select(`
          *,
          user:users(name, email, mobile)
        `)
        .order('created_at', { ascending: false });

      if (donationsError) {
        throw donationsError;
      }

      // Fetch users data
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) {
        throw usersError;
      }

      // Calculate statistics
      const donations = donationsData || [];
      const users = usersData || [];
      const totalRevenue = donations.reduce((sum: number, d: any) => sum + d.amount, 0);
      const totalDonations = donations.length;
      const totalUsers = users.length;
      const averageDonation = totalDonations > 0 ? totalRevenue / totalDonations : 0;

      setReportData({
        donations,
        users,
        totalRevenue,
        totalDonations,
        totalUsers,
        averageDonation,
      });

      setIsGenerating(false);
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch report data.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!reportType) {
      toast({
        title: "Error",
        description: "Please select a report type.",
        variant: "destructive",
      });
      return;
    }

    await fetchReportData();
    
    if (reportData) {
      generateReportFile();
    }
  };

  const generateReportFile = () => {
    if (!reportData) return;

    let csvContent = '';
    let filename = '';

    switch (reportType) {
      case 'donations':
        csvContent = generateDonationsReport();
        filename = `donations-report-${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'users':
        csvContent = generateUsersReport();
        filename = `users-report-${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'financial':
        csvContent = generateFinancialReport();
        filename = `financial-summary-${new Date().toISOString().split('T')[0]}.csv`;
        break;
      default:
        csvContent = generateGeneralReport();
        filename = `report-${reportType}-${new Date().toISOString().split('T')[0]}.csv`;
    }

    downloadCSV(csvContent, filename);
    
    toast({
      title: "Success",
      description: `${reportTypes.find(r => r.value === reportType)?.label} generated successfully.`,
    });
  };

  const generateDonationsReport = () => {
    if (!reportData) return '';
    
    const headers = ['Receipt Number', 'Donor Name', 'Email', 'Mobile', 'Amount', 'Donation Type', 'Date', 'Dedication Message'];
    const rows = reportData.donations.map(donation => [
      donation.receipt_number || `DON-${donation.id.slice(-8).toUpperCase()}`,
      donation.is_anonymous ? 'Anonymous' : (donation.user?.name || 'Unknown'),
      donation.is_anonymous ? 'Hidden' : (donation.user?.email || ''),
      donation.is_anonymous ? 'Hidden' : (donation.user?.mobile || ''),
      donation.amount,
      donation.donation_type,
      new Date(donation.created_at).toLocaleDateString('en-IN'),
      donation.dedication_message || ''
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateUsersReport = () => {
    if (!reportData) return '';
    
    const headers = ['Name', 'Email', 'Mobile', 'City', 'State', 'Join Date', 'Total Donations', 'Total Amount'];
    const rows = reportData.users.map(user => {
      const userDonations = reportData.donations.filter(d => d.user_id === user.id);
      const totalDonations = userDonations.length;
      const totalAmount = userDonations.reduce((sum, d) => sum + d.amount, 0);
      
      return [
        user.name,
        user.email,
        user.mobile,
        user.city || '',
        user.state || '',
        new Date(user.created_at).toLocaleDateString('en-IN'),
        totalDonations,
        totalAmount
      ];
    });
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateFinancialReport = () => {
    if (!reportData) return '';
    
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Revenue', reportData.totalRevenue],
      ['Total Completed Donations', reportData.totalDonations],
      ['Total Users', reportData.totalUsers],
      ['Average Donation Amount', reportData.averageDonation],
      ['Report Generated', new Date().toLocaleDateString('en-IN')]
    ];
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateGeneralReport = () => {
    if (!reportData) return '';
    
    const headers = ['Summary'];
    const rows = [
      [`Report Type: ${reportTypes.find(r => r.value === reportType)?.label}`],
      [`Total Revenue: ₹${reportData.totalRevenue.toLocaleString()}`],
      [`Total Completed Donations: ${reportData.totalDonations}`],
      [`Total Users: ${reportData.totalUsers}`],
      [`Average Donation: ₹${reportData.averageDonation.toLocaleString()}`],
      [`Generated: ${new Date().toLocaleDateString('en-IN')}`]
    ];
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
            <p className="text-gray-600">Generate and download detailed reports</p>
          </div>
        </div>

      {/* Report Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generate Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((type) => (
              <div
                key={type.value}
                className={cn(
                  "p-4 border rounded-lg cursor-pointer transition-colors",
                  reportType === type.value
                    ? "border-temple-gold bg-temple-cream"
                    : "border-gray-200 hover:border-temple-gold/50"
                )}
                onClick={() => setReportType(type.value)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    reportType === type.value ? "bg-temple-gold" : "bg-gray-100"
                  )}>
                    <BarChart3 className={cn(
                      "w-4 h-4",
                      reportType === type.value ? "text-white" : "text-gray-600"
                    )} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{type.label}</h3>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Date Range Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? formatDate(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? formatDate(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Export Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleGenerateReport} 
              disabled={!reportType || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      {reportData && (
        <Card>
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(reportData.totalRevenue)}
                </div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {reportData.totalDonations}
                </div>
                <div className="text-sm text-gray-600">Completed Donations</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {reportData.totalUsers}
                </div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(reportData.averageDonation)}
                </div>
                <div className="text-sm text-gray-600">Average Donation</div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p><strong>Report Type:</strong> {reportTypes.find(r => r.value === reportType)?.label}</p>
              <p><strong>Date Range:</strong> {
                startDate && endDate 
                  ? `${formatDate(startDate, 'PPP')} - ${formatDate(endDate, 'PPP')}`
                  : startDate 
                    ? `From ${formatDate(startDate, 'PPP')}`
                    : endDate 
                      ? `Until ${formatDate(endDate, 'PPP')}`
                      : 'All time'
              }</p>
              <p><strong>Generated:</strong> {new Date().toLocaleString('en-IN')}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Monthly Donation Report - January 2024", type: "PDF", size: "2.4 MB", date: "2024-01-31" },
              { name: "User Activity Report", type: "Excel", size: "1.8 MB", date: "2024-01-30" },
              { name: "Financial Summary - Q4 2023", type: "PDF", size: "3.2 MB", date: "2024-01-15" },
              { name: "Tax Report 2023", type: "PDF", size: "4.1 MB", date: "2024-01-01" }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-temple-gold rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-gray-500">{report.type} • {report.size} • {report.date}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </AdminLayout>
  );
}
