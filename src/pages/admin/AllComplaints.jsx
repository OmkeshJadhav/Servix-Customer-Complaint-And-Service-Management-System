import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import StatusBadge from '../../components/complaints/StatusBadge';
import { Search, Filter, Download, ArrowRight, SlidersHorizontal } from 'lucide-react';

const AllComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const data = await api.getComplaints();
                setComplaints(data);
            } catch (error) {
                console.error('Failed to fetch complaints:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, []);

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'All' || c.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const handleExport = () => {
        try {
            const dataToExport = complaints;
            if (!dataToExport.length) {
                alert("No data to export");
                return;
            }

            const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'Created At', 'Assigned To'];
            const csvContent = [
                headers.join(','),
                ...dataToExport.map(c => {
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
            link.setAttribute('download', `complaints_full_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Export failed:", err);
            alert("Failed to export.");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Master Complaint List</h1>
                    <p className="text-gray-500 mt-1">View and manage all tickets across the system</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                        <Download className="-ml-1 mr-2 h-4 w-4 text-gray-500" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Search by ID or Title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                    {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setActiveFilter(status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${activeFilter === status
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket ID</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredComplaints.length > 0 ? (
                                filteredComplaints.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">#{c.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 line-clamp-1">{c.title}</div>
                                            <div className="text-xs text-gray-500">{c.category}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={c.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                              ${c.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                                                    c.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }
                          `}>
                                                {c.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(c.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link to={`/admin/complaints/${c.id}`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center">
                                                View <ArrowRight size={14} className="ml-1" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No complaints found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllComplaints;
