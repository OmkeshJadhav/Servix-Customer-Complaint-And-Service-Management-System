# Sankey Customer Complaint & Service Management System (CCSMS)

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
- **Master List**: centralized view of all tickets with advanced filtering.
- **User Management**: Manage system access for Customers and Agents.

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **UI Components**: Custom modern components (Cards, Badges, Tables)
- **Routing**: React Router v6 (Protected Routes & Role-based Access Control)
- **Data Visualization**: Recharts
- **Backend (Mock)**: In-memory simulation of async API calls (Ready for Supabase integration)

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/sankey-ccsms.git
    cd sankey-ccsms
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Navigate to `http://localhost:5173`

## 🔑 Demo Credentials

To test different roles, you can use the quick-login buttons on the login page, or use:

| Role | Email | Password |
|------|-------|----------|
| **Customer** | `customer@example.com` | `password` |
| **Agent** | `agent@example.com` | `password` |
| **Admin** | `admin@example.com` | `password` |

## 📂 Project Structure

```
src/
├── components/      # Reusable UI components (Layout, Badges, etc.)
├── context/         # React Context (AuthContext)
├── pages/
│   ├── admin/       # Admin Dashboard, User Mgmt, Analytics
│   ├── agent/       # Agent Workspace, Ticket Details
│   ├── auth/        # Login Page
│   └── customer/    # Customer Portals
├── services/        # Mock API / Supabase Client
└── App.jsx          # Routing & Role definitions
```

## 🔮 Future Roadmap

- [ ] **Supabase Integration**: Replace mock data with real database persistence.
- [ ] **Email Notifications**: Automated emails on status changes.
- [ ] **Chat Support**: Real-time chat between Customer and Agent.
