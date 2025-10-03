"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateFilterProps {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  className?: string;
}

const PRESET_RANGES = [
  { label: "Today", value: "today" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 3 months", value: "3m" },
  { label: "Last 6 months", value: "6m" },
  { label: "Last year", value: "1y" },
  { label: "All time", value: "all" },
  { label: "Custom Range", value: "custom" },
];

export default function DateFilter({ onDateRangeChange, className = "" }: DateFilterProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [selectedPreset, setSelectedPreset] = useState<string>("today");
  const [isCustomRange, setIsCustomRange] = useState(false);

  // Initialize with today's data on component mount
  useEffect(() => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const newRange = { startDate, endDate: now };
    setDateRange(newRange);
    onDateRangeChange(startDate, now);
  }, [onDateRangeChange]);

  const handlePresetChange = (preset: string) => {
    console.log('DateFilter: Changing preset to:', preset);
    setSelectedPreset(preset);
    
    if (preset === "custom") {
      setIsCustomRange(true);
      return;
    }
    
    setIsCustomRange(false);
    
    if (preset === "all") {
      console.log('DateFilter: Setting to all time');
      setDateRange({ startDate: null, endDate: null });
      onDateRangeChange(null, null);
      return;
    }

    const now = new Date();
    let startDate: Date;

    switch (preset) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "3m":
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case "6m":
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case "1y":
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    const newRange = { startDate, endDate: now };
    console.log('DateFilter: Setting date range:', { startDate, endDate: now });
    setDateRange(newRange);
    onDateRangeChange(startDate, now);
  };

  const handleCustomDateChange = (startDate: Date | null, endDate: Date | null) => {
    setDateRange({ startDate, endDate });
    setIsCustomRange(true);
    setSelectedPreset("");
    onDateRangeChange(startDate, endDate);
  };

  const clearFilter = () => {
    setDateRange({ startDate: null, endDate: null });
    setSelectedPreset("today");
    setIsCustomRange(false);
    onDateRangeChange(null, null);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Select value={selectedPreset} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Today" />
        </SelectTrigger>
        <SelectContent>
          {PRESET_RANGES.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isCustomRange && (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-32 justify-start text-left font-normal"
              >
                📅 {dateRange.startDate ? format(dateRange.startDate, "MMM dd") : "Start"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={dateRange.startDate || undefined}
                onSelect={(date) => handleCustomDateChange(date, dateRange.endDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-32 justify-start text-left font-normal"
              >
                📅 {dateRange.endDate ? format(dateRange.endDate, "MMM dd") : "End"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={dateRange.endDate || undefined}
                onSelect={(date) => handleCustomDateChange(dateRange.startDate, date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </>
      )}

      {(dateRange.startDate || dateRange.endDate || selectedPreset !== "today") && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilter}
          className="h-8 w-8 p-0"
        >
          ✕
        </Button>
      )}
    </div>
  );
}