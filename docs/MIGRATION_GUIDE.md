# 🚀 Next.js Migration Guide
## Yamrajdham Temple Divine Giving Donation System

## 📋 **Step-by-Step Migration Process**

### **Phase 1: Project Setup**

#### **1.1 Create Next.js Project**
```bash
# Navigate to parent directory
cd ..

# Create new Next.js project
npx create-next-app@latest yamrajdham-temple-nextjs --typescript --tailwind --eslint --app --src-dir

# Navigate to new project
cd yamrajdham-temple-nextjs
```

#### **1.2 Install Dependencies**
```bash
# Core dependencies
npm install @supabase/supabase-js @tanstack/react-query @hookform/resolvers react-hook-form zod

# UI dependencies (shadcn/ui compatible)
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio
npm install @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible
npm install @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar
npm install @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress
npm install @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select
npm install @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot
npm install @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast
npm install @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip

# Additional UI libraries
npm install lucide-react sonner class-variance-authority clsx tailwind-merge
npm install next-themes date-fns embla-carousel-react input-otp react-day-picker
npm install react-resizable-panels recharts vaul cmdk

# Dev dependencies
npm install -D @types/node
```

#### **1.3 Project Structure Setup**
```
yamrajdham-temple-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx          # Home page
│   │   ├── donate/           # Donation pages
│   │   │   ├── page.tsx      # Donation form
│   │   │   └── success/       # Success page
│   │   │       └── page.tsx
│   │   ├── admin/            # Admin pages
│   │   │   └── donations/
│   │   │       └── page.tsx
│   │   └── api/              # API routes
│   │       ├── payment/      # Payment endpoints
│   │       │   ├── create-session/
│   │       │   │   └── route.ts
│   │       │   └── verify/
│   │       │       └── route.ts
│   │       └── webhook/      # Webhook handlers
│   │           └── cashfree/
│   │               └── route.ts
│   ├── components/           # Reusable components
│   │   ├── ui/              # shadcn/ui components
│   │   └── custom/          # Custom components
│   ├── lib/                 # Utilities
│   │   ├── supabase.ts      # Supabase client
│   │   └── utils.ts         # Utility functions
│   ├── hooks/               # Custom hooks
│   ├── services/            # API services
│   ├── config/              # Configuration
│   └── types/               # TypeScript types
```

### **Phase 2: Configuration Migration**

