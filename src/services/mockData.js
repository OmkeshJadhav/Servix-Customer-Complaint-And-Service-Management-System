export const USERS = [
    {
        id: 'u1',
        name: 'Customer Shreya',
        email: 'customer@example.com',
        role: 'customer',
        avatar: 'https://i.pravatar.cc/150?u=u1',
    },
    {
        id: 'u2',
        name: 'Agent Shreya ',
        email: 'agent@example.com',
        role: 'agent',
        avatar: 'https://i.pravatar.cc/150?u=u2',
    },
    {
        id: 'u3',
        name: 'Admin Shreya',
        email: 'admin@example.com',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?u=u3',
    },
    {
        id: 'u4',
        name: 'Customer Dhurandhar',
        email: 'dhurandhar@example.com',
        role: 'customer',
        avatar: 'https://i.pravatar.cc/150?u=u4',
    },
    {
        id: 'u5',
        name: 'Agent Vinod',
        email: 'vinod@example.com',
        role: 'agent',
        avatar: 'https://i.pravatar.cc/150?u=u5',
    },
];

export const COMPLAINTS = [
    {
        id: 'c1',
        title: 'Internet connection is very slow',
        description: 'I have been experiencing very slow internet speeds for the last 3 days. I am unable to attend my online meetings.',
        category: 'Internet',
        priority: 'High',
        status: 'Open',
        createdAt: '2023-10-25T10:00:00Z',
        updatedAt: '2023-10-25T10:00:00Z',
        userId: 'u1',
        assignedTo: null,
        history: [
            {
                id: 'h1',
                action: 'Created',
                timestamp: '2023-10-25T10:00:00Z',
                performer: 'u1',
            }
        ]
    },
    {
        id: 'c2',
        title: 'Billing issue - duplicate charge',
        description: 'I see a duplicate charge of $50 on my latest bill. Please investigate.',
        category: 'Billing',
        priority: 'Medium',
        status: 'In Progress',
        createdAt: '2023-10-24T14:30:00Z',
        updatedAt: '2023-10-25T09:15:00Z',
        userId: 'u1',
        assignedTo: 'u2',
        history: [
            { id: 'h2', action: 'Created', timestamp: '2023-10-24T14:30:00Z', performer: 'u1' },
            { id: 'h3', action: 'Assigned', timestamp: '2023-10-25T09:00:00Z', performer: 'u3' },
            { id: 'h4', action: 'Status Change', timestamp: '2023-10-25T09:15:00Z', performer: 'u2', details: 'Changed status to In Progress' }
        ]
    },
    {
        id: 'c3',
        title: 'Router not powering on',
        description: 'My router died suddenly and is not turning on even after trying different outlets.',
        category: 'Hardware',
        priority: 'Critical',
        status: 'Resolved',
        createdAt: '2023-10-20T08:00:00Z',
        updatedAt: '2023-10-22T16:00:00Z',
        userId: 'u1',
        assignedTo: 'u2',
        history: []
    },
    {
        id: 'c4',
        title: 'Wifi dropping frequently',
        description: 'The wifi connection drops every 10 minutes. Very frustrating.',
        category: 'Internet',
        priority: 'Medium',
        status: 'Open',
        createdAt: '2023-10-26T09:00:00Z',
        updatedAt: '2023-10-26T09:00:00Z',
        userId: 'u4',
        assignedTo: null,
        history: [{ id: 'h5', action: 'Created', timestamp: '2023-10-26T09:00:00Z', performer: 'u4' }]
    },
    {
        id: 'c5',
        title: 'Technician missed appointment',
        description: 'The technician did not show up for the scheduled installation today.',
        category: 'Service',
        priority: 'High',
        status: 'Open',
        createdAt: '2023-10-26T14:00:00Z',
        updatedAt: '2023-10-26T14:00:00Z',
        userId: 'u4',
        assignedTo: null,
        history: [{ id: 'h6', action: 'Created', timestamp: '2023-10-26T14:00:00Z', performer: 'u4' }]
    },
    {
        id: 'c6',
        title: 'Need upgrade to higher speed plan',
        description: 'I want to upgrade to the 1Gbps plan. How do I proceed?',
        category: 'Sales',
        priority: 'Low',
        status: 'Resolved',
        createdAt: '2023-10-15T10:00:00Z',
        updatedAt: '2023-10-16T11:00:00Z',
        userId: 'u1',
        assignedTo: 'u5',
        history: [
            { id: 'h7', action: 'Created', timestamp: '2023-10-15T10:00:00Z', performer: 'u1' },
            { id: 'h8', action: 'Resolved', timestamp: '2023-10-16T11:00:00Z', performer: 'u5', details: 'Plan upgraded' }
        ]
    },
    {
        id: 'c7',
        title: 'Payment processed twice',
        description: 'My credit card shows two pending transactions for the same amount.',
        category: 'Billing',
        priority: 'High',
        status: 'Open',
        createdAt: '2023-10-27T08:30:00Z',
        updatedAt: '2023-10-27T08:30:00Z',
        userId: 'u4',
        assignedTo: null,
        history: [{ id: 'h9', action: 'Created', timestamp: '2023-10-27T08:30:00Z', performer: 'u4' }]
    },
    {
        id: 'c8',
        title: 'Modem making weird noise',
        description: 'There is a high pitched noise coming from the modem.',
        category: 'Hardware',
        priority: 'Medium',
        status: 'In Progress',
        createdAt: '2023-10-25T16:00:00Z',
        updatedAt: '2023-10-26T10:00:00Z',
        userId: 'u4',
        assignedTo: 'u5',
        history: [
            { id: 'h10', action: 'Created', timestamp: '2023-10-25T16:00:00Z', performer: 'u4' },
            { id: 'h11', action: 'Assigned', timestamp: '2023-10-26T09:00:00Z', performer: 'u3' }
        ]
    },
    {
        id: 'c9',
        title: 'Request for static IP',
        description: 'I need a static IP for my home server setup.',
        category: 'Service',
        priority: 'Low',
        status: 'Open',
        createdAt: '2023-10-27T11:00:00Z',
        updatedAt: '2023-10-27T11:00:00Z',
        userId: 'u1',
        assignedTo: null,
        history: [{ id: 'h12', action: 'Created', timestamp: '2023-10-27T11:00:00Z', performer: 'u1' }]
    }
];

