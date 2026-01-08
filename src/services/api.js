import { supabase } from './supabaseClient';

// Helper to transform Snake Case DB fields to Camel Case App fields
const transformComplaint = (data) => {
    if (!data) return null;
    return {
        ...data,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        userId: data.user_id,
        assignedTo: data.assigned_to,
        slaDeadline: data.sla_deadline,
        // Ensure history is at least an empty array if missing
        history: data.history || [],
        // Ensure attachments is an array
        attachments: data.attachments || []
    };
};

const transformUser = (data) => {
    if (!data) return null;
    return {
        ...data,
        createdAt: data.created_at,
    };
};

export const api = {
    signup: async (userData) => {
        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('email')
            .eq('email', userData.email)
            .single();

        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Insert new user
        const { data, error } = await supabase
            .from('users')
            .insert([{
                name: userData.name,
                email: userData.email,
                role: userData.role || 'customer',
                avatar: userData.avatar || `https://i.pravatar.cc/150?u=${Date.now()}`
            }])
            .select()
            .single();

        if (error) {
            throw new Error(error.message || 'Failed to create account');
        }

        return { user: transformUser(data), token: 'mock-jwt-token-supabase' };
    },

    login: async (email, password) => {
        // SIMULATED LOGIN against public.users table
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) {
            throw new Error('Invalid credentials');
        }

        return { user: transformUser(data), token: 'mock-jwt-token-supabase' };
    },

    getUsers: async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*');

        if (error) throw error;
        return data.map(transformUser);
    },

    getComplaints: async (filters = {}) => {
        let query = supabase
            .from('complaints')
            .select('*, attachments(*)'); // Fetch attachments with complaints

        if (filters.userId) {
            query = query.eq('user_id', filters.userId);
        }
        if (filters.assignedTo) {
            query = query.eq('assigned_to', filters.assignedTo);
        }
        if (filters.status) {
            query = query.eq('status', filters.status);
        }

        const { data, error } = await query;
        if (error) throw error;

        return data.map(transformComplaint);
    },

    // NEW: File Upload Logic
    uploadFile: async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
            .from('complaint-files')
            .upload(filePath, file);

        if (error) throw error;

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('complaint-files')
            .getPublicUrl(filePath);

        return {
            url: publicUrl,
            type: file.type,
            name: file.name
        };
    },

    createComplaint: async (complaintData) => {
        // 1. Calculate SLA Deadline
        let hoursToAdd = 48; // Default Low
        if (complaintData.priority === 'Medium') hoursToAdd = 24;
        if (complaintData.priority === 'High') hoursToAdd = 8;
        if (complaintData.priority === 'Critical') hoursToAdd = 4;

        const deadline = new Date();
        deadline.setHours(deadline.getHours() + hoursToAdd);

        // 2. Auto-Assignment Logic (Dynamic UUID Lookup)
        let autoAssignedTo = null;
        if (complaintData.category === 'Internet' || complaintData.category === 'Hardware') {
            // Fetch an agent to assign to (e.g., matching email or just the first available agent)
            // Ideally, you'd fetch this from the DB. For now, we'll try to find 'agent@example.com' 
            // from the users table users if we can, or leave it null for manual assignment to avoid UUID errors.
            const { data: agent } = await supabase
                .from('users')
                .select('id')
                .eq('role', 'agent')
                .limit(1)
                .single();

            if (agent) autoAssignedTo = agent.id;
        }

        const insertData = {
            // id: `c${Date.now()}`,  <-- REMOVE THIS. Let the DB generate the UUID.
            title: complaintData.title,
            description: complaintData.description,
            category: complaintData.category,
            priority: complaintData.priority,
            user_id: complaintData.userId,
            status: 'Open',
            sla_deadline: deadline.toISOString(),
            assigned_to: autoAssignedTo
        };

        const { data, error } = await supabase
            .from('complaints')
            .insert([insertData])
            .select()
            .single();

        if (error) throw error;

        // 2. Insert Attachments if any
        if (complaintData.attachments && complaintData.attachments.length > 0) {
            const attachmentInserts = complaintData.attachments.map(att => ({
                complaint_id: data.id,
                file_url: att.url,
                file_type: att.type
            }));

            const { error: attError } = await supabase
                .from('attachments')
                .insert(attachmentInserts);

            if (attError) console.error("Attachment link failed", attError);
        }

        // 3. Add initial history
        const historyData = {
            // id: ... Let DB generate UUID
            complaint_id: data.id,
            action: 'Created',
            performer: insertData.user_id,
        };

        const { data: historyEntry, error: historyError } = await supabase
            .from('complaint_history')
            .insert([historyData])
            .select()
            .single();

        const result = transformComplaint(data);
        result.history = [historyEntry];
        return result;
    },

    getComplaintById: async (id) => {
        const { data, error } = await supabase
            .from('complaints')
            .select('*, attachments(*)')
            .eq('id', id)
            .single();

        if (error) throw error;

        // Fetch history
        const { data: historyData, error: historyError } = await supabase
            .from('complaint_history')
            .select('*')
            .eq('complaint_id', id)
            .order('timestamp', { ascending: true });

        const complaint = transformComplaint(data);
        complaint.history = historyData || [];
        return complaint;
    },

    updateComplaint: async (id, updates, userId) => {
        // Map updates to snake_case
        const dbUpdates = {};
        if (updates.status) dbUpdates.status = updates.status;
        if (updates.assignedTo) dbUpdates.assigned_to = updates.assignedTo;
        if (updates.priority) dbUpdates.priority = updates.priority;

        dbUpdates.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('complaints')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Create history entry
        if (updates.status) {
            await supabase.from('complaint_history').insert([{
                // id: ... Let DB generate
                complaint_id: id,
                action: 'Status Change',
                details: `Changed to ${updates.status}`,
                performer: userId,
            }]);

            // Notification Trigger (simulated)
            await supabase.from('notifications').insert([{
                user_id: data.user_id,
                message: `Your ticket #${id} status changed to ${updates.status}`,
                type: 'info'
            }]);
        }
        if (updates.assignedTo) {
            await supabase.from('complaint_history').insert([{
                // id: ... Let DB generate
                complaint_id: id,
                action: 'Assigned',
                details: `Assigned to user ${updates.assignedTo}`,
                performer: userId,
            }]);
        }

        return transformComplaint(data);
    }
};
