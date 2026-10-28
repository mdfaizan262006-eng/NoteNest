
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

import Login from './Pages/Login'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
import Alltasks from './Pages/Alltasks'
import Favorites from './Pages/Favorites'
import ProtectedRoute from './ProtectedRoute'

import DashboardLayout from './layout/DashboardLayout'
import { TaskProvider } from './TaskContext'

function App() {
  return (
    <BrowserRouter>
      <TaskProvider>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/Login" replace />}
          />

          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />

          {/* Shared layout for all workspace pages */}

          <Route element={<ProtectedRoute />}>
            <Route path="/Dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="Alltasks" element={<Alltasks />} />
              <Route path="Favorites" element={<Favorites />} />
            </Route>
          </Route>


          <Route
            path="*"
            element={<Navigate to="/Login" replace />}
          />
        </Routes>
      </TaskProvider>
    </BrowserRouter>
  )
}

export default App
