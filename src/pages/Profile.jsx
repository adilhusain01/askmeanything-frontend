import { useEffect, useState } from 'react'
import {
  TextField,
  Button,
  Box,
  Avatar,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material'
import { z } from 'zod'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '../context/authContext'
import Header from '../components/Header'
import PersonIcon from '@mui/icons-material/Person'
import axios from 'axios'

const Profile = () => {
  const { user } = useAuth()
  const [userData, setUserData] = useState({})
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: '',
    gender: '',
    profile_picture_url: '',
    height: '',
    weight: '',
    occupation: '',
    smoking: false,
    drinking: false,
    body_type: '',
    size: '',
    hobbies: [],
    city: '',
    state: '',
    country: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/users/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        setUserData(response.data)
        console.log(response.data)
      } catch (error) {
        console.error('Profile fetch error', error.response?.data)
      }
    }

    fetchUserData()
  }, [user.id])

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || '',
        email: userData.email || '',
        age: userData.age || '',
        gender: userData.gender || '',
        profile_picture_url: userData.profile_picture_url || '',
        height: userData.height || '',
        weight: userData.weight || '',
        occupation: userData.occupation || '',
        smoking: userData.smoking || false,
        drinking: userData.drinking || false,
        body_type: userData.body_type || '',
        size: userData.size || '',
        hobbies: userData.hobbies || [],
        city: userData.city || '',
        state: userData.state || '',
        country: userData.country || '',
      })
    }
  }, [userData])

  const schema = z.object({
    username: z.string().min(1, { message: 'Username is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    age: z.number().optional(),
    gender: z.string().optional(),
    profile_picture_url: z.string().url().optional(),
    height: z.number().optional(),
    weight: z.number().optional(),
    occupation: z.string().optional(),
    smoking: z.boolean().optional(),
    drinking: z.boolean().optional(),
    body_type: z.string().optional(),
    size: z.number().optional(),
    hobbies: z.array(z.string()).optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
  })

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = schema.safeParse(formData)

    if (!result.success) {
      const fieldErrors = result.error.format()
      setErrors({
        username: fieldErrors.username?._errors[0] || '',
        email: fieldErrors.email?._errors[0] || '',
        age: fieldErrors.age?._errors[0] || '',
        gender: fieldErrors.gender?._errors[0] || '',
        profile_picture_url: fieldErrors.profile_picture_url?._errors[0] || '',
        height: fieldErrors.height?._errors[0] || '',
        weight: fieldErrors.weight?._errors[0] || '',
        occupation: fieldErrors.occupation?._errors[0] || '',
        smoking: fieldErrors.smoking?._errors[0] || '',
        drinking: fieldErrors.drinking?._errors[0] || '',
        body_type: fieldErrors.body_type?._errors[0] || '',
        size: fieldErrors.size?._errors[0] || '',
        hobbies: fieldErrors.hobbies?._errors[0] || '',
        city: fieldErrors.city?._errors[0] || '',
        state: fieldErrors.state?._errors[0] || '',
        country: fieldErrors.country?._errors[0] || '',
      })
    } else {
      setErrors({})
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/users/${user.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        toast.success('Profile updated successfully')
        console.log('Profile updated successfully', response.data)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Update error')
        console.error('Update error', error.response?.data)
      }
    }
  }

  return (
    <main className="flex flex-col w-full h-screen">
      <Header />
      <section className="flex flex-col items-center justify-center p-4">
        <div className="px-[2.5rem] py-[2.5rem] flex flex-col items-center justify-center gap-[1rem] bg-white text-black rounded-xl">
          <Avatar
            src={formData.profile_picture_url}
            alt="Profile Picture"
            sx={{ width: 100, height: 100 }}
          >
            {!formData.profile_picture_url && <PersonIcon />}
          </Avatar>
          <TextField
            fullWidth
            id="profile_picture_url"
            label="Profile Picture URL"
            name="profile_picture_url"
            value={formData.profile_picture_url}
            onChange={handleChange}
            error={!!errors.profile_picture_url}
            helperText={errors.profile_picture_url}
          />
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4 w-full max-w-md"
          >
            <TextField
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              disabled
            />
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled
            />
            <TextField
              fullWidth
              id="age"
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              error={!!errors.age}
              helperText={errors.age}
            />
            <FormControl component="fieldset">
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                row
                aria-label="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
            </FormControl>
            <TextField
              fullWidth
              id="height"
              label="Height (in Feets)"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleChange}
              error={!!errors.height}
              helperText={errors.height}
            />
            <TextField
              fullWidth
              id="weight"
              label="Weight (in Kgs)"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              error={!!errors.weight}
              helperText={errors.weight}
            />
            <TextField
              fullWidth
              id="occupation"
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              error={!!errors.occupation}
              helperText={errors.occupation}
            />
            <FormControl component="fieldset">
              <FormLabel component="legend">Body Type</FormLabel>
              <RadioGroup
                row
                aria-label="body_type"
                name="body_type"
                value={formData.body_type}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="skinny"
                  control={<Radio />}
                  label="Skinny"
                />
                <FormControlLabel
                  value="ripped"
                  control={<Radio />}
                  label="Ripped"
                />
                <FormControlLabel
                  value="normal"
                  control={<Radio />}
                  label="Normal"
                />
                <FormControlLabel
                  value="healthy"
                  control={<Radio />}
                  label="Healthy"
                />
                <FormControlLabel
                  value="chubby"
                  control={<Radio />}
                  label="Chubby"
                />
              </RadioGroup>
            </FormControl>
            <TextField
              fullWidth
              id="size"
              label="Size"
              name="size"
              type="number"
              value={formData.size}
              onChange={handleChange}
              error={!!errors.size}
              helperText={errors.size}
            />
            <TextField
              fullWidth
              id="hobbies"
              label="Hobbies"
              name="hobbies"
              value={formData.hobbies.join(', ')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hobbies: e.target.value
                    .split(',')
                    .map((hobby) => hobby.trim()),
                })
              }
              error={!!errors.hobbies}
              helperText={errors.hobbies}
            />
            <FormControl component="fieldset">
              <FormLabel component="legend">Smoking</FormLabel>
              <RadioGroup
                row
                aria-label="smoking"
                name="smoking"
                value={formData.smoking.toString()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    smoking: e.target.value === 'true',
                  })
                }
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="Yes"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel component="legend">Drinking</FormLabel>
              <RadioGroup
                row
                aria-label="drinking"
                name="drinking"
                value={formData.drinking.toString()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    drinking: e.target.value === 'true',
                  })
                }
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="Yes"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>
            <TextField
              fullWidth
              id="city"
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={!!errors.city}
              helperText={errors.city}
            />
            <TextField
              fullWidth
              id="state"
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              error={!!errors.state}
              helperText={errors.state}
            />
            <TextField
              fullWidth
              id="country"
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              error={!!errors.country}
              helperText={errors.country}
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
              Update Details
            </Button>
          </Box>
        </div>
      </section>
      <ToastContainer />
    </main>
  )
}

export default Profile
