# Admin Donations Page Redesign Wireframe

## Overview
This wireframe outlines the redesigned admin donations page (`/admin/donations`) that focuses exclusively on **completed payments** for accurate financial reporting and donation management.

## Page Structure

### 1. Page Header Section
```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ Yamraj Dham Divine Giving - Admin Dashboard                │
│  Donations Management                                           │
│  Manage completed temple donations and track contributions     │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Key Metrics Cards (Top Row)
```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ ✅ Completed    │ │ 💰 Total Amount │ │ 📊 Avg Donation │ │ 📅 This Month   │
│ Donations       │ │ Collected       │ │ Amount          │ │ Donations       │
│                 │ │                 │ │                 │ │                 │
│ 1,247           │ │ ₹2,45,680       │ │ ₹197            │ │ 89              │
│ Successfully    │ │ From completed  │ │ Per donation    │ │ Completed       │
│ processed       │ │ donations only  │ │                 │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 3. Quick Stats Summary (Second Row)
```
┌─────────────────────────────────────────────────────────────────┐
│ 📈 Donation Summary (Completed Payments Only)                  │
│                                                                 │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│ │ ₹50,000+    │ │ ₹10,000+    │ │ ₹1,000+     │ │ ₹500+       ││
│ │ Donations   │ │ Donations   │ │ Donations   │ │ Donations   ││
│ │ 23          │ │ 156         │ │ 445         │ │ 623         ││
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
│                                                                 │
│ 💡 All calculations based on completed payments only           │
└─────────────────────────────────────────────────────────────────┘
```

### 4. Filters and Search Section
```
┌─────────────────────────────────────────────────────────────────┐
│ 🔍 Search & Filter Controls                                     │
│                                                                 │
│ [🔍 Search by receipt number, donor name, or email...    ]     │
│ [📅 Date Range: [From] to [To]                    ] [Apply]    │
│ [💰 Amount Range: [Min] to [Max]                   ] [Apply]    │
│ [📋 Donation Type: [All Types ▼]                   ] [Apply]    │
│                                                                 │
│ [🔄 Refresh] [📊 Export CSV] [📄 Export PDF] [⚙️ Settings]      │
└─────────────────────────────────────────────────────────────────┘
```

### 5. Main Donations Table
```
┌─────────────────────────────────────────────────────────────────┐
│ 📋 Completed Donations (1,247 total)                           │
│                                                                 │
│ ┌─────┬─────────────┬─────────────┬─────────────┬─────────────┬─┐│
│ │Receipt│ Donor Info    │ Amount      │ Type        │ Date        ││
│ │Number │               │             │             │             ││
│ ├─────┼─────────────┼─────────────┼─────────────┼─────────────┼─┤│
│ │DON-  │ John Doe      │ ₹2,500      │ General     │ 15 Jan 2024 ││
│ │ABC123│ john@email.com│             │             │ 10:30 AM   ││
│ ├─────┼─────────────┼─────────────┼─────────────┼─────────────┼─┤│
│ │DON-  │ Anonymous     │ ₹1,000      │ Temple      │ 15 Jan 2024 ││
│ │DEF456│               │             │ Construction│ 09:15 AM   ││
│ ├─────┼─────────────┼─────────────┼─────────────┼─────────────┼─┤│
│ │DON-  │ Jane Smith    │ ₹5,000      │ Seva        │ 14 Jan 2024││
│ │GHI789│ jane@email.com│             │             │ 16:45 PM   ││
│ └─────┴─────────────┴─────────────┴─────────────┴─────────────┴─┘│
│                                                                 │
│ [◀ Previous] Page 1 of 125 [Next ▶]                            │
│ Showing 1-10 of 1,247 completed donations                      │
└─────────────────────────────────────────────────────────────────┘
```

### 6. Donation Details Modal (On Row Click)
```
┌─────────────────────────────────────────────────────────────────┐
│ 📄 Donation Details                                    [✕ Close]│
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Receipt Information                                         │ │
│ │ Receipt #: DON-ABC123456789                                 │ │
│ │ Amount: ₹2,500                                             │ │
│ │ Status: ✅ Completed                                        │ │
│ │ Payment Gateway: Cashfree                                   │ │
│ │ Payment ID: CF123456789                                     │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Donor Information                                           │ │
│ │ Name: John Doe                                              │ │
│ │ Email: john.doe@email.com                                   │ │
│ │ Mobile: +91 98765 43210                                     │ │
│ │ Anonymous: No                                               │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Donation Details                                            │ │
│ │ Type: General Donation                                      │ │
│ │ Date: 15 January 2024, 10:30 AM                            │ │
│ │ Dedication Message: "For the temple construction"           │ │
│ │ Preacher Name: Swami Ji                                     │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ [📄 Print Receipt] [📧 Email Receipt] [🔄 Refresh Status]      │
└─────────────────────────────────────────────────────────────────┘
```

