import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, CheckCircle, Clock, FileText, ArrowRight, Activity, Plus } from 'lucide-react';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
    });
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.getComplaints({ userId: user.id });

                setStats({
                    total: data.length,
                    open: data.filter(c => c.status === 'Open').length,
                    inProgress: data.filter(c => c.status === 'In Progress').length,
                    resolved: data.filter(c => c.status === 'Resolved' || c.status === 'Closed').length,
                });

                // Get 3 most recent
                setRecentComplaints(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchData();
    }, [user]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    const statCards = [
        { name: 'Total Tickets', value: stats.total, icon: FileText, color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-200' },
        { name: 'Open Issues', value: stats.open, icon: AlertCircle, color: 'from-orange-500 to-red-500', shadow: 'shadow-orange-200' },
        { name: 'In Progress', value: stats.inProgress, icon: Activity, color: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-200' },
        { name: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'from-green-500 to-emerald-600', shadow: 'shadow-emerald-200' },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
                </div>
                <Link
                    to="/customer/new-complaint"
                    className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-900 hover:bg-indigo-800 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    New Complaint
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                {statCards.map((item) => (
                    <div key={item.name} className={`relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md ${item.shadow}`}>
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-gradient-to-br opacity-10 blur-xl pointer-events-none"></div>
                        <dt>
                            <div className={`absolute rounded-xl p-3 bg-gradient-to-br ${item.color} shadow-lg`}>
                                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                            <p className="ml-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
                        </dt>
                        <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
                            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                        </dd>
                    </div>
                ))}
            </div>

            {/* Recent Complaints Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                        <p className="text-xs text-gray-500 mt-1">Your latest submitted tickets</p>
                    </div>
                    <Link to="/customer/complaints" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center group">
                        View all
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <ul className="divide-y divide-gray-100">
                    {recentComplaints.length > 0 ? (
                        recentComplaints.map((complaint) => (
                            <li key={complaint.id} className="group hover:bg-gray-50 transition-colors">
                                <Link to={`/customer/complaints/${complaint.id}`} className="block px-6 py-5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center min-w-0 gap-4">
                                            <div className={`p-2 rounded-full hidden sm:block ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-600' :
                                                complaint.status === 'In Progress' ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'
                                                }`}>
                                                {complaint.status === 'Resolved' ? <CheckCircle size={20} /> : <Clock size={20} />}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-700 transition-colors">
                                                    {complaint.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-gray-500">#{complaint.id}</span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-xs text-gray-500">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">{complaint.category}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${complaint.status === 'Resolved' ? 'bg-green-50 text-green-700 border border-green-100' :
                                                    complaint.status === 'Open' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                                                        'bg-indigo-50 text-indigo-700 border border-indigo-100'}`}>
                                                {complaint.status}
                                            </span>
                                            <ArrowRight className="ml-4 h-5 w-5 text-gray-300 group-hover:text-gray-400" />
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li className="px-6 py-12 text-center">
                            <div className="mx-auto h-12 w-12 text-gray-300 mb-3 bg-gray-50 rounded-full flex items-center justify-center">
                                <FileText size={24} />
                            </div>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints yet</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating a new ticket.</p>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default CustomerDashboard;
