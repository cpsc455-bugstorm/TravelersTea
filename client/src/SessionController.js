import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from './components/common'
import { AppView } from './constants/enums'
import { fetchTripsAsync } from './redux/reducers/trip/thunks'
import { setAppView } from './redux/reducers/viewSlice'
import { useNavigate } from 'react-router-dom'
import { REQUEST_STATE } from './redux/states'

SessionController.propTypes = {
  children: PropTypes.node,
}

export function SessionController({ children }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const tripsStatus = useSelector((state) => state.trip.status)
  const usersStatus = useSelector((state) => state.users.status)
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimumLoadingTimeMet, setIsMinimumLoadingTimeMet] = useState(false)

  useEffect(() => {
    if (usersStatus === REQUEST_STATE.LOGGEDIN) {
      setTimeout(() => {
        navigate('/home')
        dispatch(setAppView(AppView.NEW_TRIP))
      }, 2000)
    }
  }, [dispatch, navigate, usersStatus])

  useEffect(() => {
    if (
      tripsStatus === REQUEST_STATE.IDLE &&
      usersStatus === REQUEST_STATE.LOGGEDIN
    ) {
      dispatch(fetchTripsAsync())
    }
  }, [dispatch, tripsStatus, usersStatus])

  useEffect(() => {
    if (
      (tripsStatus === REQUEST_STATE.WRITING &&
        usersStatus === REQUEST_STATE.LOGGEDIN) ||
      usersStatus === REQUEST_STATE.READING
    ) {
      setIsLoading(true)
      setIsMinimumLoadingTimeMet(false)
      setTimeout(() => {
        setIsMinimumLoadingTimeMet(true)
      }, 3000)
    }
  }, [tripsStatus, usersStatus])

  useEffect(() => {
    if (
      (tripsStatus === REQUEST_STATE.FULFILLED ||
        tripsStatus === REQUEST_STATE.REJECTED) &&
      isMinimumLoadingTimeMet
    ) {
      setIsLoading(false)
    }
  }, [tripsStatus, isMinimumLoadingTimeMet])

  useEffect(() => {
    if (usersStatus !== REQUEST_STATE.READING && isMinimumLoadingTimeMet) {
      setIsLoading(false)
    }
  }, [usersStatus, isMinimumLoadingTimeMet])

  return (
    <>
      {isLoading && <Loader />}
      {children}
    </>
  )
}
