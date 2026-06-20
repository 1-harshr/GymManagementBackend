import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearAuth, getAuth, isAdminOrGod } from '../api'

export default function Layout() {
  const navigate = useNavigate()
  const auth = getAuth()
  const adminOrGod = isAdminOrGod()

  function handleLogout() {
    clearAuth()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">Gym Manager</div>
        <nav>
          <NavLink
            to="/plans"
            className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          >
            Plans
          </NavLink>
          {adminOrGod && (
            <>
              <NavLink
                to="/users"
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
              >
                Users
              </NavLink>
              <NavLink
                to="/memberships"
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
              >
                Memberships
              </NavLink>
              <NavLink
                to="/attendance"
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
              >
                Attendance
              </NavLink>
            </>
          )}
        </nav>
        <div className="sidebar-footer">
          <div className="role-badge">{auth?.role ?? ''}</div>
          <button className="btn-logout" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
