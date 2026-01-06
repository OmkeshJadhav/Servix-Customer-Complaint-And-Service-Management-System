import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/complaints/StatusBadge';
import { Inbox, UserCheck, AlertTriangle, ArrowRight, CheckCircle2, MoreHorizontal } from 'lucide-react';

const AgentDashboard = () => {
    const { user } = useAuth();
    const [assignedTickets, setAssignedTickets] = useState([]);
    const [unassignedTickets, setUnassignedTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const allComplaints = await api.getComplaints();
            setAssignedTickets(allComplaints.filter(c => c.assignedTo === user.id));
            setUnassignedTickets(allComplaints.filter(c => !c.assignedTo && c.status !== 'Closed' && c.status !== 'Resolved'));
        } catch (error) {
            console.error('Error fetching agent data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const handlePickUp = async (complaintId) => {
        try {
            // Optimistic update could be added here for even faster UI feeling
            await api.updateComplaint(complaintId, { assignedTo: user.id, status: 'In Progress' }, user.id);
            fetchData();
        } catch (err) {
            console.error('Failed to pick up ticket:', err);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    const stats = [
        { name: 'My Queue', value: assignedTickets.length, icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { name: 'Unassigned', value: unassignedTickets.length, icon: Inbox, color: 'text-amber-600', bg: 'bg-amber-50' },
        { name: 'Critical', value: assignedTickets.filter(c => c.priority === 'Critical' || c.priority === 'High').length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Workspace</h1>
                    <p className="text-gray-500 mt-1">Manage your tickets and pick up new work</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        Online
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-10">
                {stats.map((item) => (
                    <div key={item.name} className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex items-center">
                        <div className={`rounded-xl p-4 ${item.bg}`}>
                            <item.icon className={`h-6 w-6 ${item.color}`} />
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500">{item.name}</p>
                            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* My Assigned Queue */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Assigned to Me</h3>
                            <p className="text-xs text-gray-500">Tickets currently in your queue</p>
                        </div>
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                            {assignedTickets.length} Active
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {assignedTickets.length > 0 ? (
                            assignedTickets.map((ticket) => (
                                <div key={ticket.id} className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-gray-400">#{ticket.id}</span>
                                            <div className={`h-2 w-2 rounded-full ${ticket.priority === 'Critical' ? 'bg-red-500' : ticket.priority === 'High' ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                                            <span className="text-xs font-medium text-gray-500">{ticket.category}</span>
                                        </div>
                                        <StatusBadge status={ticket.status} />
                                    </div>

                                    <h4 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                        <Link to={`/agent/tickets/${ticket.id}`} className="focus:outline-none">
                                            <span className="absolute inset-0" aria-hidden="true" />
                                            {ticket.title}
                                        </Link>
                                    </h4>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                        {ticket.description}
                                    </p>

                                    <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-2">
                                        <div className="text-xs text-gray-400">
                                            Updated {new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="flex items-center text-indigo-600 font-medium text-xs group-hover:underline">
                                            Manage Ticket <ArrowRight className="ml-1 h-3 w-3" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
                                <CheckCircle2 size={48} className="mb-4 text-green-100 text-green-500 " strokeWidth={1.5} />
                                <p className="text-gray-900 font-medium">All caught up!</p>
                                <p className="text-sm">Your queue is empty. Pick up new tickets from the pool.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Unassigned Pool */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Unassigned Pool</h3>
                            <p className="text-xs text-gray-500">New tickets waiting for triage</p>
                        </div>
                        <div className="flex gap-2">
                            {/* Could add filters here later */}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-0">
                        {unassignedTickets.length > 0 ? (
                            <ul className="divide-y divide-gray-100">
                                {unassignedTickets.map((ticket) => (
                                    <li key={ticket.id} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4">
                                        <div className={`mt-1 p-2 rounded-lg flex-shrink-0 ${ticket.priority === 'Critical' ? 'bg-red-100 text-red-600' :
                                            ticket.priority === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            <AlertTriangle size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-semibold text-gray-900 truncate pr-4">{ticket.title}</p>
                                                <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-0.5 mb-2">{ticket.category} • {ticket.priority} Priority</p>

                                            <button
                                                onClick={() => handlePickUp(ticket.id)}
                                                className="inline-flex items-center px-3 py-1.5 border border-indigo-200 text-xs font-semibold rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 transition-all"
                                            >
                                                Assign to Me
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
                                <Inbox size={48} className="mb-4 text-gray-200" strokeWidth={1.5} />
                                <p className="text-gray-900 font-medium">No pending tickets</p>
                                <p className="text-sm">Great job! The unassigned pool is empty.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;
