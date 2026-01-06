import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, CheckCircle, Upload, ArrowLeft, X, FileText } from 'lucide-react';

const NewComplaint = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        category: 'Internet', // Default
        priority: 'Low',
        description: '',
    });
    const [files, setFiles] = useState([]);
    const [uploadingFiles, setUploadingFiles] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            if (!formData.title || !formData.description) {
                throw new Error('Please fill in all required fields');
            }

            // 1. Upload files first
            let uploadedAttachments = [];
            if (files.length > 0) {
                setUploadingFiles(true);
                const uploadPromises = files.map(file => api.uploadFile(file));
                try {
                    uploadedAttachments = await Promise.all(uploadPromises);
                } catch (uploadErr) {
                    console.error("Upload error", uploadErr);
                    throw new Error("Failed to upload attachments. Please try again.");
                } finally {
                    setUploadingFiles(false);
                }
            }

            // 2. Create Complaint with attachments
            await api.createComplaint({
                ...formData,
                userId: user.id,
                attachments: uploadedAttachments
            });

            setSuccess('Complaint submitted successfully!');
            setTimeout(() => {
                navigate('/customer/complaints');
            }, 1500);
        } catch (err) {
            setError(err.message || 'Failed to submit complaint');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                </button>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Submit New Ticket</h1>
                <p className="text-gray-500 mt-2">Describe your issue and we'll get it resolved as soon as possible.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Progress Indicator */}
                <div className="h-1 w-full bg-gray-100">
                    <div className="h-1 bg-indigo-600 w-1/3"></div>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-100 rounded-lg p-4 flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                            <p className="text-sm text-green-700 font-medium">{success}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Subject / Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 border transition-colors"
                                    placeholder="E.g., Internet Connection Dropping"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 border bg-white"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option value="Internet">Internet</option>
                                        <option value="Billing">Billing</option>
                                        <option value="Hardware">Hardware</option>
                                        <option value="Service">Service</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Priority
                                    </label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 border bg-white"
                                        value={formData.priority}
                                        onChange={handleChange}
                                    >
                                        <option value="Low">Low (48h SLA)</option>
                                        <option value="Medium">Medium (24h SLA)</option>
                                        <option value="High">High (8h SLA)</option>
                                        <option value="Critical">Critical (4h SLA)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={5}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-3 border"
                                    placeholder="Please describe the issue in detail..."
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* File Upload UI */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Attachments</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group relative">
                                    <div className="space-y-1 text-center">
                                        <div className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500 transition-colors flex items-center justify-center rounded-full bg-gray-50 group-hover:bg-indigo-50">
                                            <Upload size={24} />
                                        </div>
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                            >
                                                <span>Upload files</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    multiple
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Images, PDF up to 10MB
                                        </p>
                                    </div>
                                </div>

                                {/* File List Preview */}
                                {files.length > 0 && (
                                    <ul className="mt-4 space-y-2">
                                        {files.map((file, idx) => (
                                            <li key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                                        <FileText size={16} />
                                                    </div>
                                                    <div className="text-sm">
                                                        <p className="font-medium text-gray-700 truncate max-w-xs">{file.name}</p>
                                                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(idx)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                            <button
                                type="button"
                                className="px-5 py-2.5 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
                                onClick={() => navigate('/customer/complaints')}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`inline-flex items-center justify-center px-5 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {uploadingFiles ? 'Uploading Files...' : 'Submitting...'}
                                    </>
                                ) : 'Submit Ticket'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewComplaint;
