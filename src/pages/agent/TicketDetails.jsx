import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/complaints/StatusBadge';
import { ArrowLeft, Send, CheckCircle, Clock, AlertTriangle, User, MoreVertical, MessageSquare } from 'lucide-react';

const TicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchComplaint = async () => {
        try {
            const data = await api.getComplaintById(id);
            setComplaint(data);
        } catch (err) {
            console.error('Complaint not found');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaint();
    }, [id]);

    const handleStatusUpdate = async (newStatus) => {
        try {
            setUpdating(true);
            await api.updateComplaint(id, { status: newStatus }, user.id);
            await fetchComplaint();
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!complaint) return (
        <div className="text-center py-10">
            <p className="text-gray-500">Ticket not found</p>
            <button onClick={() => navigate('/agent/dashboard')} className="text-indigo-600 font-medium hover:underline mt-2">
                Back to Dashboard
            </button>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto">
            {/* Breadcrumbs / Back navigation */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate('/agent/dashboard')}
                    className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Workspace
                </button>
                <div className="text-sm text-gray-400">
                    Ticket ID: <span className="font-mono text-gray-600 select-all">#{complaint.id}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN - Main Content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Ticket Header Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <StatusBadge status={complaint.status} />
                                <h1 className="text-2xl font-bold text-gray-900 mt-3 leading-tight">{complaint.title}</h1>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} /> Created {new Date(complaint.createdAt).toLocaleDateString()}
                                    </span>
                                    <span>•</span>
                                    <span>{complaint.category}</span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-lg ${complaint.priority === 'Critical' ? 'bg-red-50 text-red-600' :
                                complaint.priority === 'High' ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-500'
                                }`}>
                                <AlertTriangle size={20} />
                            </div>
                        </div>

                        <div className="prose prose-sm text-gray-600 bg-gray-50 p-5 rounded-xl border border-gray-100 mb-8">
                            {complaint.description}
                        </div>

                        {/* Action Toolbar */}
                        <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
                            {complaint.status !== 'In Progress' && complaint.status !== 'Resolved' && (
                                <button
                                    onClick={() => handleStatusUpdate('In Progress')}
                                    disabled={updating}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    Start Working
                                </button>
                            )}

                            {complaint.status !== 'Resolved' && complaint.status !== 'Closed' && (
                                <button
                                    onClick={() => handleStatusUpdate('Resolved')}
                                    disabled={updating}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-900 focus:outline-none focus:border-green-900 focus:ring ring-green-300 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    <CheckCircle size={16} className="mr-2" />
                                    Mark as Resolved
                                </button>
                            )}

                            <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150">
                                Decline / Reassign
                            </button>
                        </div>
                    </div>

                    {/* Activity Log */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <MessageSquare size={20} className="text-gray-400" />
                            Activity Timeline
                        </h3>

                        <div className="relative">
                            <div className="absolute top-0 bottom-0 left-4 w-px bg-gray-200"></div>
                            <div className="space-y-8 relative">
                                {/* Input Note Placeholder */}
                                <div className="flex gap-4 items-start">
                                    <div className="relative z-10 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0">
                                        <User size={14} className="text-gray-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="relative shadow-sm rounded-lg">
                                            <input
                                                type="text"
                                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-lg py-3 px-4 bg-gray-50 hover:bg-white transition-colors border"
                                                placeholder="Add an internal note or reply..."
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                                                <button className="inline-flex items-center border border-transparent rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none p-1.5 m-1">
                                                    <Send size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {complaint.history.slice().reverse().map((event) => (
                                    <div key={event.id} className="flex gap-4 items-start group">
                                        <div className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0 ${event.action === 'Resolved' ? 'bg-green-100 text-green-600' :
                                            event.action === 'Status Change' ? 'bg-blue-100 text-blue-600' :
                                                'bg-gray-100 text-gray-500'
                                            }`}>
                                            {event.action === 'Resolved' ? <CheckCircle size={14} /> :
                                                event.action === 'Assigned' ? <User size={14} /> :
                                                    <Clock size={14} />}
                                        </div>
                                        <div className="flex-1 bg-gray-50 rounded-lg p-4 group-hover:bg-gray-100 transition-colors">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-semibold text-gray-900 text-sm">{event.action}</span>
                                                <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{event.details || 'No details provided.'}</p>
                                            <p className="text-xs text-gray-400 mt-2">Performed by {event.performer || 'System'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Customer Details</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                {complaint.userId?.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">User {complaint.userId}</p>
                                <p className="text-xs text-gray-500">Customer</p>
                            </div>
                        </div>
                        <div className="border-t border-gray-100 pt-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Email</span>
                                <span className="text-gray-900 font-medium">user{complaint.userId}@example.com</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Phone</span>
                                <span className="text-gray-900 font-medium">+1 (555) 000-0000</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">SLA Status</h3>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-3/4"></div>
                            </div>
                            <span className="text-xs font-bold text-gray-700">75%</span>
                        </div>
                        <p className="text-xs text-gray-500">Response time within expected limits.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetails;
