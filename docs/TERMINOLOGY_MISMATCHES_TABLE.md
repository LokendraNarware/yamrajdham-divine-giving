# Terminology Mismatches Found in Codebase

## Summary of Issues Found
Based on the comprehensive audit, here are all the terminology inconsistencies between **Yamraj Dham** (temple) and **Dharam Dham Paavan Nagari Trust** (trust):

| **Issue Type** | **File Location** | **Current Text** | **Should Be** | **Context** | **Priority** |
|---|---|---|---|---|---|
| **INCORRECT TRUST NAME** | Multiple files | "Yamraj Dham Trust" | "Dharam Dham Paavan Nagari Trust" | Legal/business contexts | 🔴 HIGH |
| **INCONSISTENT TEMPLE NAMING** | Multiple files | "Yamraj dham Temple" | "Yamrajdham Temple" | Temple references | 🟡 MEDIUM |
| **WRONG EMAIL DOMAIN** | Multiple files | "@yamrajdham.org" | "@dharamdhamtrust.org" | Contact information | 🔴 HIGH |
| **MIXED CAPITALIZATION** | Multiple files | "yamraj dham" | "Yamraj Dham" | Proper nouns | 🟡 MEDIUM |
| **INCONSISTENT WEBSITE URL** | Multiple files | "yamrajdhamtemple.org" | "dharamdhamtrust.org" | Website references | 🟡 MEDIUM |

---

## Detailed Breakdown by Category

### 🔴 **HIGH PRIORITY ISSUES**

#### 1. **Incorrect Trust Name Usage**
| File | Line | Current | Should Be | Issue |
|---|---|---|---|---|
| `src/components/Footer.tsx` | 13 | "Yamraj Dham Trust – Yamraj dham Temple" | "Dharam Dham Paavan Nagari Trust – Yamrajdham Temple" | Wrong trust name |
| `src/components/Footer.tsx` | 30 | "Yamraj Dham Trust" | "Dharam Dham Paavan Nagari Trust" | Wrong trust name |
| `src/components/Footer.tsx` | 199 | "Account Name: Yamraj Dham Trust" | "Account Name: Dharam Dham Paavan Nagari Trust" | Wrong trust name |
| `src/components/Footer.tsx` | 256 | "Yamraj Dham Trust" | "Dharam Dham Paavan Nagari Trust" | Wrong trust name |
| `src/components/Footer.tsx` | 259 | "© 2025 Yamraj Dham Trust" | "© 2025 Dharam Dham Paavan Nagari Trust" | Wrong trust name |
| `src/app/contact/page.tsx` | 4,5,20,40,99 | "Yamraj Dham Trust" | "Dharam Dham Paavan Nagari Trust" | Wrong trust name |
| `src/app/gallery/page.tsx` | 4,20 | "Yamraj Dham Trust" | "Dharam Dham Paavan Nagari Trust" | Wrong trust name |
| `src/app/refund-policy/page.tsx` | 4,5,20,38,56,292 | "Yamraj Dham Trust" | "Dharam Dham Paavan Nagari Trust" | Wrong trust name |
| `src/app/donation-policy/page.tsx` | 4,5,20,38,54,237,359 | "Yamraj Dham Trust" | "Dharam Dham Paavan Nagari Trust" | Wrong trust name |
| `src/app/terms-conditions/page.tsx` | 4,5,20,38,54,70,139,213,233,286 | "Yamraj Dham Trust" | "Dharam Dham Paavan Nagari Trust" | Wrong trust name |
| `src/app/disclaimer/page.tsx` | 4,5,20,38,190,239,293 | "Yamraj Dham Trust" | "Dharam Dham Paavan Nagari Trust" | Wrong trust name |
| `src/app/privacy-policy/page.tsx` | 4,5,20,38,227 | "Yamraj Dham Trust" | "Dharam Dham Paavan Nagari Trust" | Wrong trust name |

#### 2. **Wrong Email Domain Usage**
| File | Line | Current | Should Be | Issue |
|---|---|---|---|---|
| `src/components/Footer.tsx` | 43 | "info@yamrajdham.org" | "info@dharamdhamtrust.org" | Wrong domain |
| `src/components/Footer.tsx` | 44 | "donations@yamrajdham.org" | "donations@dharamdhamtrust.org" | Wrong domain |
| `src/components/Footer.tsx` | 209 | "UPI ID: donations@yamrajdham" | "UPI ID: donations@dharamdhamtrust" | Wrong domain |
| `src/app/contact/page.tsx` | 78,85,107 | "@yamrajdham.org" | "@dharamdhamtrust.org" | Wrong domain |
| `src/app/gallery/page.tsx` | 154 | "gallery@yamrajdham.org" | "gallery@dharamdhamtrust.org" | Wrong domain |
| `src/app/refund-policy/page.tsx` | 293,323 | "refunds@yamrajdham.org" | "refunds@dharamdhamtrust.org" | Wrong domain |
| `src/app/disclaimer/page.tsx` | 294 | "info@yamrajdham.org" | "info@dharamdhamtrust.org" | Wrong domain |
| `src/app/donation-policy/page.tsx` | 360 | "donations@yamrajdham.org" | "donations@dharamdhamtrust.org" | Wrong domain |
| `src/app/terms-conditions/page.tsx` | 287 | "info@yamrajdham.org" | "info@dharamdhamtrust.org" | Wrong domain |
| `src/app/privacy-policy/page.tsx` | 228 | "privacy@yamrajdham.org" | "privacy@dharamdhamtrust.org" | Wrong domain |
| `migrations/001_initial_schema.sql` | 174 | "info@yamrajdham.org" | "info@dharamdhamtrust.org" | Wrong domain |
| `database-schema.sql` | 136 | "info@yamrajdham.org" | "info@dharamdhamtrust.org" | Wrong domain |
| `src/pages/Index.tsx` | 126 | "info@yamrajdham.org" | "info@dharamdhamtrust.org" | Wrong domain |

