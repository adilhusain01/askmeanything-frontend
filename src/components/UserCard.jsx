import { Link } from 'react-router-dom'

const UserCard = ({ user }) => {
  return (
    <article
      key={user._id}
      className="p-[1rem] grid grid-cols-12 text-white bg-[#13131a] items-center justify-center gap-[1rem] rounded-xl w-full"
    >
      <img
        src={user.profile_picture_url}
        alt=""
        className="col-span-4 h-[3rem] w-[3rem] object-cover rounded-[50%]"
      />
      <span className="col-span-8">
        <Link to={`/connect/${user._id}`}>
          <h1 className="font-bold">@{user.username}</h1>
        </Link>
        {/* <p>{user.email}</p> */}
      </span>
    </article>
  )
}

export default UserCard
