import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import 'design-system/styles/tokens.css'
import 'design-system/styles/themes.css'
import 'design-system/styles/global.css'
import HomePage from './pages/HomePage/HomePage'
import ManagePostingPage from './pages/ManagePostingPage/ManagePostingPage'
import CreateBulletinPage from './pages/CreateBulletinPage/CreateBulletinPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/manage-posting" element={<ManagePostingPage />} />
        <Route path="/create-bulletin" element={<CreateBulletinPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
