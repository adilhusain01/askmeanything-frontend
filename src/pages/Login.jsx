import { useState } from 'react'
import { TextField, Button, Typography, Box } from '@mui/material'
import { z } from 'zod'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../context/authContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const { login } = useAuth()

  const schema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = schema.safeParse({ email, password })

    if (!result.success) {
      const fieldErrors = result.error.format()
      setErrors({
        email: fieldErrors.email?._errors[0] || '',
        password: fieldErrors.password?._errors[0] || '',
      })
    } else {
      setErrors({ email: '', password: '' })
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth`,
          { email, password }
        )
        const token = response.data.accessToken
        localStorage.setItem('token', token)
        login(token)

        const decoded = jwtDecode(token)
        toast.success("Login successful! Let's fill the Questionaire")
        if (decoded.doneQuestinoaire) {
          navigate('/')
        } else {
          setTimeout(() => {
            navigate('/info')
          }, 3500)
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Login error')
        console.error('Login error', error.response?.data)
        console.error('Login error', error)
      }
    }
  }

  return (
    <main className="flex items-center justify-center w-full h-screen">
      <div className="px-[2.5rem] py-[2.5rem] bg-white rounded-xl min-w-[30rem]">
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col items-center justify-center gap-[1.25rem]"
        >
          <Typography
            component="h1"
            variant="h5"
            className="text-center font-bold"
          >
            Login
          </Typography>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              color: 'white',
              backgroundColor: 'black',
              fontSize: '1rem',
              borderRadius: '0.75rem',
              padding: '0.5rem 2rem',
            }}
          >
            Sign In
          </Button>
          <div>
            <Typography variant="body2">
              Do not have an account?
              <a href="/register" className="text-blue-500">
                Sign Up
              </a>
            </Typography>
          </div>
        </Box>
      </div>
      <ToastContainer />
    </main>
  )
}

export default Login
