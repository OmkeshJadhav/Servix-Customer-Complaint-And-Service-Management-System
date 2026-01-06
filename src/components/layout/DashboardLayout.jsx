import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (!user) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>; // Or redirect
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = {
        customer: [
            { label: 'Dashboard', path: '/customer/dashboard', icon: <LayoutDashboard size={20} /> },
            { label: 'My Complaints', path: '/customer/complaints', icon: <FileText size={20} /> },
            { label: 'New Complaint', path: '/customer/new-complaint', icon: <FileText size={20} /> }, // Using FileText for now
        ],
        agent: [
            { label: 'Dashboard', path: '/agent/dashboard', icon: <LayoutDashboard size={20} /> },
            { label: 'Assigned Tickets', path: '/agent/tickets', icon: <FileText size={20} /> },
        ],
        admin: [
            { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
            { label: 'All Complaints', path: '/admin/complaints', icon: <FileText size={20} /> },
            { label: 'Users', path: '/admin/users', icon: <Users size={20} /> },
        ]
    };

    const roleNavItems = navItems[user.role] || [];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-indigo-600">CCSMS</h1>
                    <p className="text-xs text-gray-500 mt-1">Complaint Management</p>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {roleNavItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full bg-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate capitalize">{user.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Sidebar Overlay */}
            <div className={`fixed inset-0 z-40 bg-gray-900/50 md:hidden transition-opacity ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)} />

            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Same Sidebar Content for Mobile */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-indigo-600">CCSMS</h1>
                    <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {roleNavItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>


            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="bg-white border-b border-gray-200 md:hidden flex items-center p-4">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="mr-4 text-gray-600">
                        <Menu size={24} />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900">CCSMS</h1>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
