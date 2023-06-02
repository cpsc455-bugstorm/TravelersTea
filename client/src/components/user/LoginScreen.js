import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/reducers/userSlice'

export default function LoginScreen() {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleLogin = (event) => {
    // TODO login authentication
    event.preventDefault()
    dispatch(
      login({
        username: username,
        password: password,
      }),
    )
  }

  return (
    <div className='login-container relative h-screen'>
      <video
        className='login-video absolute inset-0 h-full w-full object-cover'
        autoPlay
        loop
        muted
      >
        {/*video credits: https://www.youtube.com/watch?v=rDrjQyatgXQ&ab_channel=FreeMotionBackgroundLoop*/}
        <source src='/loginPage.mp4' type='video/mp4' />
      </video>
      <div className='login-overlay absolute inset-0 flex items-center justify-center'>
        <div className='login-card h-90 flex w-96 items-center justify-center rounded-lg bg-white bg-opacity-80 p-8 shadow-lg'>
          <form onSubmit={handleLogin} className='flex flex-col items-center'>
            <div className='mb-4'>
              <input
                type='text'
                id='username'
                className='w-full border-b border-gray-400 bg-transparent px-2 py-2 placeholder-gray-700 hover:placeholder-opacity-80'
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className='mb-4'>
              <input
                type='password'
                id='password'
                className='w-full border-b border-gray-400 bg-transparent px-2 py-2 placeholder-gray-700 hover:placeholder-opacity-80'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type='submit'
              className='rounded-lg bg-blue-500 bg-opacity-50 px-4 py-2 text-white hover:bg-opacity-75'
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
