import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, User, Headset, LayoutGrid, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('customer'); // Default active tab
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('customer');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    // Pre-fill logic specific to the modern design's tabs
    const handleRoleSelect = (role) => {
        setActiveTab(role);
        setSelectedRole(role);
        // Auto-fill for convenience (would remove in prod)
        if (role === 'customer') {
            setEmail('customer@example.com');
            setPassword('password');
        } else if (role === 'agent') {
            setEmail('agent@example.com');
            setPassword('password');
        } else if (role === 'admin') {
            setEmail('admin@example.com');
            setPassword('password');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // In a real app we'd pass the role or let the backend determine it. 
            // Here we just login with the creds, but we check if the user matches the selected role for UX consistency
            const user = await login(email, password);

            // Optional: Check if logged in user actually matches the selected tab role
            // For this mock, the creds determine the user, so we just redirect based on the *actual* user role returned
            setTimeout(() => {
                if (user.role === 'customer') navigate('/customer/dashboard');
                else if (user.role === 'agent') navigate('/agent/dashboard');
                else if (user.role === 'admin') navigate('/admin/dashboard');
            }, 500); // Fake delay for smooth button transition
        } catch (err) {
            setError('Invalid email or password.');
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left Partition - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900 to-gray-900 opacity-90 z-10"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="relative z-20 flex flex-col justify-center px-12 lg:px-20 text-white w-full">
                    <div className="mb-12 flex items-center gap-3">
                        <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                            <ShieldCheck size={32} className="text-indigo-400" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">CCSMS Platform</h1>
                    </div>

                    <h2 className="text-5xl font-extrabold leading-tight mb-6">
                        Resolve Issues <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                            Faster & Better.
                        </span>
                    </h2>

                    <p className="text-lg text-gray-300 mb-8 max-w-md leading-relaxed">
                        The next-generation platform for customer service. Track complaints, manage tickets, and ensure satisfaction with our automated workflows.
                    </p>

                    {/* Social Proofish Design */}
                    <div className="flex items-center gap-4 mt-8">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-700 flex items-center justify-center text-xs font-semibold overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-sm font-bold">10k+ Users</p>
                            <p className="text-xs text-gray-400">Trust our platform</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Partition - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/50">
                <div className="bg-white w-full max-w-md p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 relative">

                    {/* Center Header */}
                    <div className="text-center mb-10">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h3>
                        <p className="text-gray-500">Sign in to continue to your dashboard</p>
                    </div>

                    {/* Role Tabs */}
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        {[
                            { id: 'customer', label: 'Customer', icon: User },
                            { id: 'agent', label: 'Agent', icon: Headset },
                            { id: 'admin', label: 'Admin', icon: LayoutGrid }
                        ].map((role) => (
                            <button
                                key={role.id}
                                onClick={() => handleRoleSelect(role.id)}
                                className={`flex flex-col items-center justify-center py-4 px-2 rounded-xl border transition-all duration-200 group ${activeTab === role.id
                                        ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                                        : 'bg-white border-gray-100 hover:border-indigo-100 hover:bg-gray-50'
                                    }`}
                            >
                                <role.icon
                                    size={24}
                                    className={`mb-2 transition-colors ${activeTab === role.id ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-400'
                                        }`}
                                />
                                <span className={`text-xs font-medium ${activeTab === role.id ? 'text-indigo-900' : 'text-gray-500'
                                    }`}>
                                    {role.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-400 transition-shadow"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-semibold text-gray-700">Password</label>
                                <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-400 transition-shadow"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 text-center animate-pulse">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-200 text-sm font-bold text-white bg-indigo-900 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                Create Account
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