// Mock API functions to simulate async database calls
export const mockApi = {
    login: async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = USERS.find(u => u.email === email);
                if (user) {
                    // In a real app we would check password
                    resolve({ user, token: 'mock-jwt-token' });
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 500);
        });
    },

    getComplaints: async (filters = {}) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let data = [...COMPLAINTS];
                if (filters.userId) {
                    data = data.filter(c => c.userId === filters.userId);
                }
                if (filters.assignedTo) {
                    data = data.filter(c => c.assignedTo === filters.assignedTo);
                }
                if (filters.status) {
                    data = data.filter(c => c.status === filters.status);
                }
                resolve(data);
            }, 500);
        });
    },

    createComplaint: async (complaintData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newComplaint = {
                    id: `c${Date.now()}`,
                    ...complaintData,
                    status: 'Open',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    history: [{
                        id: `h${Date.now()}`,
                        action: 'Created',
                        timestamp: new Date().toISOString(),
                        performer: complaintData.userId
                    }]
                };
                COMPLAINTS.push(newComplaint); // In-memory update
                resolve(newComplaint);
            }, 500);
        });
    },

    getComplaintById: async (id) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const complaint = COMPLAINTS.find(c => c.id === id);
                if (complaint) {
                    resolve(complaint);
                } else {
                    reject(new Error('Complaint not found'));
                }
            }, 500);
        });
    },

    updateComplaint: async (id, updates, userId) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = COMPLAINTS.findIndex(c => c.id === id);
                if (index !== -1) {
                    const updatedComplaint = {
                        ...COMPLAINTS[index],
                        ...updates,
                        updatedAt: new Date().toISOString()
                    };

                    // Add history entry if status or assignment changed
                    if (updates.status && updates.status !== COMPLAINTS[index].status) {
                        updatedComplaint.history.push({
                            id: `h${Date.now()}`,
                            action: 'Status Change',
                            details: `Changed to ${updates.status}`,
                            timestamp: new Date().toISOString(),
                            performer: userId
                        });
                    }
                    if (updates.assignedTo && updates.assignedTo !== COMPLAINTS[index].assignedTo) {
                        updatedComplaint.history.push({
                            id: `h${Date.now()}_assign`,
                            action: 'Assigned',
                            details: `Assigned to user ${updates.assignedTo}`, // Simplified
                            timestamp: new Date().toISOString(),
                            performer: userId
                        });
                    }

                    COMPLAINTS[index] = updatedComplaint;
                    resolve(updatedComplaint);
                } else {
                    reject(new Error('Complaint not found'));
                }
            }, 500);
        });
    }
};
