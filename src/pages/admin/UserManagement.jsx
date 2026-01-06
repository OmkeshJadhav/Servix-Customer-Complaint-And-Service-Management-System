import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { User, Plus, Mail, Shield, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await api.getUsers();
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
                    <p className="text-gray-500 mt-1">Manage system access and roles</p>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-900 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <Plus className="-ml-1 mr-2 h-4 w-4" />
                    Add User
                </button>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {users.map((user) => (
                        <li key={user.id} className="hover:bg-gray-50 transition-colors">
                            <div className="px-6 py-5 flex items-center justify-between">
                                <div className="flex items-center min-w-0 gap-4">
                                    <div className="flex-shrink-0">
                                        {user.avatar ? (
                                            <img className="h-12 w-12 rounded-full bg-gray-300 object-cover border border-gray-200" src={user.avatar} alt="" />
                                        ) : (
                                            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                <User size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate flex items-center gap-2">
                                            {user.name}
                                            {user.id && <span className="text-xs font-normal text-gray-400 font-mono bg-gray-50 px-1 rounded">#{user.id}</span>}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Mail size={12} className="mr-1" />
                                                {user.email}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500 capitalize">
                                                <Shield size={12} className="mr-1" />
                                                {user.role}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                            user.role === 'agent' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                    `}>
                                        {user.role}
                                    </span>

                                    <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                                        <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                    <span>Showing {users.length} users</span>
                    <div className="flex gap-2">
                        {/* Pagination placeholders */}
                        <button className="disabled:opacity-50" disabled>Previous</button>
                        <button className="disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
