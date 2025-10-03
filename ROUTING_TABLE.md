# Yamrajdham Divine Giving - Routing Table

## Overview
This document provides a comprehensive overview of all routes and routing patterns used in the Yamrajdham Divine Giving application.

## Route Categories

### 1. Public Routes (No Authentication Required)

| Route | Component | Description | Priority |
|-------|-----------|-------------|----------|
| `/` | `src/app/page.tsx` | Home page with hero section | 1.0 |
| `/about` | `src/app/about/page.tsx` | About us page | 0.8 |
| `/donate` | `src/app/donate/page.tsx` | Donation page | 0.9 |
| `/donate/success` | `src/app/donate/success/page.tsx` | Donation success page | 0.7 |
| `/contact` | `src/app/contact/page.tsx` | Contact page | 0.7 |
| `/gallery` | `src/app/gallery/page.tsx` | Gallery page | 0.6 |
| `/login` | `src/app/login/page.tsx` | Login page | 0.8 |
| `/register` | `src/app/register/page.tsx` | Registration page | 0.8 |
| `/privacy-policy` | `src/app/privacy-policy/page.tsx` | Privacy policy | 0.3 |
| `/terms-conditions` | `src/app/terms-conditions/page.tsx` | Terms and conditions | 0.3 |
| `/refund-policy` | `src/app/refund-policy/page.tsx` | Refund policy | 0.3 |
| `/donation-policy` | `src/app/donation-policy/page.tsx` | Donation policy | 0.3 |
| `/disclaimer` | `src/app/disclaimer/page.tsx` | Disclaimer | 0.3 |
| `/verify-donation` | `src/app/verify-donation/page.tsx` | Donation verification | 0.5 |

### 2. Protected Routes (Authentication Required)

| Route | Component | Description | Access Level |
|-------|-----------|-------------|--------------|
| `/dashboard` | `src/app/dashboard/page.tsx` | User dashboard | Regular Users |
| `/profile` | `src/app/profile/page.tsx` | User profile | Regular Users |

### 3. Admin Routes (Admin Authentication Required)

| Route | Component | Description | Access Level |
|-------|-----------|-------------|--------------|
| `/admin` | `src/app/admin/page.tsx` | Admin dashboard | Admin Only |
| `/admin/donations` | `src/app/admin/donations/page.tsx` | Donations management | Admin Only |
| `/admin/users` | `src/app/admin/users/page.tsx` | User management | Admin Only |
| `/admin/analytics` | `src/app/admin/analytics/page.tsx` | Analytics dashboard | Admin Only |
| `/admin/reports` | `src/app/admin/reports/page.tsx` | Reports generation | Admin Only |
| `/admin/settings/payment` | `src/app/admin/settings/payment/page.tsx` | Payment settings | Admin Only |
| `/create-admin` | `src/app/create-admin/page.tsx` | Create admin account | Super Admin |

### 4. API Routes

| Route | Method | Handler | Description |
|-------|--------|---------|-------------|
| `/api/admin/stats` | GET | `src/app/api/admin/stats/route.ts` | Admin statistics |
| `/api/admin/analytics` | GET | `src/app/api/admin/analytics/route.ts` | Analytics data |
| `/api/admin/recent-donations` | GET | `src/app/api/admin/recent-donations/route.ts` | Recent donations |
| `/api/donations/[id]` | GET | `src/app/api/donations/[id]/route.ts` | Get donation by ID |
| `/api/payment/create-session` | POST | `src/app/api/payment/create-session/route.ts` | Create payment session |
| `/api/payment/verify` | POST | `src/app/api/payment/verify/route.ts` | Verify payment |
| `/api/payment/cleanup` | POST | `src/app/api/payment/cleanup/route.ts` | Cleanup payment data |
| `/api/webhook/cashfree` | POST | `src/app/api/webhook/cashfree/route.ts` | Cashfree webhook |

## Routing Patterns

### 1. Next.js App Router Structure
- Uses Next.js 13+ App Router with file-based routing
- Route groups and layouts for organization
- Dynamic routes with `[id]` parameters

### 2. Middleware Configuration
- **File**: `src/middleware.ts`
- **Matcher**: `['/dashboard/:path*', '/admin/:path*', '/login', '/register']`
- **Purpose**: Authentication protection for protected routes

### 3. Navigation Components

#### Header Navigation (`src/components/Header.tsx`)
- **Public Routes**: Home, About Us, Donate, Profile, Login
- **Conditional Routes**: Dashboard (users), Admin Dashboard (admins)
- **Mobile Menu**: Responsive navigation for mobile devices

#### Admin Sidebar (`src/components/admin/AdminSidebar.tsx`)
- **Admin Routes**: Dashboard, Donations, Users, Analytics, Reports
- **Collapsible**: Sidebar can be collapsed for space efficiency

### 4. Programmatic Navigation

#### Router Usage Patterns
- `useRouter()` hook from `next/navigation`
- `router.push()` for navigation
- `router.replace()` for redirects
- `router.back()` for going back

#### Common Navigation Flows
1. **Login Flow**: `/login` → `/dashboard` (users) or `/admin` (admins)
2. **Donation Flow**: `/donate` → `/donate/success`
3. **Authentication Flow**: Unauthenticated → `/login`
4. **Admin Flow**: Admin login → `/admin` → various admin sub-routes

### 5. Redirects and SEO

#### Next.js Config Redirects (`next.config.ts`)
- `/home` → `/` (permanent redirect)
- `/donations` → `/donate` (permanent redirect)

#### Sitemap (`src/app/sitemap.ts`)
- Auto-generated sitemap for SEO
- Includes all public routes with priorities and change frequencies

## Route Protection

### 1. Authentication Levels
- **Public**: No authentication required
- **Protected**: Requires user authentication
- **Admin**: Requires admin-level authentication
- **Super Admin**: Requires super admin privileges

### 2. Protection Mechanisms
- **Middleware**: Route-level protection
- **Component-level**: Auth checks in components
- **Context**: `AuthContext` for state management

### 3. Redirect Patterns
- Unauthenticated users → `/login`
- Regular users → `/dashboard`
- Admin users → `/admin`
- Failed authentication → `/login`

## Special Routes

### 1. Error Handling
- **404 Page**: `src/app/not-found.tsx`
- **Custom Error**: Redirects to home with error message

### 2. Dynamic Routes
- **Donation Success**: `/donate/success?order_id={id}`
- **Donation Verification**: `/verify-donation`
- **API Routes**: `/api/donations/[id]`

### 3. Layout Routes
- **Donate Layout**: `src/app/donate/layout.tsx`
- **Root Layout**: `src/app/layout.tsx`

## Route Dependencies

### 1. External Services
- **Cashfree**: Payment processing routes
- **Supabase**: Authentication and database

### 2. Internal Dependencies
- **AuthContext**: Authentication state
- **Components**: UI components for navigation
- **Utils**: Helper functions for routing

## Performance Considerations

### 1. Route Optimization
- Static routes for better performance
- Dynamic imports for code splitting
- Image optimization for route assets

### 2. Caching
- Static route caching
- API route caching strategies
- Image caching for route assets

---

*Last Updated: Generated from codebase analysis*
*Total Routes: 25+ (including API routes)*
*Total Components: 15+ navigation components*
