-- =============================================================
-- Gym Management — Seed Data
-- All passwords are BCrypt hashes of: password
-- =============================================================

-- ---------------------------------------------------------------
-- Users
-- Schema: user_id, name, phone_number, email, user_role, created_at
-- hashed_password is updated separately after insert
-- ---------------------------------------------------------------
-- BCrypt hash corresponds to plain-text password: password
INSERT INTO public.users (user_id, name, phone_number, email, user_role, hashed_password) VALUES
  (1, 'Super Admin',  '9000000001', 'admin@gym.com',  'ADMIN',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
  (2, 'Ravi Sharma',  '9000000002', 'ravi@gym.com',   'ADMIN',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
  (3, 'Priya Mehta',  '9000000003', 'priya@gym.com',  'ADMIN',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
  (4, 'Aarav Patel',  '9000000004', 'aarav@gym.com',  'MEMBER', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
  (5, 'Sneha Nair',   '9000000005', 'sneha@gym.com',  'MEMBER', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
  (6, 'Karan Joshi',  '9000000006', null,             'MEMBER', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
  (7, 'Divya Rao',    '9000000007', 'divya@gym.com',  'MEMBER', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
  (8, 'Manav Singh',  '9000000008', null,             'MEMBER', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

-- ---------------------------------------------------------------
-- Plans
-- Schema: id (identity), plan_name, price, days_alloted, is_active, created_by, created_at
-- price is in paise (₹999 = 99900)
-- ---------------------------------------------------------------
INSERT INTO public.plans (id, plan_name, price, days_alloted, is_active, created_by) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Monthly',      99900,  30,  true,  2),
  (2, 'Quarterly',   249900,  90,  true,  2),
  (3, 'Half-Yearly', 449900, 180,  true,  2),
  (4, 'Annual',      799900, 365,  true,  1),
  (5, 'Trial',        29900,   7,  false, 3);

-- ---------------------------------------------------------------
-- Memberships
-- Schema: subscription_id (identity), member_id, plan_id, start_date, created_by, created_at
-- endDate is derived in app: start_date + days_alloted
-- ---------------------------------------------------------------
INSERT INTO public.memberships (member_id, plan_id, start_date, created_by) VALUES
  (4, 1, NOW() - INTERVAL '10 days', 2),
  (5, 2, NOW() - INTERVAL '20 days', 2),
  (6, 4, NOW() - INTERVAL '60 days', 1),
  (7, 3, NOW() - INTERVAL '30 days', 3),
  (8, 1, NOW() - INTERVAL '45 days', 2),
  (8, 2, NOW() - INTERVAL '5 days',  2);

-- ---------------------------------------------------------------
-- Attendance
-- Schema: attendance_id (identity), user_id, created_at
-- created_at serves as the check-in timestamp
-- ---------------------------------------------------------------
INSERT INTO public.attendance (user_id, created_at) VALUES
  (4, NOW() - INTERVAL '9 days'),
  (4, NOW() - INTERVAL '8 days'),
  (4, NOW() - INTERVAL '6 days'),
  (4, NOW() - INTERVAL '5 days'),
  (4, NOW() - INTERVAL '3 days'),
  (4, NOW() - INTERVAL '1 day'),
  (4, NOW()),

  (5, NOW() - INTERVAL '18 days'),
  (5, NOW() - INTERVAL '16 days'),
  (5, NOW() - INTERVAL '14 days'),
  (5, NOW() - INTERVAL '12 days'),
  (5, NOW() - INTERVAL '10 days'),
  (5, NOW() - INTERVAL '8 days'),
  (5, NOW() - INTERVAL '6 days'),
  (5, NOW() - INTERVAL '4 days'),
  (5, NOW() - INTERVAL '2 days'),

  (6, NOW() - INTERVAL '50 days'),
  (6, NOW() - INTERVAL '40 days'),
  (6, NOW() - INTERVAL '30 days'),
  (6, NOW() - INTERVAL '15 days'),
  (6, NOW() - INTERVAL '7 days'),

  (7, NOW() - INTERVAL '25 days'),
  (7, NOW() - INTERVAL '20 days'),
  (7, NOW() - INTERVAL '15 days'),
  (7, NOW() - INTERVAL '10 days'),
  (7, NOW() - INTERVAL '5 days'),
  (7, NOW()),

  (8, NOW() - INTERVAL '44 days'),
  (8, NOW() - INTERVAL '42 days'),
  (8, NOW() - INTERVAL '4 days'),
  (8, NOW() - INTERVAL '2 days'),
  (8, NOW());
