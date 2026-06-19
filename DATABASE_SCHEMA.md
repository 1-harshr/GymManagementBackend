# Database Schema

## Overview

The database consists of four tables supporting a gym management system: user accounts, membership plans, member subscriptions, and attendance tracking.

---

## Tables

### `users`

Stores all system users — both staff (admins/trainers) and gym members.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `user_id` | bigint | PK, NOT NULL | |
| `name` | text | NOT NULL | Defaults to `""` |
| `phone_number` | text | NOT NULL, UNIQUE | Primary contact identifier |
| `email` | text | | Optional |
| `user_role` | user_role (enum) | NOT NULL | Defaults to `MEMBER` |
| `created_at` | timestamptz | NOT NULL | Defaults to `now()` |

**Notes:**
- `user_role` is a custom enum type. Known values: `MEMBER`, and at least one admin/staff role.
- `phone_number` is the unique identifier used for login/lookup.

---

### `plans`

Defines available membership plan templates that can be assigned to members.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | bigint | PK, IDENTITY | Auto-generated |
| `plan_name` | text | NOT NULL | |
| `price` | bigint | NOT NULL | Stored in smallest currency unit (e.g. paise) |
| `days_alloted` | bigint | NOT NULL | Duration of the plan in days |
| `is_active` | boolean | NOT NULL | Soft-delete / visibility flag |
| `created_by` | bigint | NOT NULL | FK → `users.user_id` |
| `created_at` | timestamptz | NOT NULL | Defaults to `now()` |

**Notes:**
- `is_active = false` effectively archives a plan without deleting it.
- `created_by` tracks which staff member created the plan.

---

### `memberships`

Records a member's subscription to a plan — one row per enrollment event.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `subscription_id` | bigint | PK, IDENTITY | Auto-generated |
| `member_id` | bigint | NOT NULL | FK → `users.user_id` |
| `plan_id` | bigint | NOT NULL | FK → `plans.id` |
| `start_date` | timestamptz | NOT NULL | When the subscription begins |
| `created_by` | bigint | NOT NULL | FK → `users.user_id` (staff who enrolled the member) |
| `created_at` | timestamptz | NOT NULL | Defaults to `now()` |

**Notes:**
- End date is not stored explicitly; it is derived as `start_date + plans.days_alloted`.
- A member can have multiple rows (renewals, plan changes).
- The active membership is the most recent one whose derived end date is in the future.

---

### `attendance`

Logs each gym visit by a user.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `attendance_id` | bigint | PK, IDENTITY | Auto-generated |
| `user_id` | bigint | NOT NULL | FK → `users.user_id` |
| `created_at` | timestamptz | NOT NULL | Defaults to `now()` — the check-in timestamp |

**Notes:**
- One row = one check-in event.
- `created_at` serves as the attendance timestamp; no explicit `checked_in_at` column is needed.

---

## Relationships

```
users ──< memberships >── plans
users ──< attendance
users ──< plans (created_by)
users ──< memberships (created_by)
```

---

## Derived Values

| Value | How to compute |
|---|---|
| Membership end date | `memberships.start_date + interval '1 day' * plans.days_alloted` |
| Active membership | Latest `memberships` row where end date > `now()` |
| Total visits | `COUNT(*)` on `attendance` grouped by `user_id` |
| Visits in current cycle | `attendance` rows where `created_at` is between `start_date` and end date |
