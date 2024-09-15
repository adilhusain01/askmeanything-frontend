import { lazy, Suspense, useState } from 'react'
import Header from '../components/Header'
import { Switch, Typography } from '@mui/material'
import { useAuth } from '../context/authContext'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

const UserList = lazy(() => import('../components/UserList'))

const Home = () => {
  const { user } = useAuth()
  const [selectedSwitch, setSelectedSwitch] = useState(user?.vibe || '')

  const handleSwitchChange = (name) => {
    if (user) {
      setSelectedSwitch(name)
    } else {
      toast.error('Login first!')
    }
  }

  const handleSave = async () => {
    if (!user) {
      toast.error('Login first!')
      return
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/users/${user.id}`,
        { vibe: selectedSwitch },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      if (response.status === 200) {
        toast.success(`Vibe saved as ${selectedSwitch}`)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving vibe')
    }
  }

  return (
    <main className="w-full h-screen">
      <Header />
      <section className="py-[1.5rem] flex flex-row items-center justify-evenly w-full">
        <div className="flex flex-col items-start justify-center gap-[0rem] leading-tight">
          <h1 className="text-[3.125rem] lg:text-[7.5rem] font-bold text-[#DDA15E]">
            Making Dating
          </h1>
          <h1 className="text-[3.125rem] lg:text-[7.5rem] font-bold text-white">
            Exciting .
          </h1>
        </div>

        <div className="flex flex-col items-start justify-center">
          <div className="p-[2rem] flex flex-col bg-[#1c1c24] rounded-xl gap-[1rem]">
            <h1 className="text-[1.5rem] font-bold text-white text-center">
              #Vibez
            </h1>
            <div
              className="max-h-[50vh] flex flex-col gap-[1rem] overflow-y-scroll scroll-smooth"
              style={{ scrollbarWidth: 'thin' }}
            >
              {[
                'Rizz',
                'Cool',
                'Nerd',
                'C3PO',
                'Cinephile',
                'Zaphod Beeblebrox',
                'Harry potter',
                'Kunal Kamra',
                'Robert Downey Jr',
                'Donald Trump',
                'Tim Cook',
                'John Green',
              ].map((label) => (
                <article
                  key={label}
                  className="flex items-center justify-between gap-2 text-white"
                >
                  <Typography variant="h6">{label}</Typography>
                  <Switch
                    checked={
                      user ? selectedSwitch === label : selectedSwitch === ''
                    }
                    onChange={() => handleSwitchChange(label)}
                  />
                </article>
              ))}
            </div>

            <button
              onClick={handleSave}
              className="p-[0.5rem] text-[1.25rem] font-medium bg-[#DDA15E] text-black rounded-xl cursor-pointer"
              disabled={!user} // Disable button if user is not logged in
            >
              Save
            </button>
          </div>
        </div>

        <div className="p-[2.5rem] flex flex-col items-center justify-center gap-[1rem]">
          <Suspense fallback={<div>Loading...</div>}>
            <UserList />
          </Suspense>
        </div>
      </section>
      <ToastContainer />
    </main>
  )
}

export default Home
