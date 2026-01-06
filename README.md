# Servix Customer Complaint & Service Management System (CCSMS)

A full-stack, role-based web application for managing customer service complaints. This system facilitates the entire lifecycle of a support ticket from submission to resolution, offering dedicated workflows for Customers, Service Agents, and Administrators.

## 🚀 Features

### 👤 Customer Portal
- **Dashboard**: View recent activity and ticket status summaries.
- **Submit Tickets**: Create new complaints with categories, priority levels, and attachments.
- **Track Status**: Real-time status tracking (Open, In Progress, Resolved).
- **History**: View detailed timeline of actions taken on tickets.

### 🎧 Service Agent Workspace
- **Queue Management**: "My Queue" for assigned tickets and "Unassigned Pool" for picking up new work.
- **Quick Actions**: One-click "Pick Up", "Start Working", and "Resolve" actions.
- **Ticket Details**: Rich detailed view with internal notes, customer details, and history logs.

### 🛡️ Admin Dashboard
- **Analytics**: Visual charts (Bar & Pie) showing complaint trends by Category and Status.
- **Master List**: Centralized view of all tickets with advanced filtering.
- **User Management**: Manage system access for Customers and Agents.

## 🛠️ Tech Stack

- **Frontend**: React 19 (Vite)
- **Styling**: Tailwind CSS v4, Lucide React (Icons), `class-variance-authority`
- **UI Components**: Custom modern components (Cards, Badges, Tables)
- **Routing**: React Router v7 (Protected Routes & Role-based Access Control)
- **Data Visualization**: Recharts
- **Backend & Database**: Supabase (PostgreSQL, Auth, Realtime)

## 📦 Prerequisites

- Node.js (v18 or higher)
- A generic Supabase project (for database and authentication)

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/sankey-ccsms.git
    cd sankey-ccsms
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory based on `.env.example` (if available) or use the following template:

    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
    Replace `your_supabase_project_url` and `your_supabase_anon_key` with your actual Supabase project credentials.

4.  **Database Setup**
    - Go to your Supabase Dashboard -> SQL Editor.
    - Copy the contents of [`supabase_schema.sql`](./supabase_schema.sql).
    - Run the SQL script to create the necessary tables (`users`, `complaints`, `complaint_history`) and seed initial data.

5.  **Run the development server**
    ```bash
    npm run dev
    ```

6.  **Open in Browser**
    Navigate to `http://localhost:5173`

## 🔑 Demo Credentials

The database seeding script (`supabase_schema.sql`) creates the following default users:

| Role | Email | Password |
|------|-------|----------|
| **Customer** | `customer@example.com` | *(Managed via Supabase Auth or Mock Login)* |
| **Agent** | `agent@example.com` | *(Managed via Supabase Auth or Mock Login)* |
| **Admin** | `admin@example.com` | *(Managed via Supabase Auth or Mock Login)* |

> **Note**: The current implementation uses a "Simulated Login" (`api.js`) that checks against the `public.users` table for email matching. It does not yet strictly require Supabase Auth passwords, making it easy to demo/test.

## 📂 Project Structure

```
src/
├── components/      # Reusable UI components (Layout, Badges, Forms)
├── context/         # Global State (AuthContext)
├── pages/
│   ├── admin/       # Admin Dashboard, User Mgmt, Analytics
│   ├── agent/       # Agent Workspace, Ticket Details
│   ├── auth/        # Login Page
│   └── customer/    # Customer Portals
├── services/
│   ├── api.js             # Data transformation & business logic
│   └── supabaseClient.js  # Supabase connection configuration
└── App.jsx          # Routing & Role protections
```

## 🔮 Future Roadmap

- [ ] **Full Supabase Auth**: Switch from simulated login to full Supabase Authentication (JWT).
- [ ] **Realtime Updates**: Enable Supabase subscriptions for live dashboard updates.
- [ ] **Email Notifications**: Automated emails on status changes via Supabase Edge Functions.
- [ ] **Chat Support**: Real-time chat between Customer and Agent.