#### **2.1 Update Tailwind Config**
```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          glow: 'hsl(var(--primary-glow))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          rich: 'hsl(var(--secondary-rich))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        temple: {
          saffron: 'hsl(var(--temple-saffron))',
          gold: 'hsl(var(--temple-gold))',
          earth: 'hsl(var(--temple-earth))',
          sacred: 'hsl(var(--temple-sacred))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      backgroundImage: {
        'gradient-divine': 'var(--gradient-divine)',
        'gradient-peaceful': 'var(--gradient-peaceful)',
        'gradient-gold': 'var(--gradient-gold)'
      },
      boxShadow: {
        'temple': 'var(--shadow-temple)',
        'gold': 'var(--shadow-gold)',
        'divine': 'var(--shadow-divine)'
      },
      transitionTimingFunction: {
        'spiritual': 'var(--transition-spiritual)',
        'gentle': 'var(--transition-gentle)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

#### **2.2 Environment Variables**
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
CASHFREE_APP_ID=TEST10758970030978c58449ce8e073107985701
CASHFREE_SECRET_KEY=cfsk_ma_test_180b2c26eda0cf5a0750b646047f7dd4_5f14dbaf
CASHFREE_ENVIRONMENT=sandbox
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Phase 3: Component Migration**

#### **3.1 Copy UI Components**
```bash
# Copy all shadcn/ui components (they're Next.js compatible!)
cp -r ../yamrajdham-divine-giving/src/components/ui/* src/components/ui/
```

#### **3.2 Migrate Custom Components**
```typescript
// src/components/custom/Header.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Yamrajdham Temple
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button asChild>
              <Link href="/donate">Donate Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
```

### **Phase 4: API Routes Implementation**

#### **4.1 Payment Session Creation**
```typescript
// src/app/api/payment/create-session/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch('https://sandbox.cashfree.com/pg/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': process.env.CASHFREE_APP_ID!,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to create payment session' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### **4.2 Payment Verification**
```typescript
// src/app/api/payment/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`https://sandbox.cashfree.com/pg/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': process.env.CASHFREE_APP_ID!,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to verify payment' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### **4.3 Webhook Handler**
```typescript
// src/app/api/webhook/cashfree/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify webhook signature (implement based on Cashfree docs)
    // Process webhook data
    // Update database
    // Send confirmation emails
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
```

### **Phase 5: Pages Migration**

#### **5.1 Root Layout**
```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Yamraj dham Temple Divine Giving',
  description: 'Support the construction of Yamraj dham Temple',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={new QueryClient()}>
          <TooltipProvider>
            {children}
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

#### **5.2 Home Page**
```typescript
// src/app/page.tsx
import Header from '@/components/custom/Header';
import HeroSection from '@/components/custom/HeroSection';
import DonationSection from '@/components/custom/DonationSection';
import PrayerSection from '@/components/custom/PrayerSection';
import ProgressTracker from '@/components/custom/ProgressTracker';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <DonationSection />
        <PrayerSection />
        <ProgressTracker />
      </main>
    </div>
  );
}
```

#### **5.3 Donation Form Page**
```typescript
// src/app/donate/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/custom/Header';
import PaymentModal from '@/components/custom/PaymentModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function DonationFormPage() {
  const [formData, setFormData] = useState({
    amount: '',
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    message: '',
  });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.donorName || !formData.donorEmail || !formData.donorPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    setIsPaymentModalOpen(false);
    router.push(`/donate/success?order_id=${paymentData.order_id}`);
  };

  const handlePaymentFailure = (error: string) => {
    setIsPaymentModalOpen(false);
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Make a Donation</CardTitle>
              <CardDescription className="text-center">
                Support the construction of Yamraj dham Temple
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Donation Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donorName">Full Name</Label>
                  <Input
                    id="donorName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.donorName}
                    onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donorEmail">Email Address</Label>
                  <Input
                    id="donorEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.donorEmail}
                    onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donorPhone">Phone Number</Label>
                  <Input
                    id="donorPhone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.donorPhone}
                    onChange={(e) => setFormData({ ...formData, donorPhone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Leave a message or prayer"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Proceed to Payment
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        donationData={{
          amount: parseFloat(formData.amount),
          donorName: formData.donorName,
          donorEmail: formData.donorEmail,
          donorPhone: formData.donorPhone,
          orderId: `order_${Date.now()}`,
        }}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />
    </div>
  );
}
```

### **Phase 6: Testing & Deployment**

#### **6.1 Testing Checklist**
- [ ] All pages load correctly
- [ ] Payment flow works end-to-end
- [ ] API routes respond correctly
- [ ] Webhook handling works
- [ ] Database operations function
- [ ] Responsive design works
- [ ] Performance is acceptable

#### **6.2 Deployment Options**
1. **Vercel** (Recommended for Next.js)
2. **Netlify**
3. **Railway**
4. **Custom VPS**

---

## 🎯 **Migration Benefits**

### **Immediate Benefits:**
- ✅ **CORS Issue Solved**: Real backend API routes
- ✅ **Better Security**: Server-side secret handling
- ✅ **Improved Performance**: Built-in optimizations
- ✅ **Better SEO**: Server-side rendering

### **Long-term Benefits:**
- ✅ **Scalability**: Better architecture for growth
- ✅ **Maintainability**: Cleaner code structure
- ✅ **Developer Experience**: Better tooling
- ✅ **Future-proof**: Modern React patterns

---

## ⚠️ **Migration Risks & Mitigation**

### **Risks:**
- **Downtime**: Parallel development prevents this
- **Data Loss**: No data migration needed (Supabase)
- **Functionality Loss**: Thorough testing prevents this
- **Performance Issues**: Next.js is faster than the previous build system

### **Mitigation:**
- **Incremental Migration**: Test each component
- **Rollback Plan**: Keep previous version until Next.js is ready
- **Thorough Testing**: Test all functionality
- **Performance Monitoring**: Monitor metrics

---

## 📞 **Support & Next Steps**

1. **Start with Phase 1**: Create Next.js project
2. **Test Each Phase**: Don't skip testing
3. **Ask Questions**: Get help when needed
4. **Deploy When Ready**: Don't rush deployment

**Ready to start? Let's begin with Phase 1!** 🚀
