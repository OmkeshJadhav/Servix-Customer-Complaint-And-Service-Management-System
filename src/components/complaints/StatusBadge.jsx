const StatusBadge = ({ status }) => {
    const styles = {
        Open: 'bg-blue-100 text-blue-800',
        'In Progress': 'bg-yellow-100 text-yellow-800',
        Resolved: 'bg-green-100 text-green-800',
        Closed: 'bg-gray-100 text-gray-800',
        Escalated: 'bg-red-100 text-red-800',
    };

    const className = styles[status] || 'bg-gray-100 text-gray-800';

    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${className}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
