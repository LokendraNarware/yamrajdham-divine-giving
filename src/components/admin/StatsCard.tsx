"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrencyClean } from "@/lib/currency-utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  icon: LucideIcon;
  color: 'green' | 'blue' | 'purple' | 'orange';
  description?: string;
  isCurrency?: boolean;
}

const colorClasses = {
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    value: 'text-green-700',
    trend: 'text-green-600'
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    value: 'text-blue-700',
    trend: 'text-blue-600'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'text-purple-600',
    value: 'text-purple-700',
    trend: 'text-purple-600'
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: 'text-orange-600',
    value: 'text-orange-700',
    trend: 'text-orange-600'
  }
};

export default function StatsCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon: Icon, 
  color,
  description,
  isCurrency = false
}: StatsCardProps) {
  const colors = colorClasses[color];
  
  const formatValue = (val: string | number) => {
    if (isCurrency && typeof val === 'number') {
      // Use clean currency formatting without .00 decimals
      return formatCurrencyClean(val);
    }
    return val;
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${colors.bg} ${colors.border}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <Icon className={`h-4 w-4 ${colors.icon}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${colors.value}`}>
          {formatValue(value)}
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {subtitle}
        </p>
        
        {trend && (
          <div className="flex items-center mt-2">
            {trend.isPositive ? (
              <TrendingUp className={`h-3 w-3 ${colors.trend} mr-1`} />
            ) : (
              <TrendingDown className={`h-3 w-3 text-red-500 mr-1`} />
            )}
            <span className={`text-xs font-medium ${
              trend.isPositive ? colors.trend : 'text-red-500'
            }`}>
              {trend.isPositive ? '+' : ''}{trend.value}% vs {trend.period}
            </span>
          </div>
        )}
        
        {description && (
          <p className="text-xs text-gray-500 mt-2">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}