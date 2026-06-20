const BASE_URL = ''

// ── Auth storage ──────────────────────────────────────────────────────────────

export type Role = 'MEMBER' | 'ADMIN' | 'GOD'

export interface AuthData {
  token: string
  role: Role
}

export function getAuth(): AuthData | null {
  const raw = localStorage.getItem('auth')
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthData
  } catch {
    return null
  }
}

export function setAuth(data: AuthData) {
  localStorage.setItem('auth', JSON.stringify(data))
}

export function clearAuth() {
  localStorage.removeItem('auth')
}

export function isAdminOrGod(): boolean {
  const auth = getAuth()
  return auth?.role === 'ADMIN' || auth?.role === 'GOD'
}

// ── Fetch helper ──────────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const auth = getAuth()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (auth) {
    headers['Authorization'] = `Bearer ${auth.token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 401 || res.status === 403) {
    clearAuth()
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  if (res.status === 204) {
    return undefined as T
  }

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }

  return res.json() as Promise<T>
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UserResponse {
  userId: number
  name: string
  phoneNumber: string
  email?: string
  userRole: Role
  createdAt: string
}

export interface PlanResponse {
  id: number
  planName: string
  price: number
  daysAlloted: number
  isActive: boolean
  createdBy?: string
  createdAt: string
}

export interface UserMemberShipDto {
  subscriptionId: number
  memberId: number
  planId: number
  startDate: string
  endDate: string
  createdBy?: string
  createdAt: string
}

export interface AttendanceResponse {
  attendanceId: number
  userId: number
  createdAt: string
}

// ── Auth API ──────────────────────────────────────────────────────────────────

export async function login(phoneNumber: string, password: string): Promise<AuthData> {
  const data = await request<{ token: string; role: Role }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber, password }),
  })
  return { token: data.token, role: data.role }
}

// ── Users API ─────────────────────────────────────────────────────────────────

export function getUsers(): Promise<UserResponse[]> {
  return request('/api/users')
}

export function createUser(body: {
  name: string
  phoneNumber: string
  email?: string
  password: string
  userRole?: Role
}): Promise<UserResponse> {
  return request('/api/users', { method: 'POST', body: JSON.stringify(body) })
}

export function updateUser(
  id: number,
  body: { name?: string; phoneNumber?: string; email?: string; userRole?: Role },
): Promise<UserResponse> {
  return request(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify(body) })
}

export function deleteUser(id: number): Promise<void> {
  return request(`/api/users/${id}`, { method: 'DELETE' })
}

// ── Plans API ─────────────────────────────────────────────────────────────────

export function getPlans(params?: { name?: string; isActive?: boolean }): Promise<PlanResponse[]> {
  const qs = new URLSearchParams()
  if (params?.name) qs.set('name', params.name)
  if (params?.isActive !== undefined) qs.set('isActive', String(params.isActive))
  const query = qs.toString() ? `?${qs}` : ''
  return request(`/api/v1/plans${query}`)
}

export function createPlan(body: {
  planName: string
  price: number
  daysAlloted: number
}): Promise<PlanResponse> {
  return request('/api/v1/plans', { method: 'POST', body: JSON.stringify(body) })
}

export function updatePlan(
  id: number,
  body: { planName?: string; price?: number; daysAlloted?: number; isActive?: boolean },
): Promise<PlanResponse> {
  return request(`/api/v1/plans/${id}`, { method: 'PUT', body: JSON.stringify(body) })
}

// ── Memberships API ───────────────────────────────────────────────────────────

export function getMemberships(): Promise<UserMemberShipDto[]> {
  return request('/api/v1/memberships')
}

export function createMembership(
  memberId: number,
  body: { planId: number; startDate: string },
): Promise<UserMemberShipDto> {
  return request(`/api/v1/memberships/${memberId}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// ── Attendance API ────────────────────────────────────────────────────────────

export function getAttendance(): Promise<AttendanceResponse[]> {
  return request('/api/v1/attendance')
}

export function markAttendance(userId: number): Promise<AttendanceResponse> {
  return request(`/api/v1/attendance/${userId}`, { method: 'POST' })
}
