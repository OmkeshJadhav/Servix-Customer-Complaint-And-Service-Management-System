import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import StatusBadge from '../../components/complaints/StatusBadge';

const AssignedTickets = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const allData = await api.getComplaints();
                // Filter for tickets assigned to this agent
                const myTickets = allData.filter(c => c.assignedTo === user.id);
                setTickets(myTickets);
            } catch (error) {
                console.error('Failed to fetch tickets:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchTickets();
    }, [user]);

    const filteredTickets = filter === 'All'
        ? tickets
        : tickets.filter(t => t.status === filter);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Assigned Tickets</h1>
                    <p className="text-gray-500 mt-1">Manage and resolve your active cases</p>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
                {['All', 'In Progress', 'Resolved', 'Closed'].map((status) => (
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

            {/* Ticket List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
                <ul className="divide-y divide-gray-200">
                    {filteredTickets.length > 0 ? (
                        filteredTickets.map((ticket) => (
                            <li key={ticket.id}>
                                <Link to={`/agent/tickets/${ticket.id}`} className="block hover:bg-gray-50 transition-colors">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center truncate gap-3">
                                                <div className={`p-1.5 rounded-full flex-shrink-0 ${ticket.priority === 'Critical' ? 'bg-red-100 text-red-600' :
                                                    ticket.priority === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    <AlertCircle size={16} />
                                                </div>
                                                <p className="text-sm font-medium text-indigo-600 truncate">{ticket.title}</p>
                                                <p className="ml-1 flex-shrink-0 font-normal text-gray-500 text-xs bg-gray-100 px-2 py-0.5 rounded-full">#{ticket.id}</p>
                                            </div>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <StatusBadge status={ticket.status} />
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    {ticket.category}
                                                </p>
                                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                    <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                    Updated {new Date(ticket.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <p>
                                                    My Ticket
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-12 text-center text-gray-500">
                            <CheckCircle size={48} className="mx-auto text-gray-300 mb-3" />
                            <p>No tickets found in this category.</p>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default AssignedTickets;
