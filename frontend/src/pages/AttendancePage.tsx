import { useState, useEffect, FormEvent } from 'react'
import {
  getAttendance,
  markAttendance,
  getUsers,
  type AttendanceResponse,
  type UserResponse,
} from '../api'

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceResponse[]>([])
  const [users, setUsers] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Mark form
  const [userId, setUserId] = useState('')
  const [marking, setMarking] = useState(false)
  const [markError, setMarkError] = useState('')
  const [markSuccess, setMarkSuccess] = useState<string | null>(null)

  async function load() {
    try {
      const [a, u] = await Promise.all([getAttendance(), getUsers()])
      setAttendance(a)
      setUsers(u)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attendance')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleMark(e: FormEvent) {
    e.preventDefault()
    setMarkError('')
    setMarkSuccess(null)
    setMarking(true)
    try {
      const record = await markAttendance(parseInt(userId, 10))
      setAttendance((prev) => [record, ...prev])
      const name = users.find((u) => u.userId === record.userId)?.name ?? String(record.userId)
      setMarkSuccess(`Attendance marked for ${name}.`)
      setTimeout(() => setMarkSuccess(null), 4000)
    } catch (err) {
      setMarkError(err instanceof Error ? err.message : 'Failed to mark attendance')
    } finally {
      setMarking(false)
    }
  }

  function userName(id: number) {
    return users.find((u) => u.userId === id)?.name ?? String(id)
  }

  // Group by date for a compact view
  const today = new Date().toLocaleDateString()
  const todayRecords = attendance.filter(
    (a) => new Date(a.createdAt).toLocaleDateString() === today,
  )

  return (
    <>
      <div className="page-header">
        <h1>Attendance</h1>
        <p>Mark and review daily check-ins</p>
      </div>

      <div className="card">
        <div className="card-header">Mark Attendance</div>
        <div className="card-body">
          {markError && <div className="alert alert-error">{markError}</div>}
          {markSuccess && <div className="alert alert-success">{markSuccess}</div>}
          <form className="form" onSubmit={handleMark}>
            <div className="form-row">
              <div className="form-group">
                <label>Member</label>
                <select
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
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
            </div>
            <div>
              <button className="btn btn-primary" type="submit" disabled={marking}>
                {marking ? 'Marking…' : 'Mark Attendance'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {!loading && !error && todayRecords.length > 0 && (
        <div className="card">
          <div className="card-header">Today's Check-ins ({todayRecords.length})</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Member</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {todayRecords.map((a) => (
                  <tr key={a.attendanceId}>
                    <td>{a.attendanceId}</td>
                    <td>{userName(a.userId)}</td>
                    <td>
                      {new Date(a.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">All Attendance Records</div>
        {loading ? (
          <div className="loading">Loading…</div>
        ) : error ? (
          <div className="alert alert-error" style={{ margin: '1rem' }}>{error}</div>
        ) : attendance.length === 0 ? (
          <div className="empty">No attendance records yet.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Member</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((a) => (
                  <tr key={a.attendanceId}>
                    <td>{a.attendanceId}</td>
                    <td>{userName(a.userId)}</td>
                    <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td>
                      {new Date(a.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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
