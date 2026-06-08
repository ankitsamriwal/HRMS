# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Opus HRMS: UAE Compliance Suite** - A React-based Human Resource Management System with AI-powered features for UAE labor law compliance, built as a Google AI Studio app.

**Core Technologies:**
- React 19.2.3 + TypeScript 5.8.2
- Vite 6.2.0 (build tool)
- Google Gemini AI (@google/genai 1.34.0)
- React Router DOM 7.11.0 (HashRouter)
- Tailwind CSS (CDN-loaded)

## Development Commands

### Setup
```bash
# Install dependencies
npm install

# Create .env.local file with:
GEMINI_API_KEY=your_api_key_here
```

### Running the App
```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Important:** The `GEMINI_API_KEY` environment variable is REQUIRED for all AI features to work.

## Architecture

### Routing & Access Control

The app uses **HashRouter** (not BrowserRouter) for AI Studio compatibility. Routes are protected by role-based access control defined in App.tsx:64-78.

**Route Structure:**
- `/` - Dashboard (Admin/Supervisor only)
- `/employees` - Workforce Management (Admin only)
- `/compliance` - Legal AI Assistant (Admin/Supervisor)
- `/gratuity` - Gratuity Calculator (Admin/Supervisor)
- `/reports` - Analytics Dashboard (Admin/Supervisor)
- `/claims` - Reimbursements Hub (All roles)
- `/erp` - ERP Connector Settings (Admin only)
- `/my-portal` - Employee Self-Service (All roles)
- `/hr-buddy` - AI HR Assistant (All roles)

**Role Hierarchy:**
- **Admin**: Full access to all features
- **Supervisor**: Dashboard, legal AI, gratuity, reports, employee views
- **Employee**: Self-service portal, reimbursements, AI assistant only

### Component Architecture

All components are in `components/` directory. Each component is self-contained and receives role/permissions via props where needed.

**Key Components:**
- `Dashboard.tsx` - Admin/Supervisor overview with compliance metrics
- `ComplianceAI.tsx` - Legal AI chatbot for UAE labor law queries
- `EmployeeList.tsx` - Workforce management with attrition risk analysis
- `GratuityCalc.tsx` - End of Service calculator per Decree Law 33
- `Reimbursements.tsx` - Expense claims with AI receipt scanning
- `ERPConnector.tsx` - Integration settings for SAP/Oracle/Odoo/Dynamics
- `HRAssistant.tsx` - General HR chatbot for all employees
- `EmployeePortal.tsx` - Employee self-service (leave requests, policies)
- `Reports.tsx` - Analytics and reporting dashboard

### AI Service Layer

**File:** `services/geminiService.ts`

All AI functionality is centralized in this service. Each function uses Google Gemini models with structured JSON outputs.

**AI Models Used:**
- `gemini-3-pro-preview` - For complex tasks (legal advice, gratuity calculations, offer letters)
- `gemini-3-flash-preview` - For fast tasks (attrition risk, GL codes, receipt scanning)

**Key Functions:**
- `askLegalAssistant(prompt, language)` - UAE labor law Q&A with EN/AR support
- `calculateGratuityAI(basicSalary, joiningDate, lastWorkingDay, reason)` - End of service calculations
- `scanReceiptAI(base64Image)` - OCR extraction from expense receipts (multimodal)
- `getAttritionRiskAI(employeeData)` - Employee retention predictions
- `suggestGLCodeAI(expenseType)` - Accounting code suggestions for expenses
- `checkPolicyComplianceAI(claimType, amount, description)` - Expense validation
- `getTrainingRecommendationsAI(role, department)` - Training course suggestions
- `generateOfferLetterAI(details)` - MOHRE-compliant offer letter generation

**Response Schema Pattern:**
All AI functions use structured JSON responses with defined TypeScript schemas via the `responseSchema` config option. Always include try-catch with fallback defaults.

### Type System

**File:** `types.ts`

All TypeScript interfaces and enums are centralized here. Import types from this file in all components.

**Key Types:**
- `Employee` - Workforce data with UAE-specific fields (visaStatus, isEmirati, leaveBalances)
- `ReimbursementRequest` - Expense claims with ERP sync status
- `GratuityResult` - End of service calculation results
- `ERPConfig` - Integration settings
- `Role` - 'Admin' | 'Supervisor' | 'Employee'
- `Language` - 'EN' | 'AR'

**Enums:**
- `EmploymentType` - Full-Time, Part-Time, Temporary
- `VisaStatus` - Resident, Visit, Processing, Expired
- `RequestStatus` - Pending, Approved, Rejected, Paid

### Internationalization (i18n)

The app supports **English and Arabic** with RTL layout switching.

**Translation Pattern:**
```typescript
const t = (en: string, ar: string) => lang === 'EN' ? en : ar;

