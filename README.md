# CampusRant — User Frontend (React + Tailwind CSS)

Mobile-first student rant platform for college confessions, unfiltered opinions, and campus discourse.

## Features Built

- **Design System:** Deep midnight dark mode (`#0A0F1D`), brand fire accents, reaction states, Plus Jakarta Sans & Outfit typography.
- **Authentication:** Mobile-first Login & Register with image upload, department selection, and password toggle.
- **Mobile Navigation:** Fixed mobile bottom nav with center elevated "Spill The Tea" action and unread badge.
- **Responsive Desktop:** 3-column desktop shell (Desktop Sidebar | Feed | Trending Buzz Widget).
- **Home Feed:** Real-time rants feed with department filter chips, keyword search bar, and reaction triggers.
- **Rant Cards:** Reusable `RantCard` with anonymous masking, time ago, image attachments, comment counters, view counters, and more actions (share, report, edit, delete).
- **Interactive Reactions:** 😂 💀 😭 🔥 reactions with instant optimistic UI update.
- **Create Rant:** Animated slide-up Bottom Sheet with 2000 character limit, photo attachment, and anonymous toggle.
- **Rant Details:** Dedicated page with full post view and nested comments & replies system.
- **Trending Rants:** Today, This Week, and All-Time Popular tabs with ranking badges.
- **Explore & Search:** Full search page with keyword search, username lookup, department filter, and latest/popular sorting.
- **My Rants & My Reactions:** Dedicated sections for viewing authored posts and posts reacted to.
- **Notifications:** Comment, reply, reaction, and trending alerts with unread filtering and mark-as-read.
- **Profile & Edit Profile:** Profile stats, avatar upload, password change, and account deletion.
- **Content Reporting:** Modal bottom sheet for harassment, spam, and doxxing moderation.
- **Skeletons, Empty & Error States:** Animated loading skeletons, friendly empty states, and retry prompts.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   ```
   Default `VITE_API_URL` is `http://localhost:5001/api`.

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```
