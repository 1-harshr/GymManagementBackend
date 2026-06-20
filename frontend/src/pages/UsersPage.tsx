import { useState, useEffect, FormEvent } from 'react'
import {
  getUsers,
  createUser,
  deleteUser,
  type UserResponse,
  type Role,
} from '../api'

const ROLES: Role[] = ['MEMBER', 'ADMIN', 'GOD']

export default function UsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Create form
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userRole, setUserRole] = useState<Role>('MEMBER')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [createSuccess, setCreateSuccess] = useState(false)

  // Delete
  const [deletingId, setDeletingId] = useState<number | null>(null)

  async function load() {
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setCreateError('')
    setCreateSuccess(false)
    setCreating(true)
    try {
      const user = await createUser({
        name,
        phoneNumber,
        email: email || undefined,
        password,
        userRole,
      })
      setUsers((prev) => [user, ...prev])
      setName('')
      setPhoneNumber('')
      setEmail('')
      setPassword('')
      setUserRole('MEMBER')
      setCreateSuccess(true)
      setTimeout(() => setCreateSuccess(false), 3000)
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create user')
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this user? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await deleteUser(id)
      setUsers((prev) => prev.filter((u) => u.userId !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Users</h1>
        <p>Create and manage gym members and staff</p>
      </div>

      <div className="card">
        <div className="card-header">Create New User</div>
        <div className="card-body">
          {createError && <div className="alert alert-error">{createError}</div>}
          {createSuccess && <div className="alert alert-success">User created successfully.</div>}
          <form className="form" onSubmit={handleCreate}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email (optional)</label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as Role)}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <button className="btn btn-primary" type="submit" disabled={creating}>
                {creating ? 'Creating…' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">All Users</div>
        {loading ? (
          <div className="loading">Loading…</div>
        ) : error ? (
          <div className="alert alert-error" style={{ margin: '1rem' }}>{error}</div>
        ) : users.length === 0 ? (
          <div className="empty">No users found.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>{user.name}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.email ?? '—'}</td>
                    <td>
                      <span className={`badge ${user.userRole === 'MEMBER' ? 'badge-blue' : 'badge-green'}`}>
                        {user.userRole}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(user.userId)}
                        disabled={deletingId === user.userId}
                      >
                        {deletingId === user.userId ? '…' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
