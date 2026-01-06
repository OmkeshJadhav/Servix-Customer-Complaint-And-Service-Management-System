-- Enable UUID extension if we want to use auto-generated UUIDs in future (optional but recommended)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY, -- Using TEXT to match mock data IDs like 'u1'. In production, prefer UUID.
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('customer', 'agent', 'admin')) NOT NULL,
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Complaints Table
CREATE TABLE IF NOT EXISTS public.complaints (
    id TEXT PRIMARY KEY, -- Using TEXT to match mock IDs 'c1'
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('Internet', 'Billing', 'Hardware', 'Service', 'Sales')),
    priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low', 'Critical')),
    status TEXT NOT NULL CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    assigned_to TEXT REFERENCES public.users(id) ON DELETE SET NULL
);

-- 3. Create History Table
CREATE TABLE IF NOT EXISTS public.complaint_history (
    id TEXT PRIMARY KEY, -- Using TEXT to match mock IDs 'h1'
    complaint_id TEXT REFERENCES public.complaints(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL,
    performer TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    details TEXT
);

-- 4. Enable Row Level Security (RLS) - Recommended
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_history ENABLE ROW LEVEL SECURITY;

-- Policy examples (open access for demo purposes - RESTRICT IN PRODUCTION)
CREATE POLICY "Allow public read access" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.complaints FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.complaint_history FOR SELECT USING (true);

-- 5. Seed Data (Mock Data)

-- Insert Users
INSERT INTO public.users (id, name, email, role, avatar) VALUES
('u1', 'Customer Omkesh', 'customer@example.com', 'customer', 'https://i.pravatar.cc/150?u=u1'),
('u2', 'Agent Omkesh ', 'agent@example.com', 'agent', 'https://i.pravatar.cc/150?u=u2'),
('u3', 'Admin Omkesh', 'admin@example.com', 'admin', 'https://i.pravatar.cc/150?u=u3'),
('u4', 'Customer Dhurandhar', 'dhurandhar@example.com', 'customer', 'https://i.pravatar.cc/150?u=u4'),
('u5', 'Agent Vinod', 'vinod@example.com', 'agent', 'https://i.pravatar.cc/150?u=u5')
ON CONFLICT (id) DO NOTHING;

-- Insert Complaints
INSERT INTO public.complaints (id, title, description, category, priority, status, created_at, updated_at, user_id, assigned_to) VALUES
('c1', 'Internet connection is very slow', 'I have been experiencing very slow internet speeds for the last 3 days. I am unable to attend my online meetings.', 'Internet', 'High', 'Open', '2023-10-25T10:00:00Z', '2023-10-25T10:00:00Z', 'u1', NULL),
('c2', 'Billing issue - duplicate charge', 'I see a duplicate charge of $50 on my latest bill. Please investigate.', 'Billing', 'Medium', 'In Progress', '2023-10-24T14:30:00Z', '2023-10-25T09:15:00Z', 'u1', 'u2'),
('c3', 'Router not powering on', 'My router died suddenly and is not turning on even after trying different outlets.', 'Hardware', 'Critical', 'Resolved', '2023-10-20T08:00:00Z', '2023-10-22T16:00:00Z', 'u1', 'u2'),
('c4', 'Wifi dropping frequently', 'The wifi connection drops every 10 minutes. Very frustrating.', 'Internet', 'Medium', 'Open', '2023-10-26T09:00:00Z', '2023-10-26T09:00:00Z', 'u4', NULL),
('c5', 'Technician missed appointment', 'The technician did not show up for the scheduled installation today.', 'Service', 'High', 'Open', '2023-10-26T14:00:00Z', '2023-10-26T14:00:00Z', 'u4', NULL),
('c6', 'Need upgrade to higher speed plan', 'I want to upgrade to the 1Gbps plan. How do I proceed?', 'Sales', 'Low', 'Resolved', '2023-10-15T10:00:00Z', '2023-10-16T11:00:00Z', 'u1', 'u5'),
('c7', 'Payment processed twice', 'My credit card shows two pending transactions for the same amount.', 'Billing', 'High', 'Open', '2023-10-27T08:30:00Z', '2023-10-27T08:30:00Z', 'u4', NULL),
('c8', 'Modem making weird noise', 'There is a high pitched noise coming from the modem.', 'Hardware', 'Medium', 'In Progress', '2023-10-25T16:00:00Z', '2023-10-26T10:00:00Z', 'u4', 'u5'),
('c9', 'Request for static IP', 'I need a static IP for my home server setup.', 'Service', 'Low', 'Open', '2023-10-27T11:00:00Z', '2023-10-27T11:00:00Z', 'u1', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert Complaint History
INSERT INTO public.complaint_history (id, complaint_id, action, timestamp, performer, details) VALUES
('h1', 'c1', 'Created', '2023-10-25T10:00:00Z', 'u1', NULL),
('h2', 'c2', 'Created', '2023-10-24T14:30:00Z', 'u1', NULL),
('h3', 'c2', 'Assigned', '2023-10-25T09:00:00Z', 'u3', NULL),
('h4', 'c2', 'Status Change', '2023-10-25T09:15:00Z', 'u2', 'Changed status to In Progress'),
('h5', 'c4', 'Created', '2023-10-26T09:00:00Z', 'u4', NULL),
('h6', 'c5', 'Created', '2023-10-26T14:00:00Z', 'u4', NULL),
('h7', 'c6', 'Created', '2023-10-15T10:00:00Z', 'u1', NULL),
('h8', 'c6', 'Resolved', '2023-10-16T11:00:00Z', 'u5', 'Plan upgraded'),
('h9', 'c7', 'Created', '2023-10-27T08:30:00Z', 'u4', NULL),
('h10', 'c8', 'Created', '2023-10-25T16:00:00Z', 'u4', NULL),
('h11', 'c8', 'Assigned', '2023-10-26T09:00:00Z', 'u3', NULL),
('h12', 'c9', 'Created', '2023-10-27T11:00:00Z', 'u1', NULL)
ON CONFLICT (id) DO NOTHING;
