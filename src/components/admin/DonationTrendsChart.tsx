"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subMonths, startOfMonth } from 'date-fns';

interface DonationTrendsChartProps {
  data: Array<{
    month: string;
    amount: number;
    donations: number;
    donors: number;
  }>;
  isLoading?: boolean;
}

export default function DonationTrendsChart({ data, isLoading }: DonationTrendsChartProps) {
  // Generate last 6 months if no data provided
  const generateDefaultData = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      months.push({
        month: format(date, 'MMM'),
        amount: 0,
        donations: 0,
        donors: 0
      });
    }
    return months;
  };

  const chartData = data && data.length > 0 ? data : generateDefaultData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-green-600">
            Amount: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-blue-600">
            Donations: {payload[1].value}
          </p>
          <p className="text-purple-600">
            Donors: {payload[2].value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            📊 Donation Trends (Last 6 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          📊 Donation Trends (Last 6 Months)
        </CardTitle>
        <p className="text-sm text-gray-600">
          Showing completed donations only
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                yAxisId="amount"
                orientation="left"
                stroke="#10b981"
                fontSize={12}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <YAxis 
                yAxisId="donations"
                orientation="right"
                stroke="#3b82f6"
                fontSize={12}
              />
              <YAxis 
                yAxisId="donors"
                orientation="right"
                stroke="#8b5cf6"
                fontSize={12}
                offset={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                yAxisId="amount"
                type="monotone"
                dataKey="amount"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
              <Line
                yAxisId="donations"
                type="monotone"
                dataKey="donations"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <Line
                yAxisId="donors"
                type="monotone"
                dataKey="donors"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: '#8b5cf6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Amount Raised</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Number of Donations</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Number of Donors</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
