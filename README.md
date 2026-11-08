# StudentVerse — The Ultimate AI-Powered Student Ecosystem
### *Your Campus. Your Goals. Your Universe.*

StudentVerse is an all-in-one digital operating system engineered specifically for university students. It unifies academic management, predictive attendance tracking, AI-powered study tutoring, career roadmaps, placement preparation, and campus networking into one modern SaaS platform.

---

## 🌟 Key Features & Functional Modules

### 1. 🚀 Premium Landing Page
* High-impact hero section with interactive preview cards.
* Sticky navigation with smooth blur transitions, responsive mobile drawer, and light/dark mode switch.
* Animated statistics ribbon and interactive deep-dive into AI features.

### 2. 🔐 Authentication Portal (Split-Screen UX)
* **Design**: Directly inspired by modern minimalist EdTech portals with high-contrast split layouts.
* **Google OAuth**: Official Google sign-in powered by Supabase Authentication.
* **Email & Password**: Dedicated flows for Registration (Full name, College, Degree Course, Semester 1–8) and Login.
* **Demo Student 1-Click Access**: Instantly test the entire portal with pre-populated demo student credentials (*Aarav Sharma - 5th Sem CSE*).
* **Password Visibility Toggle & Forgot Password Modal**.

### 3. 📊 Bento-Grid Student Dashboard
* **Dynamic Welcome**: Real-time greeting with date, semester indicator, and motivational quotes.
* **Your Progress Curve**: Recharts spline area chart showing weekly study hours and quiz accuracy.
* **Today's Classes Timeline**: Vertical timetable with live time marker indicator.
* **Daily Tasks**: Interactive colored task pills with instant checkoff.
* **Assessment Countdown**: Real-time timer countdown to mid-sem/final examinations.
* **Attendance Quick Gauge**: Circular gauge displaying overall attendance safety.

### 4. 🤖 AI Study Assistant
* **Chat & Ask**: Ask academic queries with formatted markdown responses and code snippets.
* **Concept Explainer**: Simplifies difficult concepts into intuitive analogies, real-world mechanisms, and interview takeaways.
* **Notes Summarizer**: Distills raw lecture text into high-yield revision bullet points.
* **Interactive MCQ Quiz Generator**: University exam-standard multiple-choice questions with real-time scoring and detailed explanations.
* **Dual Engine**: Direct integration with Google Gemini 1.5 Flash via `@google/generative-ai`, with an intelligent offline knowledge base fallback.

### 5. 🛡️ Smart Attendance Shield
* **Predictive Deficit Math**:
  * If $< 75\%$: Calculates exact consecutive classes needed: `ceil((target * total - 100 * attended) / (100 - target))`.
  * If $\ge 75\%$: Calculates safe skips available: `floor((100 * attended - target * total) / target)`.
* **Logging**: Instant Present (+1) and Absent (0) logging with historical timestamps.
* **Add / Delete Subjects**: Configure custom credits, faculty, and targets.

### 6. 📝 Assignment Manager
* Filter by **Pending**, **In Progress**, **Completed**, and **Priority** (High, Medium, Low).
* Real-time deadline countdowns (*"2d Remaining"*, *"Due Today"*, *"Overdue"*).
* Interactive completion with celebration **confetti**.

### 7. ⏰ Smart Timetable
* Monday through Saturday day tabs.
* Class schedule cards with start/end time, room numbers, and faculty details.
* Add lecture slot modal with instant validation.

### 8. 🗺️ AI Skill Map & Career Roadmaps
* Curated career goals (*Full Stack Cloud Architect*, *AI / ML Engineer*, etc.).
* Dynamic prerequisite roadmap nodes (Beginner $\to$ Intermediate $\to$ Advanced) with resource links.
* Core technical competencies with interactive proficiency gauges.
* Capstone project blueprints with difficulty ratings.

### 9. 🚀 Opportunity Hub
* Discover **Internships** (Google, AWS), **Hackathons** (Microsoft Imagine Cup, ETHGlobal), **Scholarships**, and **Jobs**.
* Real-time bookmarking and application tracking (*Not Applied*, *Applied*, *Interviewing*, *Accepted*).
* Keyword search and category filters.

### 10. 👥 Campus Community & Project Collaboration
* **Community**: Discussion channels with upvoting and interactive nested comment threads.
* **Project Hub**: Showcase repositories with GitHub links, live demo links, star ratings, and "Request to Join Team" collaboration modals.

### 11. 🎯 Placement Preparation
* **AI ATS Resume Reviewer**: Analyzes plain text resumes, generating an ATS compatibility score (0-100), key strengths, high-impact improvements, and targeted keywords.
* **Mock Technical Interview**: Interactive technical interview questions with model answers and evaluation tips.
* **HR STAR Question Bank**: Curated behavioral frameworks.
* **Company Recruitment Tracker**: Track applications from OA cleared to Final Round.

### 12. 📚 Notes & Library
* Semester-wise filters (Semesters 1 through 8).
* Personal markdown note creation, bookmarking, and search.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React.js 19 + Vite.js 8 |
| **Styling & Design** | Tailwind CSS v4 + Framer Motion |
| **Routing** | React Router DOM v7 |
| **Icons & Visuals** | Lucide React Icons |
| **Data Visualizations** | Recharts (Spline & Area Charts) |
| **Database & Auth** | Supabase (PostgreSQL, RLS Policies, Google OAuth) |
| **AI Integration** | Google Generative AI (Gemini 1.5 Flash) |
| **Delight & Micro-interactions** | Canvas Confetti |

---

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
\`\`\`bash
npm run build
\`\`\`
The optimized static build is emitted to the `dist/` folder, ready for deployment to Vercel, Netlify, or GitHub Pages.

---

## 🗄️ Database Setup (Supabase PostgreSQL)

To initialize your live Supabase database:
1. Navigate to your **Supabase Dashboard** $\to$ **SQL Editor**.
2. Open and copy the contents of `supabase/schema.sql`.
3. Run the SQL script to create the following tables with Row Level Security (RLS) policies:
   * `profiles` (with automatic signup trigger)
   * `subjects`
   * `attendance`
   * `assignments`
   * `timetable`
   * `study_notes`
   * `opportunities`
   * `bookmarks`
   * `community_posts` & `comments`
   * `projects`
   * `placement_applications`
4. Under **Authentication** $\to$ **Providers**, enable **Google** with your Google Cloud OAuth Client ID and Secret.

---

## 📱 Mobile Responsiveness
StudentVerse is responsive across mobile phones, tablets, and wide monitors. On mobile displays, the sidebar collapses into a backdrop navigation drawer with full touch support.
