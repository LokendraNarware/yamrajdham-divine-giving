"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, RefreshCw } from "lucide-react";

interface RecentDonation {
  id: string;
  amount: number;
  donor_name: string;
  donation_type: string;
  created_at: string;
  is_anonymous: boolean;
}

interface RecentDonationsFeedProps {
  donations: RecentDonation[];
  isLoading?: boolean;
  onViewAll?: () => void;
  onRefresh?: () => void;
}

export default function RecentDonationsFeed({ 
  donations, 
  isLoading, 
  onViewAll,
  onRefresh 
}: RecentDonationsFeedProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const getDonationTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'Temple Construction': '🏗️',
      'Shree Krishna Seva': '🌸',
      'Dharma Shala': '🏠',
      'Library & Education': '📚',
      'Golden Kalash': '👑',
      'Maha Donation': '💎',
      'default': '🙏'
    };
    return icons[type] || icons.default;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            ⚡ Recent Completed Donations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-32 mt-1"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!donations || donations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            ⚡ Recent Completed Donations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">💝</div>
            <p>No recent donations</p>
            <p className="text-sm">Completed donations will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">
            ⚡ Recent Completed Donations
          </CardTitle>
          <p className="text-sm text-gray-600">
            Latest successful donations
          </p>
        </div>
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            className="text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {donations.slice(0, 5).map((donation) => (
            <div 
              key={donation.id} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {getDonationTypeIcon(donation.donation_type)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {formatCurrency(donation.amount)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {donation.is_anonymous ? 'Anonymous' : donation.donor_name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">
                  {donation.donation_type}
                </div>
                <div className="text-xs text-gray-500">
                  {formatTimeAgo(donation.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {donations.length > 5 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full"
              onClick={onViewAll}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View All Donations ({donations.length})
            </Button>
          </div>
        )}
        
        {donations.length <= 5 && onViewAll && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full"
              onClick={onViewAll}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View All Donations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
