-- =========================================================
-- CCSMS - Customer Complaint & Service Management System
-- Full Schema + Seed Data (Single Run)
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- USERS
-- =========================================================
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('customer', 'agent', 'admin')),
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read users" ON public.users FOR SELECT USING (true);

-- =========================================================
-- COMPLAINTS
-- =========================================================
CREATE TABLE public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('Internet', 'Billing', 'Hardware', 'Service', 'Sales')),
    priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    status TEXT NOT NULL CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
    sla_deadline TIMESTAMPTZ,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read complaints" ON public.complaints FOR SELECT USING (true);
CREATE POLICY "Public insert complaints" ON public.complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update complaints" ON public.complaints FOR UPDATE USING (true);

-- =========================================================
-- COMPLAINT HISTORY
-- =========================================================
CREATE TABLE public.complaint_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    performer UUID REFERENCES public.users(id) ON DELETE SET NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.complaint_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read history" ON public.complaint_history FOR SELECT USING (true);
CREATE POLICY "Public insert history" ON public.complaint_history FOR INSERT WITH CHECK (true);

-- =========================================================
-- ATTACHMENTS
-- =========================================================
CREATE TABLE public.attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read attachments" ON public.attachments FOR SELECT USING (true);
CREATE POLICY "Public insert attachments" ON public.attachments FOR INSERT WITH CHECK (true);

-- =========================================================
-- NOTIFICATIONS
-- =========================================================
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('info','warning','success','error')) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Public insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update notifications" ON public.notifications FOR UPDATE USING (true);

-- =========================================================
-- SLA POLICIES
-- =========================================================
CREATE TABLE public.sla_policies (
    priority TEXT PRIMARY KEY,
    hours_to_resolve INTEGER NOT NULL
);

ALTER TABLE public.sla_policies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sla" ON public.sla_policies FOR SELECT USING (true);

INSERT INTO public.sla_policies VALUES
('Low', 48),
('Medium', 24),
('High', 8),
('Critical', 4);

-- =========================================================
-- STORAGE BUCKET
-- =========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-files', 'complaint-files', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Public read files"
ON storage.objects FOR SELECT USING (bucket_id = 'complaint-files');

CREATE POLICY "Public upload files"
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'complaint-files');

-- =========================================================
-- SEED USERS
-- =========================================================
INSERT INTO public.users (name, email, role, avatar) VALUES
('Omkesh Customer', 'customer@example.com', 'customer', 'https://i.pravatar.cc/150?u=1'),
('Rahul Customer', 'customer2@example.com', 'customer', 'https://i.pravatar.cc/150?u=2'),
('Sneha Customer', 'customer3@example.com', 'customer', 'https://i.pravatar.cc/150?u=3'),
('Amit Customer', 'customer4@example.com', 'customer', 'https://i.pravatar.cc/150?u=4'),
('Neha Customer', 'customer5@example.com', 'customer', 'https://i.pravatar.cc/150?u=5'),

('Vinod Agent', 'agent@example.com', 'agent', 'https://i.pravatar.cc/150?u=6'),
('Priya Agent', 'agent2@example.com', 'agent', 'https://i.pravatar.cc/150?u=7'),
('Kunal Agent', 'agent3@example.com', 'agent', 'https://i.pravatar.cc/150?u=8'),

('Admin One', 'admin@example.com', 'admin', 'https://i.pravatar.cc/150?u=9'),
('Admin Two', 'admin2@example.com', 'admin', 'https://i.pravatar.cc/150?u=10');

-- =========================================================
-- SEED COMPLAINTS (15)
-- =========================================================
INSERT INTO public.complaints
(title, description, category, priority, status, user_id, assigned_to)
SELECT
    title, description, category, priority, status,
    (SELECT id FROM users WHERE email = user_email),
    (SELECT id FROM users WHERE email = agent_email)
FROM (
    VALUES
    ('Slow Internet', 'Internet speed very low', 'Internet','High','Open','customer@example.com','agent@example.com'),
    ('Billing charged twice', 'Duplicate billing issue','Billing','Medium','In Progress','customer2@example.com','agent2@example.com'),
    ('Router dead','No power in router','Hardware','Critical','Resolved','customer3@example.com','agent1@example.com'),
    ('WiFi drops','Connection unstable','Internet','Medium','Open','customer4@example.com','agent3@example.com'),
    ('Missed appointment','Technician did not arrive','Service','High','Open','customer5@example.com','agent2@example.com'),
    ('Upgrade plan','Need 1Gbps plan','Sales','Low','Resolved','customer1@example.com','agent3@example.com'),
    ('Payment pending','Payment stuck','Billing','High','Open','customer2@example.com','agent1@example.com'),
    ('Modem noise','Strange noise','Hardware','Medium','In Progress','customer3@example.com','agent2@example.com'),
    ('Static IP','Need static IP','Service','Low','Open','customer4@example.com','agent3@example.com'),
    ('No internet','Total outage','Internet','Critical','In Progress','customer5@example.com','agent1@example.com'),
    ('Refund delay','Refund not processed','Billing','Medium','Open','customer1@example.com','agent2@example.com'),
    ('Cable cut','Wire damaged','Hardware','High','Resolved','customer2@example.com','agent3@example.com'),
    ('Wrong plan','Incorrect plan activated','Sales','Low','Open','customer3@example.com','agent1@example.com'),
    ('Router heating','Overheating issue','Hardware','Medium','In Progress','customer4@example.com','agent2@example.com'),
    ('Installation delay','Delayed setup','Service','High','Open','customer5@example.com','agent3@example.com')
) AS data(title,description,category,priority,status,user_email,agent_email);

-- =========================================================
-- SEED HISTORY (AUTO)
-- =========================================================
INSERT INTO public.complaint_history (complaint_id, action, performer, details)
SELECT
    c.id,
    'Created',
    c.user_id,
    'Complaint created by customer'
FROM public.complaints c;

-- =========================================================
-- SEED ATTACHMENTS
-- =========================================================
INSERT INTO public.attachments (complaint_id, file_url, file_type)
SELECT
    id,
    'https://example.com/mock-file.png',
    'image/png'
FROM public.complaints
LIMIT 5;

-- =========================================================
-- SEED NOTIFICATIONS
-- =========================================================
INSERT INTO public.notifications (user_id, message, type)
SELECT
    id,
    'Welcome to CCSMS platform!',
    'success'
FROM public.users;

-- =========================================================
-- SEED INSERT POLICY
-- =========================================================
CREATE POLICY "Public insert users" ON public.users 
FOR INSERT 
WITH CHECK (true);