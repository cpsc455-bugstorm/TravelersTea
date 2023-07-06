import { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  loginUserAsync,
  registerUserAsync,
} from '../../redux/reducers/users/thunks'
import { Button } from '../common'

export function AuthScreen() {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoginView, setIsLoginView] = useState(true)

  const handleAuth = (event) => {
    event.preventDefault()
    if (isLoginView) {
      dispatch(
        loginUserAsync({
          email: email,
          password: password,
        }),
      )
    } else {
      dispatch(
        registerUserAsync({
          email: email,
          username: username,
          password: password,
        }),
      )
    }
  }

  const toggleView = () => setIsLoginView(!isLoginView)

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
        <div className='login-card h-90 flex flex w-96 flex-col items-center justify-center rounded-lg bg-white bg-opacity-95 p-8 shadow-lg'>
          <h1 className='mb-4 place-items-start place-self-start text-3xl'>
            {isLoginView ? 'Sign In' : 'Sign Up'}{' '}
          </h1>
          <form
            onSubmit={handleAuth}
            className='flex w-full flex-col items-center'
          >
            {!isLoginView && (
              <div className='mb-4 w-full'>
                <input
                  type='text'
                  id='username'
                  className='w-full border-b border-gray-400 bg-transparent px-2 py-2 placeholder-gray-700 hover:placeholder-opacity-80'
                  placeholder='Username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}
            <div className='mb-4 w-full'>
              <input
                type='email'
                id='email'
                className='w-full border-b border-gray-400 bg-transparent px-2 py-2 placeholder-gray-700 hover:placeholder-opacity-80'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className='mb-4 w-full'>
              <input
                type='password'
                id='password'
                className='w-full border-b border-gray-400 bg-transparent px-2 py-2 placeholder-gray-700 hover:placeholder-opacity-80'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type='submit'
              className='mt-4 w-full bg-blue-600 bg-opacity-80 px-4 py-2 text-white hover:bg-blue-400'
              onClick={() => {}}
            >
              {isLoginView ? 'Login' : 'Register'}
            </Button>
            <hr className='my-4 h-px w-full border-0 bg-slate-800 text-slate-800' />
          </form>
          <Button
            onClick={toggleView}
            className='w-full bg-slate-600 bg-opacity-80 px-4 py-2 text-white hover:bg-slate-400'
          >
            {isLoginView ? 'Register Account' : 'Back to Login'}
          </Button>
        </div>
      </div>
    </div>
  )
}
