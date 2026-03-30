import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/tokens.css'
import './styles/themes.css'
import './styles/global.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import CompanyJobListPage from './pages/CompanyJobListPage/CompanyJobListPage'
import HomePage from './pages/HomePage/HomePage'
import ManagePostingPage from './pages/ManagePostingPage/ManagePostingPage'
import CreateBulletinPage from './pages/CreateBulletinPage/CreateBulletinPage'
import OnboardingPage from './pages/OnboardingPage/OnboardingPage'
import CalendarPage from './pages/CalendarPage/CalendarPage'

/**
 * "/" routing by role:
 *   logged out    → CompanyJobListPage (public job board)
 *   admin         → HomePage (bulletin + manage posting)
 *   employee      → HomePage (bulletin only, no edit/create)
 *   new_employee  → OnboardingPage (checklist + confetti)
 */
function HomeRoute() {
  const { currentUser } = useAuth()
  if (!currentUser) return <CompanyJobListPage />
  if (currentUser.role === 'new_employee') return <Navigate to="/onboarding" replace />
  return <HomePage />
}

/** Admin-only routes — redirect non-admins to "/" */
function AdminRoute({ element }) {
  const { currentUser } = useAuth()
  if (!currentUser) return <Navigate to="/" replace />
  if (currentUser.role !== 'admin') return <Navigate to="/" replace />
  return element
}

/** Authenticated employees/admins only — logged-out or new_employee are redirected */
function CalendarRoute() {
  const { currentUser } = useAuth()
  if (!currentUser) return <Navigate to="/" replace />
  if (currentUser.role === 'new_employee') return <Navigate to="/onboarding" replace />
  return <CalendarPage />
}

/** new_employee-only route — anyone else goes to "/" */
function OnboardingRoute() {
  const { currentUser } = useAuth()
  if (!currentUser) return <Navigate to="/" replace />
  if (currentUser.role !== 'new_employee') return <Navigate to="/" replace />
  return <OnboardingPage />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"                 element={<HomeRoute />} />
      <Route path="/onboarding"       element={<OnboardingRoute />} />
      <Route path="/manage-posting"   element={<AdminRoute element={<ManagePostingPage />} />} />
      <Route path="/create-bulletin"  element={<AdminRoute element={<CreateBulletinPage />} />} />
      <Route path="/calendar"          element={<CalendarRoute />} />
      <Route path="/company-job-list" element={<CompanyJobListPage />} />
      <Route path="*"                 element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