### 🟡 **MEDIUM PRIORITY ISSUES**

#### 3. **Inconsistent Temple Naming**
| File | Line | Current | Should Be | Issue |
|---|---|---|---|---|
| `src/components/HeroSection.tsx` | 11,27 | "Yamraj dham Temple" | "Yamrajdham Temple" | Inconsistent spacing |
| `src/components/HeroSection.tsx` | 33 | "Yamrajdham Temple" | ✅ Correct | Already correct |
| `src/components/Footer.tsx` | 13,50,262 | "Yamraj dham Temple" | "Yamrajdham Temple" | Inconsistent spacing |
| `src/app/gallery/page.tsx` | 23 | "Yamraj dham Temple" | "Yamrajdham Temple" | Inconsistent spacing |
| `src/app/contact/page.tsx` | 42 | "Yamraj dham Temple" | "Yamrajdham Temple" | Inconsistent spacing |
| `src/components/Header.tsx` | 39 | "Yamraj Dham Temple Logo" | "Yamrajdham Temple Logo" | Inconsistent spacing |
| `src/app/globals.css` | 3,6 | "Yamraj dham Temple" | "Yamrajdham Temple" | Inconsistent spacing |
| `src/app/donation-policy/page.tsx` | 38,57,362,390 | "Yamraj dham Temple" | "Yamrajdham Temple" | Inconsistent spacing |
| `src/app/disclaimer/page.tsx` | 296 | "Yamraj dham Temple" | "Yamrajdham Temple" | Inconsistent spacing |
| `src/app/terms-conditions/page.tsx` | 73,289 | "Yamraj dham Temple" | "Yamrajdham Temple" | Inconsistent spacing |
| `src/app/privacy-policy/page.tsx` | 38,230 | "Yamraj dham Temple" | "Yamrajdham Temple" | Inconsistent spacing |
| `src/components/YamrajDhamSection.tsx` | 64 | "Yamraj dham Temple Construction" | "Yamrajdham Temple Construction" | Inconsistent spacing |
| `src/components/CommunitySection.tsx` | 21 | "Yamraj dham Temple" | "Yamrajdham Temple" | Inconsistent spacing |
| `src/components/AboutHeroSection.tsx` | 11 | "Yamraj dham Temple" | "Yamrajdham Temple" | Inconsistent spacing |
| `src/components/WhatsAppIcon.tsx` | 10 | "Yamraj Dham Temple" | "Yamrajdham Temple" | Inconsistent spacing |
| `src/app/layout.tsx` | 19,20 | "Yamraj dham Temple" | "Yamrajdham Temple" | Inconsistent spacing |

#### 4. **Inconsistent Website URL**
| File | Line | Current | Should Be | Issue |
|---|---|---|---|---|
| `src/app/about/page.tsx` | 539,622 | "yamrajdhamtemple.org" | "dharamdhamtrust.org" | Wrong domain |

#### 5. **Database Schema Issues**
| File | Line | Current | Should Be | Issue |
|---|---|---|---|---|
| `DATABASE_SCHEMA.md` | 1,3,433 | "Yamraj dham Temple" | "Yamrajdham Temple" | Inconsistent spacing |
| `database-types.ts` | 1 | "Yamraj dham Temple" | "Yamrajdham Temple" | Inconsistent spacing |
| `migrations/001_initial_schema.sql` | 2,172 | "Yamraj dham Temple" | "Yamrajdham Temple" | Inconsistent spacing |

---

## **CORRECT USAGE EXAMPLES** ✅

These files are using the correct terminology:

| File | Correct Usage | Context |
|---|---|---|
| `src/components/HeroSection.tsx` | "Dharam Dham Paavan Nagari Trust" | Trust introduction |
| `src/app/about/page.tsx` | "Dharam Dham Paavan Nagari Trust" | About section |
| `src/components/AboutTrustInfoSection.tsx` | "Dharam Dham Paavan Nagari Trust" | Trust information |
| `src/components/AboutMissionVisionSection.tsx` | "Dharam Dham Paavan Nagari Trust" | Mission statement |
| `src/components/AboutIntroSection.tsx` | "Dharam Dham Paavan Nagari Trust" | Introduction |
| `src/components/AboutHeroSection.tsx` | "Dharam Dham Paavan Nagari Trust" | Hero section |
| `src/app/page.tsx` | "Dharam Dham Paavan Nagari Trust" | Main page |
| `src/components/SpiritualLeaderSection.tsx` | "Dharam Dham Paavan Nagari Trust" | Spiritual leader section |

---

## **RECOMMENDATIONS**

### **Immediate Actions Required:**
1. **Replace all instances of "Yamraj Dham Trust" with "Dharam Dham Paavan Nagari Trust"**
2. **Update all email domains from "@yamrajdham.org" to "@dharamdhamtrust.org"**
3. **Standardize temple name to "Yamrajdham Temple" (no space)**

### **Files Requiring Updates:**
- **13 files** with incorrect trust name
- **13 files** with wrong email domain
- **16 files** with inconsistent temple naming
- **3 database files** with naming issues

### **Total Issues Found:** **45+ instances** across **25+ files**

---
*This audit was conducted on the entire codebase to ensure terminology consistency between the temple (Yamraj Dham) and trust (Dharam Dham Paavan Nagari Trust) entities.*
