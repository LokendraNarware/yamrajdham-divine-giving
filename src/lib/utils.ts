import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

/**
 * Generate a receipt number for donations
 * @param donationId The donation ID (UUID)
 * @param existingReceiptNumber Optional existing receipt number from database
 * @returns Formatted receipt number with YD- prefix
 */
export function generateReceiptNumber(donationId: string, existingReceiptNumber?: string | null): string {
  if (existingReceiptNumber) {
    return existingReceiptNumber;
  }
  return `YD-${donationId.slice(-8).toUpperCase()}`;
}