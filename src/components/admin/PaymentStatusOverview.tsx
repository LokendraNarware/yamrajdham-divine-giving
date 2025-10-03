"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, RotateCcw } from "lucide-react";

interface PaymentStatusOverviewProps {
  completed: number;
  pending: number;
  failed: number;
  refunded: number;
  isLoading?: boolean;
}

export default function PaymentStatusOverview({ 
  completed, 
  pending, 
  failed, 
  refunded,
  isLoading 
}: PaymentStatusOverviewProps) {
  const total = completed + pending + failed + refunded;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getCompletionRateBadge = (rate: number) => {
    if (rate >= 90) return "bg-green-100 text-green-800";
    if (rate >= 75) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getInsightMessage = (rate: number) => {
    if (rate >= 90) return "Excellent completion rate! Above industry average (75%)";
    if (rate >= 75) return "Good completion rate, close to industry average (75%)";
    return "Completion rate below industry average (75%). Consider reviewing payment process.";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            📈 Payment Status Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
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
          📈 Payment Status Breakdown
        </CardTitle>
        <p className="text-sm text-gray-600">
          Overview of all donation payment statuses
        </p>
      </CardHeader>
      <CardContent>
        {/* Completion Rate Highlight */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">Completion Rate</h3>
            <Badge className={getCompletionRateBadge(completionRate)}>
              {completionRate}%
            </Badge>
          </div>
          <p className={`text-sm font-medium ${getCompletionRateColor(completionRate)}`}>
            {getInsightMessage(completionRate)}
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">{completed}</div>
            <div className="text-sm text-green-600">Completed</div>
            <div className="text-xs text-gray-500 mt-1">
              {total > 0 ? Math.round((completed / total) * 100) : 0}% of total
            </div>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-700">{pending}</div>
            <div className="text-sm text-yellow-600">Pending</div>
            <div className="text-xs text-gray-500 mt-1">
              {total > 0 ? Math.round((pending / total) * 100) : 0}% of total
            </div>
          </div>

          <div className="text-center p-4 bg-red-50 rounded-lg">
            <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-700">{failed}</div>
            <div className="text-sm text-red-600">Failed</div>
            <div className="text-xs text-gray-500 mt-1">
              {total > 0 ? Math.round((failed / total) * 100) : 0}% of total
            </div>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <RotateCcw className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{refunded}</div>
            <div className="text-sm text-blue-600">Refunded</div>
            <div className="text-xs text-gray-500 mt-1">
              {total > 0 ? Math.round((refunded / total) * 100) : 0}% of total
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Transactions:</span>
            <span className="font-medium text-gray-900">{total}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600">Successful Rate:</span>
            <span className={`font-medium ${getCompletionRateColor(completionRate)}`}>
              {completionRate}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
