import { useState, useEffect, FormEvent } from 'react'
import {
  getMemberships,
  createMembership,
  getUsers,
  getPlans,
  type UserMemberShipDto,
  type UserResponse,
  type PlanResponse,
} from '../api'

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState<UserMemberShipDto[]>([])
  const [users, setUsers] = useState<UserResponse[]>([])
  const [plans, setPlans] = useState<PlanResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Create form
  const [memberId, setMemberId] = useState('')
  const [planId, setPlanId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [createSuccess, setCreateSuccess] = useState(false)

  async function load() {
    try {
      const [m, u, p] = await Promise.all([getMemberships(), getUsers(), getPlans()])
      setMemberships(m)
      setUsers(u)
      setPlans(p)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // Default startDate to today
  useEffect(() => {
    setStartDate(new Date().toISOString().split('T')[0])
  }, [])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setCreateError('')
    setCreateSuccess(false)
    setCreating(true)
    try {
      const ms = await createMembership(parseInt(memberId, 10), {
        planId: parseInt(planId, 10),
        startDate,
      })
      setMemberships((prev) => [ms, ...prev])
      setPlanId('')
      setCreateSuccess(true)
      setTimeout(() => setCreateSuccess(false), 3000)
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create membership')
    } finally {
      setCreating(false)
    }
  }

  function userName(id: number) {
    return users.find((u) => u.userId === id)?.name ?? String(id)
  }

  function planName(id: number) {
    return plans.find((p) => p.id === id)?.planName ?? String(id)
  }

  return (
    <>
      <div className="page-header">
        <h1>Memberships</h1>
        <p>Assign plans to members and view subscription history</p>
      </div>

      <div className="card">
        <div className="card-header">Create Membership</div>
        <div className="card-body">
          {createError && <div className="alert alert-error">{createError}</div>}
          {createSuccess && <div className="alert alert-success">Membership created successfully.</div>}
          <form className="form" onSubmit={handleCreate}>
            <div className="form-row">
              <div className="form-group">
                <label>Member</label>
                <select
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  required
                >
                  <option value="">Select a member…</option>
                  {users.map((u) => (
                    <option key={u.userId} value={u.userId}>
                      [{u.userId}] {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Plan</label>
                <select
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value)}
                  required
                >
                  <option value="">Select a plan…</option>
                  {plans.filter((p) => p.isActive).map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.id}] {p.planName} — ₹{p.price} / {p.daysAlloted}d
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <button className="btn btn-primary" type="submit" disabled={creating}>
                {creating ? 'Creating…' : 'Create Membership'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">All Memberships</div>
        {loading ? (
          <div className="loading">Loading…</div>
        ) : error ? (
          <div className="alert alert-error" style={{ margin: '1rem' }}>{error}</div>
        ) : memberships.length === 0 ? (
          <div className="empty">No memberships found.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Sub ID</th>
                  <th>Member</th>
                  <th>Plan</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {memberships.map((ms) => {
                  const now = new Date()
                  const end = new Date(ms.endDate)
                  const active = end >= now
                  return (
                    <tr key={ms.subscriptionId}>
                      <td>{ms.subscriptionId}</td>
                      <td>{userName(ms.memberId)}</td>
                      <td>{planName(ms.planId)}</td>
                      <td>{new Date(ms.startDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${active ? 'badge-green' : 'badge-red'}`}>
                          {new Date(ms.endDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td>{new Date(ms.createdAt).toLocaleDateString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
