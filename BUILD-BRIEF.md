# P-BURNS ENTERPRISE — FULL BUILD BRIEF FOR AIDER
====================================================

## 🏛️ 1. PROJECT VISION & GOAL

**The Vision:**
P-Burns Enterprise is Ghana's premier digital flagship for luxury architecture and construction supplies. We specialize in premium ceramics, high-security doors, and elite hardware. The target audience includes high-end real estate developers, architects, and premium homeowners who value quality and trust.

**The Goal:**
Transform the current template-like website into a **"Billion-Dollar Website"**. It must scream high trust, architectural precision, and absolute premium quality. It should feel like browsing a luxury catalog or a high-end fashion brand's site, but for construction materials.

**The Aesthetic ("Quiet Luxury"):**
*   **Primary Accent**: Gold (`#B68D40`) — used sparingly for focus points, active states, and highlighting key text.
*   **Core Palette**: Deep Charcoal/Black (`#111111`) and Off-White (`#FAFAFA`).
*   **Typography**: High-end editorial serif fonts (**Cormorant Garamond**) for headings. Title Case only, never screaming uppercase.
*   **Feel**: Tactile, architectural, and spacious. Deep soft shadows, asymmetric grids, and smooth micro-animations.

---

## 🛠️ 2. CURRENT STATE & BLOCKERS

1.  **Public Site (`src/app/(public)`)**: Mostly completed. Has the serif fonts and glassmorphic header. Maintain this style.
2.  **Admin Portal (`src/app/admin`)**: **CRITICAL TASK**. The admin layout still uses a default **Emerald Green** theme (`bg-emerald-900`). It needs a complete overhaul to match the Gold/Charcoal theme.
3.  **Database**: Missing `DATABASE_URL`. Prisma is currently mocked in `src/lib/prisma.ts` and the adapter is disabled in `src/lib/auth-options.ts`. Keep it this way until keys are provided.
4.  **Theme System**: Colors are controlled via `src/data/theme.json` and injected as CSS variables in the public layout.

---

## 🚀 3. TASKS FOR AIDER (Sprint 1)

### Task 1: Overhaul Admin Layout
*   **File**: `src/app/admin/layout.tsx`
*   **Action**: Change the sidebar background from `bg-emerald-900` to Charcoal (`bg-[#111111]`).
*   **Action**: Change hover states from `hover:bg-emerald-800` to a subtle dark gray or gold accent.
*   **Action**: Update any green text or borders to Gold or white.

### Task 2: Overhaul All Admin Pages
*   **Directories**: Scan and update all pages inside `src/app/admin/` (e.g., `products`, `orders`, `customers`, `invoices`, etc.).
*   **Action**: Remove all green accents. Apply the Gold/Charcoal palette.
*   **Action**: Use rounded cards (`rounded-2xl`) and soft shadows to match the public site's "Billion-Dollar" look.
*   **Action**: Apply the serif font to main headings on these pages.

---

## 📝 Instructions for the User
Tell Aider: `"Read the file BUILD-BRIEF.md and execute the tasks in Section 3."`
