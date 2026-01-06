import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FileText, AlertTriangle, CheckCircle, Users, ArrowUpRight, TrendingUp, Clock, Download } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        open: 0,
        resolved: 0,
        critical: 0,
        avgResolutionTime: '0h',
        slaBreaches: 0
    });
    const [categoryData, setCategoryData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allComplaints, setAllComplaints] = useState([]);

    // Modern palette for charts
    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.getComplaints();
                setAllComplaints(data);

                // 1. Basic Counts
                const total = data.length;
                const open = data.filter(c => c.status === 'Open').length;
                const resolved = data.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
                const critical = data.filter(c => c.priority === 'Critical').length;

                // 2. SLA Breaches (Open and Overdue)
                const now = new Date();
                const slaBreaches = data.filter(c => {
                    if (c.status === 'Resolved' || c.status === 'Closed') return false;
                    return c.slaDeadline && new Date(c.slaDeadline) < now;
                }).length;

                // 3. Avg Resolution Time (Simple calc based on resolved tickets)
                let totalResolutionHours = 0;
                let resolvedCount = 0;
                data.forEach(c => {
                    if (c.status === 'Resolved' || c.status === 'Closed') {
                        const start = new Date(c.createdAt);
                        const end = new Date(c.updatedAt); // Using updatedAt as proxy for resolution time
                        const diffHours = (end - start) / (1000 * 60 * 60);
                        if (diffHours > 0) {
                            totalResolutionHours += diffHours;
                            resolvedCount++;
                        }
                    }
                });
                const avgResolutionTime = resolvedCount > 0
                    ? `${Math.round(totalResolutionHours / resolvedCount)}h`
                    : 'N/A';

                setStats({
                    total,
                    open,
                    resolved,
                    critical,
                    avgResolutionTime,
                    slaBreaches
                });

                // Process data for Category Bar Chart
                const catMap = data.reduce((acc, curr) => {
                    acc[curr.category] = (acc[curr.category] || 0) + 1;
                    return acc;
                }, {});
                setCategoryData(Object.keys(catMap).map(key => ({ name: key, count: catMap[key] })));

                // Process data for Status Pie Chart
                const statusMap = data.reduce((acc, curr) => {
                    acc[curr.status] = (acc[curr.status] || 0) + 1;
                    return acc;
                }, {});
                setStatusData(Object.keys(statusMap).map(key => ({ name: key, value: statusMap[key] })));

            } catch (error) {
                console.error('Error fetching admin data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleExport = () => {
        try {
            console.log("Attempting export with", allComplaints.length, "records");
            if (!allComplaints.length) {
                alert("No data to export");
                return;
            }

            const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'Created At', 'Assigned To'];
            const csvContent = [
                headers.join(','),
                ...allComplaints.map(c => {
                    const safeTitle = c.title ? `"${c.title.replace(/"/g, '""')}"` : '""';
                    const safeAssigned = c.assignedTo || 'Unassigned';
                    const safeDate = c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A';

                    return [
                        c.id,
                        safeTitle,
                        c.category || '',
                        c.priority || '',
                        c.status || '',
                        safeDate,
                        safeAssigned
                    ].join(',');
                })
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `complaints_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log("Export triggered successfully");
        } catch (err) {
            console.error("Export failed:", err);
            alert("Failed to export CSV. Check console for details.");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    const cards = [
        { name: 'Total Tickets', value: stats.total, icon: FileText, color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-200' },
        { name: 'Avg Resolution', value: stats.avgResolutionTime, icon: Clock, color: 'from-purple-500 to-indigo-600', shadow: 'shadow-purple-200' },
        { name: 'SLA Breaches', value: stats.slaBreaches, icon: AlertTriangle, color: 'from-orange-500 to-red-500', shadow: 'shadow-orange-200' },
        { name: 'Critical Open', value: stats.critical, icon: TrendingUp, color: 'from-red-600 to-rose-700', shadow: 'shadow-rose-200' },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Executive Overview</h1>
                    <p className="text-gray-500 mt-1">System performance and ticket analytics</p>
                </div>
                <button
                    onClick={handleExport}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                    <Download className="-ml-1 mr-2 h-4 w-4 text-gray-500" />
                    Export Report
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                {cards.map((item) => (
                    <div key={item.name} className={`relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md ${item.shadow}`}>
                        {/* Decorative background blob */}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Chart */}
                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Complaints by Category</h3>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#f9fafb' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="count" name="Complaints" radius={[4, 4, 0, 0]}>
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Chart */}
                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Status Distribution</h3>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
