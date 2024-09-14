import { useState } from 'react'
import { TextField, Button, Typography, Box } from '@mui/material'
import { z } from 'zod'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const schema = z
    .object({
      email: z.string().email({ message: 'Invalid email address' }),
      username: z
        .string()
        .min(1, { message: 'Username is required' })
        .regex(/^[a-zA-Z0-9_]+$/, {
          message:
            'Username can only contain letters, numbers, and underscores',
        }),
      password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' }),
      confirmPassword: z
        .string()
        .min(6, { message: 'Password confirmation is required' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = schema.safeParse(formData)

    if (!result.success) {
      const fieldErrors = result.error.format()
      setErrors({
        email: fieldErrors.email?._errors[0] || '',
        username: fieldErrors.username?._errors[0] || '',
        password: fieldErrors.password?._errors[0] || '',
        confirmPassword: fieldErrors.confirmPassword?._errors[0] || '',
      })
    } else {
      setErrors({})
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/users`,
          formData
        )
        toast.success('Registration successful! Redirecting to Login')
        console.log('Registration successful', response.data)
        setTimeout(() => {
          navigate('/info')
        }, 2000)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Registration error')
        console.error('Registration error', error.response?.data)
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
            Register
          </Typography>
          <TextField
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
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
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
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
            Register
          </Button>
          <div>
            <Typography variant="body2">
              Already have an account?{' '}
              <a href="/login" className="text-blue-500">
                Login
              </a>
            </Typography>
          </div>
        </Box>
      </div>
      <ToastContainer />
    </main>
  )
}

export default Register
