import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Plus, Search, Filter, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const MyComplaints = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const data = await api.getComplaints({ userId: user.id });
                setComplaints(data);
            } catch (error) {
                console.error('Failed to fetch complaints:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchComplaints();
        }
    }, [user]);

    const filteredComplaints = filter === 'All'
        ? complaints
        : complaints.filter(c => c.status === filter);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Tickets</h1>
                    <p className="text-gray-500 mt-1">Track and manage your service requests</p>
                </div>
                <Link
                    to="/customer/new-complaint"
                    className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-900 hover:bg-indigo-800 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Create New Ticket
                </Link>
            </div>

            {/* Filters and Search - Simple implementation */}
            <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
                {['All', 'Open', 'In Progress', 'Resolved'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${filter === status
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Complaints List grid */}
            <div className="grid gap-4">
                {filteredComplaints.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                        <div className="mx-auto h-16 w-16 text-gray-200 mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                            <Search size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No tickets found</h3>
                        <p className="mt-1 text-gray-500">There are no tickets matching your current filter.</p>
                        {filter !== 'All' && (
                            <button onClick={() => setFilter('All')} className="mt-4 text-indigo-600 font-medium hover:text-indigo-500">
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    filteredComplaints.map((complaint) => (
                        <Link
                            key={complaint.id}
                            to={`/customer/complaints/${complaint.id}`}
                            className="group bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`mt-1 p-2 rounded-lg ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-600' :
                                    complaint.status === 'In Progress' ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'
                                    }`}>
                                    {complaint.status === 'Resolved' ? <CheckCircle size={24} /> :
                                        complaint.status === 'In Progress' ? <Clock size={24} /> : <AlertCircle size={24} />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-indigo-600 mb-1">#{complaint.id}</p>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{complaint.title}</h3>
                                    <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-500">
                                        <span className="font-medium text-gray-700">{complaint.category}</span>
                                        <span>•</span>
                                        <span>Created {new Date(complaint.createdAt).toLocaleDateString()}</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold
                                  ${complaint.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                                                complaint.priority === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}
                              `}>
                                            {complaint.priority} Priority
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-gray-400 uppercase font-semibold mb-1">Status</span>
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wide
                            ${complaint.status === 'Resolved' ? 'bg-green-50 text-green-700 border border-green-100' :
                                            complaint.status === 'Open' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                                                'bg-indigo-50 text-indigo-700 border border-indigo-100'}`}>
                                        {complaint.status}
                                    </span>
                                </div>
                                <div className="text-gray-300 group-hover:text-indigo-400 transition-colors">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyComplaints;
