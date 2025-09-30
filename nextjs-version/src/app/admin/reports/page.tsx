"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FileText, Download, Calendar as CalendarIcon, Filter, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [format, setFormat] = useState("pdf");

  const reportTypes = [
    { value: "donations", label: "Donation Report", description: "Detailed donation transactions" },
    { value: "users", label: "User Report", description: "User activity and statistics" },
    { value: "financial", label: "Financial Summary", description: "Revenue and financial overview" },
    { value: "monthly", label: "Monthly Report", description: "Monthly performance summary" },
    { value: "yearly", label: "Annual Report", description: "Yearly comprehensive report" },
    { value: "tax", label: "Tax Report", description: "Tax-deductible donations report" }
  ];

  const handleGenerateReport = () => {
    console.log("Generating report:", {
      type: reportType,
      startDate,
      endDate,
      format
    });
    // Generate report logic here
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
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
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
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
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
            <Button onClick={handleGenerateReport} disabled={!reportType}>
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

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
