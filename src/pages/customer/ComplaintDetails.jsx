import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import StatusBadge from '../../components/complaints/StatusBadge';
import { ArrowLeft, Clock, Calendar, Hash, Tag, AlertTriangle, User } from 'lucide-react';

const ComplaintDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const data = await api.getComplaintById(id);
                setComplaint(data);
            } catch (err) {
                setError('Complaint not found');
            } finally {
                setLoading(false);
            }
        };
        fetchComplaint();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error) return (
        <div className="text-center py-10">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
                {error}
            </div>
            <button onClick={() => navigate('/customer/complaints')} className="block mt-4 text-indigo-600 hover:underline mx-auto">
                Go back
            </button>
        </div>
    );

    if (!complaint) return null;

    return (
        <div className="max-w-5xl mx-auto">
            <button
                onClick={() => navigate('/customer/complaints')}
                className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6"
            >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to My Tickets
            </button>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-start gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded">#{complaint.id}</span>
                                    <span className="text-xs font-medium text-gray-400">{new Date(complaint.createdAt).toLocaleString()}</span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{complaint.title}</h1>
                            </div>
                            <StatusBadge status={complaint.status} />
                        </div>

                        <div className="p-6">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Description</h3>
                            <div className="prose prose-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                {complaint.description}
                            </div>

                            {/* Meta Grid */}
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="p-3 rounded-lg border border-gray-100 bg-white shadow-sm flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                        <Tag size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Category</p>
                                        <p className="text-sm font-semibold text-gray-900">{complaint.category}</p>
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg border border-gray-100 bg-white shadow-sm flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${complaint.priority === 'Critical' ? 'bg-red-50 text-red-600' :
                                        complaint.priority === 'High' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        <AlertTriangle size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Priority</p>
                                        <p className="text-sm font-semibold text-gray-900">{complaint.priority}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Timeline & Info */}
                <div className="space-y-6">
                    {/* Agent Info (If assigned) */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <User size={16} /> Support Agent
                        </h3>
                        {complaint.assignedTo ? (
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                    SA
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Assigned Agent</p>
                                    <p className="text-xs text-gray-500">Working on your ticket</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3 border border-dashed border-gray-200 text-center">
                                Waiting for assignment
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock size={16} /> Ticket History
                        </h3>
                        <div className="flow-root">
                            <ul className="-mb-8">
                                {complaint.history?.map((event, eventIdx) => (
                                    <li key={event.id}>
                                        <div className="relative pb-8">
                                            {eventIdx !== complaint.history.length - 1 ? (
                                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-100" aria-hidden="true" />
                                            ) : null}
                                            <div className="relative flex space-x-3">
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white ${event.action === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-indigo-50 text-indigo-600'
                                                    }`}>
                                                    <div className="h-2 w-2 rounded-full bg-current"></div>
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1.5">
                                                    <div>
                                                        <p className="text-sm text-gray-900 font-medium">{event.action}</p>
                                                        {event.details && <p className="text-xs text-gray-500 mt-0.5">{event.details}</p>}
                                                    </div>
                                                    <div className="text-right text-xs text-gray-400 mt-1">
                                                        <time dateTime={event.timestamp}>
                                                            {new Date(event.timestamp).toLocaleDateString()}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ComplaintDetails;