// Usage:
<h1>{t('Dashboard', 'لوحة التحكم')}</h1>
```

**RTL Handling:**
When language switches to Arabic, the app:
1. Sets `document.documentElement.dir = 'rtl'`
2. Adjusts Tailwind classes with `rtl:` prefix
3. Flips sidebar position (left → right)

### Environment Variables

**Vite Configuration (vite.config.ts):**
```javascript
define: {
  'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
}
```

Access in code: `process.env.API_KEY` or `process.env.GEMINI_API_KEY`

### CDN Dependencies (Production)

**File:** `index.html`

The app uses **Import Maps** for browser-native ESM loading from `esm.sh` CDN:
- React, React DOM, React Router DOM
- Recharts (charts)
- Lucide React (icons)
- @google/genai

This is for AI Studio deployment compatibility. Development uses npm packages.

## UAE-Specific Compliance Features

### Labor Law Reference
All compliance features reference **Federal Decree-Law No. 33 of 2021** (UAE Labor Law).

### Gratuity Calculation Rules
- First 5 years: 21 days per year
- After 5 years: 30 days per year
- Resignation before 1 year: No gratuity
- Resignation between 1-5 years: Reduced gratuity (proportional)
- Termination (company initiated) or 5+ years: Full gratuity

**Implementation:** `calculateGratuityAI()` in geminiService.ts handles these rules via AI with structured output.

### Emiratisation Tracking
`Employee` interface includes `isEmirati: boolean` field for UAE nationals tracking, used for Nafis program compliance reporting.

### Leave Entitlements
UAE standard leave in `Employee.leaveBalances`:
- Annual: 30 days (Federal Law standard)
- Sick: 90 days per year (as per Article 31)
- Parental: Maternity/Paternity leave

## Styling Guidelines

**Tailwind CSS Patterns:**
- Rounded corners: `rounded-xl`, `rounded-2xl`, `rounded-[2.5rem]` (soft, modern)
- Primary color: Indigo (`indigo-600`, `indigo-500`)
- Neutral color: Slate (`slate-50`, `slate-100`, `slate-800`)
- Font weights: `font-black` for headings, `font-bold` for emphasis
- Shadows: `shadow-lg`, `shadow-2xl`, `shadow-indigo-200` (colored shadows)
- Consistent spacing: `gap-3`, `gap-4`, `p-4`, `p-6`

**Component Class Patterns:**
```typescript
// Active state in sidebar
active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'

// Card styling
className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"

// Button styling
className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700"
```

## Common Development Tasks

### Adding a New AI Feature
1. Add function to `services/geminiService.ts` with:
   - Model selection (pro for complex, flash for fast)
   - System instruction with UAE context
   - Response schema with TypeScript types
   - Try-catch with fallback
2. Define types in `types.ts` if needed
3. Call from component with loading state
4. Handle errors gracefully

### Adding a New Route
1. Create component in `components/YourComponent.tsx`
2. Add route in `App.tsx` Routes section
3. Add navigation item in sidebar (App.tsx:111-126)
4. Update `canAccess()` function for role permissions (App.tsx:64-78)

### Modifying Access Control
Edit the `canAccess()` function in App.tsx:64-78. Each feature has a string key mapped to role permissions.

### Working with Mock Data
Currently all data is in-memory/mock (stored in component state). There is no backend or database. When adding features:
- Use local state for data storage
- Simulate API delays with `setTimeout` if needed
- Keep data realistic to UAE context

## Known Limitations

1. **No Authentication** - Role switching is UI-only, not secure
2. **No Backend** - All data is mock/in-memory
3. **No Tests** - No test suite present
4. **Hard-coded User** - "Sarah Al-Maktoum" is the fixed user (App.tsx:167)
5. **ERP Integrations** - UI exists but no actual API integration
6. **No Git Repo** - Project is not version controlled (`.gitignore` present but `git init` not run)

## File Import Patterns

```typescript
// Types
import { Employee, Role, Language, ReimbursementRequest } from '../types';

// AI Services
import { askLegalAssistant, calculateGratuityAI } from '../services/geminiService';

// Icons (from lucide-react)
import { Users, Calculator, Scale } from 'lucide-react';

// React Router
import { useNavigate, useLocation, Link } from 'react-router-dom';
```

## Important Notes for Development

- Always test with both EN and AR languages (RTL layout can break UI)
- Respect role-based access control when showing/hiding features
- All AI features require `GEMINI_API_KEY` - gracefully handle missing key
- Use structured JSON responses from Gemini for predictable parsing
- Follow UAE labor law when implementing compliance features
- Keep UI consistent with existing Tailwind patterns
- Images/receipts sent to Gemini must be base64 encoded
- Temperature settings: 0.6-0.7 for factual (legal, calculations), higher for creative (offer letters)
