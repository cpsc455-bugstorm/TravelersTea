import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  loginUserAsync,
  registerUserAsync,
} from '../../redux/reducers/users/thunks'
import { REQUEST_STATE } from '../../redux/states'
import { Button } from '../common'

export function AuthScreen() {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const userStatus = useSelector((state) => state.users.status)
  const allowAuthAttempts = userStatus === REQUEST_STATE.LOGGEDOUT

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const [isLoginView, setIsLoginView] = useState(true)

  const onSubmitForm = (data) => {
    if (isLoginView) {
      dispatch(
        loginUserAsync({
          email: data.email,
          password: data.password,
        }),
      )
    } else {
      dispatch(
        registerUserAsync({
          email: data.email,
          username: data.username,
          password: data.password,
        }),
      )
    }
    reset()
  }

  useEffect(() => {
    enqueueSnackbar('Do NOT use real credentials! Product is in beta.', {
      variant: 'warning',
    })
  }, [enqueueSnackbar])

  return (
    <div className='login-container relative h-screen overflow-hidden'>
      <video
        className='login-video absolute inset-0 h-full w-full object-cover'
        autoPlay
        loop
        muted
      >
        {/*video credits: https://www.youtube.com/watch?v=rDrjQyatgXQ&ab_channel=FreeMotionBackgroundLoop*/}
        <source src='/loginPage.mp4' type='video/mp4' />
      </video>
      {allowAuthAttempts && (
        <div className='login-overlay absolute inset-0 flex items-center justify-center'>
          <div className='login-card h-90 flex flex w-96 flex-col items-center justify-center rounded-lg bg-white bg-opacity-95 p-8 shadow-lg'>
            <h1 className='mb-4 place-items-start place-self-start text-3xl'>
              {isLoginView ? 'Sign In' : 'Sign Up'}{' '}
            </h1>
            <form
              onSubmit={handleSubmit(onSubmitForm)}
              className='flex w-full flex-col items-center'
            >
              {!isLoginView && (
                <div className='mb-4 w-full'>
                  <input
                    type='text'
                    id='username'
                    className='w-full border-b border-gray-400 bg-transparent px-2 py-2 placeholder-gray-700 hover:placeholder-opacity-80'
                    placeholder='Username'
                    {...register('username', { required: !isLoginView })}
                  />
                  {errors.username && (
                    <span className='text-sm text-red-600'>
                      Username is required
                    </span>
                  )}
                </div>
              )}
              <div className='mb-4 w-full'>
                <input
                  type='email'
                  id='email'
                  className='w-full border-b border-gray-400 bg-transparent px-2 py-2 placeholder-gray-700 hover:placeholder-opacity-80'
                  placeholder='Email'
                  {...register('email', { required: true })}
                />
                {errors.email && (
                  <span className='text-sm text-red-600'>
                    Email is required
                  </span>
                )}
              </div>

              <div className='mb-4 w-full'>
                <input
                  type='password'
                  id='password'
                  className='w-full border-b border-gray-400 bg-transparent px-2 py-2 placeholder-gray-700 hover:placeholder-opacity-80'
                  placeholder='Password'
                  {...register('password', { required: true })}
                />
                {errors.password && (
                  <span className='text-sm text-red-600'>
                    Password is required
                  </span>
                )}
              </div>
              <Button
                onClick={() => {}}
                type='submit'
                className='mt-4 w-full bg-blue-600 bg-opacity-80 px-4 py-2 text-white hover:bg-blue-400'
              >
                {isLoginView ? 'Login' : 'Register'}
              </Button>
              <hr className='my-4 h-px w-full border-0 bg-slate-800 text-slate-800' />
              <Button
                onClick={(event) => {
                  event.preventDefault()
                  setIsLoginView(!isLoginView)
                }}
                className='w-full bg-slate-600 bg-opacity-80 px-4 py-2 text-white hover:bg-slate-400'
              >
                {isLoginView ? 'Register Account' : 'Back to Login'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
