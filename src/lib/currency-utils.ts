/**
 * Currency formatting utilities for the admin dashboard
 * Removes .00 decimals from whole numbers for cleaner display
 * Version: 2.0 - Fixed decimal removal
 */

/**
 * Formats a number as Indian Rupee currency without .00 decimals for whole numbers
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "₹1,000" instead of "₹1,000.00")
 */
export const formatCurrencyClean = (amount: number): string => {
  // Use Intl.NumberFormat for proper Indian number formatting
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  // Remove .00 from whole numbers for cleaner display
  const result = formatted.replace(/\.00$/, '');
  console.log(`formatCurrencyClean: ${amount} -> ${formatted} -> ${result}`);
  return result;
};

/**
 * Formats a number as Indian Rupee currency with .00 decimals (original behavior)
 * @param amount - The amount to format
 * @returns Formatted currency string with decimals (e.g., "₹1,000.00")
 */
export const formatCurrencyWithDecimals = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};
