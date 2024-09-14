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
    <div className="p-[2rem] flex flex-col bg-[#1c1c24] rounded-xl gap-[1rem]">
      <h1 className="text-[1.5rem] font-bold text-white text-center">
        Connect Now
      </h1>
      {users && users.map((user) => <UserCard key={user._id} user={user} />)}
    </div>
  )
}

export default UserList
