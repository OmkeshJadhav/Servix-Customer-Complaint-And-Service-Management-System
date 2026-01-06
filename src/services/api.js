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
        // Ensure history is at least an empty array if missing
        history: data.history || []
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
            .select('*');

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

        // List view usually ignores history, but let's initialize it as empty
        return data.map(transformComplaint);
    },

    createComplaint: async (complaintData) => {
        const insertData = {
            title: complaintData.title,
            description: complaintData.description,
            category: complaintData.category,
            priority: complaintData.priority,
            user_id: complaintData.userId,
            status: 'Open',
        };

        const { data, error } = await supabase
            .from('complaints')
            .insert([insertData])
            .select()
            .single();

        if (error) throw error;

        // Add initial history
        const historyData = {
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
            .select('*')
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
                complaint_id: id,
                action: 'Status Change',
                details: `Changed to ${updates.status}`,
                performer: userId,
            }]);
        }
        if (updates.assignedTo) {
            await supabase.from('complaint_history').insert([{
                complaint_id: id,
                action: 'Assigned',
                details: `Assigned to user ${updates.assignedTo}`,
                performer: userId,
            }]);
        }

        return transformComplaint(data);
    }
};
