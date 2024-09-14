import { lazy, Suspense } from 'react'
import Header from '../components/Header'

const UserList = lazy(() => import('../components/UserList'))

const Home = () => {
  return (
    <main className="w-full h-screen">
      <Header />
      <section className="grid grid-cols-12">
        <div className="col-span-4">
          <h1>Making Dating Exciting</h1>
        </div>
        <div className="col-span-4"></div>
        <div className="col-span-4 p-[2.5rem] flex flex-col items-center justify-center gap-[1rem] w-full">
          <Suspense fallback={<div>Loading...</div>}>
            <UserList />
          </Suspense>
        </div>
      </section>
    </main>
  )
}

export default Home
