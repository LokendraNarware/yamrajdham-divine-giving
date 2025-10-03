"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, TrendingUp, Download, Settings, Mail, BarChart3 } from "lucide-react";

interface QuickActionsProps {
  onManageDonations?: () => void;
  onManageUsers?: () => void;
  onViewAnalytics?: () => void;
  onGenerateReport?: () => void;
  onSendUpdates?: () => void;
  onPaymentSettings?: () => void;
}

export default function QuickActions({
  onManageDonations,
  onManageUsers,
  onViewAnalytics,
  onGenerateReport,
  onSendUpdates,
  onPaymentSettings
}: QuickActionsProps) {
  const actions = [
    {
      icon: BarChart3,
      label: "View Analytics",
      description: "Detailed donation insights",
      onClick: onViewAnalytics,
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100"
    },
    {
      icon: Download,
      label: "Generate Report",
      description: "Export donation data",
      onClick: onGenerateReport,
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100"
    },
    {
      icon: Mail,
      label: "Send Updates",
      description: "Notify donors",
      onClick: onSendUpdates,
      color: "text-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100"
    },
    {
      icon: Settings,
      label: "Payment Settings",
      description: "Configure gateway",
      onClick: onPaymentSettings,
      color: "text-orange-600",
      bgColor: "bg-orange-50 hover:bg-orange-100"
    }
  ];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          🚀 Quick Actions
        </CardTitle>
        <p className="text-sm text-gray-600">
          Common admin tasks
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`w-full justify-start p-4 h-auto ${action.bgColor} transition-colors`}
              onClick={action.onClick}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${action.bgColor}`}>
                  <action.icon className={`h-4 w-4 ${action.color}`} />
                </div>
                <div className="text-left">
                  <div className={`font-medium ${action.color}`}>
                    {action.label}
                  </div>
                  <div className="text-xs text-gray-600">
                    {action.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={onManageDonations}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Donations
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={onManageUsers}
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
