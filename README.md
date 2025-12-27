# 🛡️ GearGuard

**GearGuard** is a modern, full-stack **Computerized Maintenance Management System (CMMS)** designed to streamline facility operations, track equipment health, and manage maintenance workflows efficiently.

Built with **React**, **Supabase**, and **TailwindCSS**, it offers an enterprise-grade interface inspired by Odoo, featuring real-time tracking, drag-and-drop Kanban boards, and comprehensive reporting.

---

## 🚀 Key Features

- **📊 Interactive Dashboard**: Real-time overview of critical KPIs, equipment status, and open requests.
- **🔧 Maintenance Request Management**:
  - **Kanban Workflow**: Visual drag-and-drop board for request stages (New → In Progress → Repaired → Scrap).
  - **Smart Worksheets**: Integrated checklists for quality control and standardized maintenance procedures.
- **🏭 Asset & Equipment Tracking**:
  - Complete lifecycle management for machines, vehicles, and tools.
  - Track serial numbers, locations, and assigned technicians.
- **👥 Team Management**: Organize workforce into specialized teams (Electrical, Mechanical, IT) with workload distribution.
- **🏭 Work Centers**: Monitor production units with efficiency, capacity, and OEE targets.
- **📈 Analytics & Reporting**: Data visualization for resolution times, compliance rates, and technician performance.
- **🔐 Secure Authentication**: Role-based access via Supabase Auth.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **Styling**: TailwindCSS + Lucide Icons
- **Backend & Database**: Supabase (PostgreSQL)
- **State Management**: React Context API
- **Drag & Drop**: @hello-pangea/dnd
- **Notifications**: react-toastify

---

## ⚙️ Installation & Setup

Follow these steps to get GearGuard running locally.

### Prerequisites

- Node.js (v16+)
- npm or yarn
- A Supabase project

### 1. Clone the Repository

```bash
git clone <repository_url>
cd gearguard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Setup Database

Run the SQL script located at `supabase/schema-clean.sql` in your Supabase SQL Editor to create the necessary tables, policies, and indexes.

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📄 License

This project is licensed under the MIT License.
