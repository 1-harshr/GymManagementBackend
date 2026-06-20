import { useState, useEffect, FormEvent } from 'react'
import {
  getPlans,
  createPlan,
  updatePlan,
  isAdminOrGod,
  type PlanResponse,
} from '../api'

interface EditState {
  planName: string
  price: string
  daysAlloted: string
  isActive: boolean
}

export default function PlansPage() {
  const adminOrGod = isAdminOrGod()

  const [plans, setPlans] = useState<PlanResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Create form
  const [createName, setCreateName] = useState('')
  const [createPrice, setCreatePrice] = useState('')
  const [createDays, setCreateDays] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [createSuccess, setCreateSuccess] = useState(false)

  // Edit modal
  const [editPlan, setEditPlan] = useState<PlanResponse | null>(null)
  const [editState, setEditState] = useState<EditState>({
    planName: '',
    price: '',
    daysAlloted: '',
    isActive: true,
  })
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState('')

  async function load() {
    try {
      const data = await getPlans()
      setPlans(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plans')
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
      const plan = await createPlan({
        planName: createName,
        price: parseFloat(createPrice),
        daysAlloted: parseInt(createDays, 10),
      })
      setPlans((prev) => [plan, ...prev])
      setCreateName('')
      setCreatePrice('')
      setCreateDays('')
      setCreateSuccess(true)
      setTimeout(() => setCreateSuccess(false), 3000)
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create plan')
    } finally {
      setCreating(false)
    }
  }

  function openEdit(plan: PlanResponse) {
    setEditPlan(plan)
    setEditState({
      planName: plan.planName,
      price: String(plan.price),
      daysAlloted: String(plan.daysAlloted),
      isActive: plan.isActive,
    })
    setEditError('')
  }

  function closeEdit() {
    setEditPlan(null)
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!editPlan) return
    setEditError('')
    setSaving(true)
    try {
      const updated = await updatePlan(editPlan.id, {
        planName: editState.planName,
        price: parseFloat(editState.price),
        daysAlloted: parseInt(editState.daysAlloted, 10),
        isActive: editState.isActive,
      })
      setPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      closeEdit()
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Failed to update plan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Plans</h1>
        <p>Manage gym membership plans</p>
      </div>

      {adminOrGod && (
        <div className="card">
          <div className="card-header">Create New Plan</div>
          <div className="card-body">
            {createError && <div className="alert alert-error">{createError}</div>}
            {createSuccess && <div className="alert alert-success">Plan created successfully.</div>}
            <form className="form" onSubmit={handleCreate}>
              <div className="form-row">
                <div className="form-group">
                  <label>Plan Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Monthly Basic"
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="999"
                    value={createPrice}
                    onChange={(e) => setCreatePrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Days Allotted</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="30"
                    value={createDays}
                    onChange={(e) => setCreateDays(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <button className="btn btn-primary" type="submit" disabled={creating}>
                  {creating ? 'Creating…' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">All Plans</div>
        {loading ? (
          <div className="loading">Loading…</div>
        ) : error ? (
          <div className="alert alert-error" style={{ margin: '1rem' }}>{error}</div>
        ) : plans.length === 0 ? (
          <div className="empty">No plans found.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th>Created</th>
                  {adminOrGod && <th></th>}
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.id}>
                    <td>{plan.id}</td>
                    <td>{plan.planName}</td>
                    <td>₹{plan.price}</td>
                    <td>{plan.daysAlloted}</td>
                    <td>
                      <span className={`badge ${plan.isActive ? 'badge-green' : 'badge-red'}`}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(plan.createdAt).toLocaleDateString()}</td>
                    {adminOrGod && (
                      <td>
                        <button className="btn btn-ghost" onClick={() => openEdit(plan)}>
                          Edit
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editPlan && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeEdit()}>
          <div className="modal">
            <h2>Edit Plan — {editPlan.planName}</h2>
            {editError && <div className="alert alert-error">{editError}</div>}
            <form className="form" onSubmit={handleSave}>
              <div className="form-group">
                <label>Plan Name</label>
                <input
                  type="text"
                  value={editState.planName}
                  onChange={(e) => setEditState((s) => ({ ...s, planName: e.target.value }))}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editState.price}
                    onChange={(e) => setEditState((s) => ({ ...s, price: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Days Allotted</label>
                  <input
                    type="number"
                    min="1"
                    value={editState.daysAlloted}
                    onChange={(e) => setEditState((s) => ({ ...s, daysAlloted: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={editState.isActive ? 'active' : 'inactive'}
                  onChange={(e) =>
                    setEditState((s) => ({ ...s, isActive: e.target.value === 'active' }))
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={closeEdit}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