## Key Features & Functionality

### 1. **Completed Payments Focus**
- All calculations, totals, and statistics based ONLY on completed payments
- Clear indication that pending/failed/refunded donations are excluded from totals
- Visual badges showing completion status

### 2. **Enhanced Search & Filtering**
- Search by receipt number, donor name, email, or mobile
- Date range filtering (last 7 days, 30 days, 90 days, custom range)
- Amount range filtering (₹0-500, ₹500-1000, ₹1000-5000, ₹5000+)
- Donation type filtering (General, Temple Construction, Seva, etc.)
- Real-time search with debounced input

### 3. **Comprehensive Data Display**
- Receipt number with easy copy functionality
- Donor information with privacy controls for anonymous donations
- Amount in Indian Rupees with proper formatting
- Donation type with color-coded badges
- Date/time with timezone information
- Payment gateway information

### 4. **Export & Reporting**
- CSV export with all completed donation data
- PDF export for official records
- Custom date range exports
- Receipt generation for individual donations

### 5. **Responsive Design**
- Mobile-friendly table with horizontal scroll
- Collapsible columns on smaller screens
- Touch-friendly buttons and interactions
- Optimized for tablet and desktop viewing

## Data Structure Requirements

### Completed Donations Query
```sql
SELECT 
  id,
  receipt_number,
  amount,
  donation_type,
  payment_status,
  payment_id,
  payment_gateway,
  is_anonymous,
  dedication_message,
  preacher_name,
  created_at,
  updated_at,
  user:users(name, email, mobile)
FROM user_donations 
WHERE payment_status = 'completed'
ORDER BY created_at DESC;
```

### Key Metrics Calculation
```javascript
const completedDonations = donations.filter(d => d.payment_status === 'completed');
const totalAmount = completedDonations.reduce((sum, d) => sum + d.amount, 0);
const averageDonation = totalAmount / completedDonations.length;
const thisMonthDonations = completedDonations.filter(d => 
  new Date(d.created_at).getMonth() === new Date().getMonth()
);
```

## User Experience Improvements

### 1. **Visual Hierarchy**
- Clear section separation with cards and borders
- Color coding for different donation types
- Status indicators with appropriate colors
- Progress indicators for loading states

### 2. **Performance Optimizations**
- Pagination for large datasets (10-20 items per page)
- Lazy loading for donation details
- Cached calculations for metrics
- Debounced search input

### 3. **Accessibility**
- Keyboard navigation support
- Screen reader friendly labels
- High contrast color schemes
- Focus indicators for interactive elements

### 4. **Error Handling**
- Graceful error messages for failed operations
- Retry mechanisms for network issues
- Loading states for all async operations
- Validation feedback for user inputs

## Implementation Priority

### Phase 1: Core Functionality
1. ✅ Completed payments filtering
2. ✅ Basic table display
3. ✅ Search functionality
4. ✅ Export capabilities

### Phase 2: Enhanced Features
1. 📅 Date range filtering
2. 💰 Amount range filtering
3. 📊 Advanced metrics
4. 📱 Mobile responsiveness

### Phase 3: Advanced Features
1. 📄 PDF receipt generation
2. 📧 Email functionality
3. 🔄 Real-time updates
4. 📈 Analytics integration

## Technical Considerations

### 1. **Database Optimization**
- Index on `payment_status` and `created_at`
- Efficient queries for large datasets
- Caching for frequently accessed data

### 2. **State Management**
- React Query for data fetching and caching
- Local state for UI interactions
- Optimistic updates for better UX

### 3. **Security**
- Admin role verification
- Data sanitization for exports
- Secure receipt generation

This wireframe provides a comprehensive foundation for redesigning the admin donations page with a clear focus on completed payments, improved user experience, and enhanced functionality for temple donation management.
