import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/authContext'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Info = lazy(() => import('./pages/Info'))
const Profile = lazy(() => import('./pages/Profile'))
const Connect = lazy(() => import('./pages/Connect'))
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  return (
    <main className="App">
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/connect/:id" element={<Connect />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/info" element={<Info />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </main>
  )
}

export default App
