import { useEffect, useState } from 'react'
import axios from 'axios'
import UserCard from './UserCard'

const UserList = () => {
  const [users, setUsers] = useState([])

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/users`
      )
      setUsers(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="h-[70vh] px-[1rem] py-[2rem] flex flex-col bg-[#1c1c24] rounded-xl gap-[1rem] max-w-[25rem]">
      <h1 className="text-[1.5rem] font-bold text-white text-center">
        Connect Now
      </h1>
      <div
        className="max-h-[50vh] px-[1rem] flex flex-col gap-[1rem] overflow-y-scroll scroll-smooth w-full"
        style={{ scrollbarWidth: 'thin' }}
      >
        {users && users.map((user) => <UserCard key={user._id} user={user} />)}
      </div>
    </div>
  )
}

export default UserList
