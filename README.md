# Gym Management API

Base URL: `/api`

All endpoints except `POST /api/auth/login` require a `Bearer <token>` in the `Authorization` header.

### Authorization levels

| Role     | Description                  |
|----------|------------------------------|
| `MEMBER` | Regular gym member (default) |
| `ADMIN`  | Staff / gym admin            |
| `GOD`    | Super admin                  |

> Endpoints marked **Admin only** require `ADMIN` or `GOD` role. Any other role receives `403 Forbidden`.

---

## Auth

### POST `/api/auth/login`
**Public** — no token required.

**Request**
```json
{
  "phoneNumber": "9876543210",
  "password": "secret"
}
```

**Response `200`**
```json
{
  "token": "<jwt>"
}
```

---

## Users
> All endpoints in this section are **Admin only**.

### GET `/api/users`
Returns all users.

**Response `200`**
```json
[
  {
    "userId": 1,
    "name": "John Doe",
    "phoneNumber": "9876543210",
    "email": "john@example.com",
    "userRole": "MEMBER",
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```

---

### GET `/api/users/{id}`
Returns a single user by ID.

**Response `200`** — same shape as above.

**Response `404`** — user not found.

---

### POST `/api/users`
Create a new user.

**Request**
```json
{
  "name": "Jane Doe",
  "phoneNumber": "9876543211",
  "email": "jane@example.com",
  "password": "secret",
  "userRole": "MEMBER"
}
```
> `email` is optional. `userRole` defaults to `MEMBER`.

**Response `201`** — created user.

---

### PATCH `/api/users/{id}`
Partially update a user. All fields are optional.

**Request**
```json
{
  "name": "Jane Smith",
  "phoneNumber": "9876543212",
  "email": "jane.smith@example.com",
  "userRole": "ADMIN"
}
```

**Response `200`** — updated user.

---

### DELETE `/api/users/{id}`
Delete a user.

**Response `204`** — no content.

**Response `404`** — user not found.

---

## Plans

### GET `/api/v1/plans`
**Any authenticated user.** Returns all plans. Supports optional query filters.

| Query param | Type    | Description                      |
|-------------|---------|----------------------------------|
| `name`      | string  | Case-insensitive name contains   |
| `isActive`  | boolean | Filter by active/inactive status |

**Response `200`**
```json
[
  {
    "id": 1,
    "planName": "Monthly",
    "price": 99900,
    "daysAlloted": 30,
    "isActive": true,
    "createdBy": 1,
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```
> `price` is stored in the smallest currency unit (e.g. paise).

---

### POST `/api/v1/plans`
**Admin only.** Create a new plan. `createdBy` is resolved from the token.

**Request**
```json
{
  "planName": "Monthly",
  "price": 99900,
  "daysAlloted": 30
}
```

**Response `201`** — created plan.

**Response `403`** — caller is not an admin.

---

### PUT `/api/v1/plans/{id}`
**Admin only.** Update an existing plan. All fields are optional.

**Request**
```json
{
  "planName": "Monthly Plus",
  "price": 129900,
  "daysAlloted": 31,
  "isActive": false
}
```
> Set `isActive: false` to soft-deactivate a plan.

**Response `200`** — updated plan.

**Response `403`** — caller is not an admin.

---

## Memberships
> All endpoints in this section are **Admin only**.

### GET `/api/v1/memberships`
Returns all membership subscriptions.

**Response `200`**
```json
[
  {
    "subscriptionId": 1,
    "memberId": 2,
    "planId": 1,
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-31T00:00:00Z",
    "createdBy": 1,
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```
> `endDate` is derived: `startDate + plan.daysAlloted`.

---

### GET `/api/v1/memberships/{id}`
Returns a single membership by `subscriptionId`.

**Response `200`** — same shape as above.

**Response `404`** — membership not found.

---

### POST `/api/v1/memberships/{id}`
Create a membership for user `{id}`. `createdBy` is resolved from the token.

**Request**
```json
{
  "planId": 1,
  "startDate": "2024-02-01T00:00:00Z"
}
```

**Response `201`** — created membership with derived `endDate`.

**Response `403`** — caller is not an admin.

**Response `404`** — user or plan not found.

---

## Attendance
> All endpoints in this section are **Admin only**.

### GET `/api/v1/attendance`
Returns all attendance records.

**Response `200`**
```json
[
  {
    "attendanceId": 1,
    "userId": 2,
    "createdAt": "2024-01-15T09:30:00Z"
  }
]
```
> `createdAt` is the check-in timestamp.

---

### POST `/api/v1/attendance/{userId}`
Mark attendance for a member.

**No request body required.**

**Response `201`**
```json
{
  "attendanceId": 42,
  "userId": 2,
  "createdAt": "2024-01-15T09:30:00Z"
}
```

**Response `403`** — caller is not an admin.

**Response `404`** — member not found.

---

## Error Responses

All errors follow a standard shape:

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "User 99 not found"
}
```

| Status | Meaning                  |
|--------|--------------------------|
| `400`  | Validation error         |
| `401`  | Missing or invalid token |
| `403`  | Insufficient role        |
| `404`  | Resource not found       |
| `500`  | Internal server error    |
