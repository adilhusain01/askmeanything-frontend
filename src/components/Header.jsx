import { Link } from 'react-router-dom'
import Logo from '../assets/logo.png'
import PersonIcon from '@mui/icons-material/Person'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { useAuth } from '../context/authContext'

const Header = () => {
  const { user, logout } = useAuth() // Get the user and logout function from the context

  const handleLogout = () => {
    logout()
  }

  return (
    <section className="px-[5rem] text-[1.25rem] flex flex-row items-center justify-between bg-lightGray text-white">
      <Link to={'/'} className="flex flex-row items-center justify-center">
        <img src={Logo} alt="" className="h-auto w-full max-w-[7.5rem]" />
        <h1 className="text-[1.5rem] font-bold">Ask Me Anything</h1>
      </Link>
      <ul className="flex flex-row gap-[5rem]">
        <li>
          <Link to={'/'}>Home</Link>
        </li>
        <li>
          <Link to={'/profile'}>
            <PersonIcon />
          </Link>
        </li>
        {user && (
          <li>
            <Link onClick={handleLogout} to={'/login'}>
              <ExitToAppIcon />
            </Link>
          </li>
        )}
      </ul>
    </section>
  )
}

export default Header
