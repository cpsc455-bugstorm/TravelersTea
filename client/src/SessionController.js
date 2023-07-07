import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Loader } from './components/common'
import { AppView } from './constants/enums'
import { resetMap } from './redux/reducers/mapSlice'
import { resetModalPreferences } from './redux/reducers/modalsSlice'
import { resetPreferences } from './redux/reducers/preferencesSlice'
import { fetchTripsAsync } from './redux/reducers/trips/thunks'
import { resetTrips } from './redux/reducers/trips/tripsSlice'
import { updateStatus } from './redux/reducers/users/usersSlice'
import { resetView, setAppView } from './redux/reducers/viewSlice'
import { REQUEST_STATE } from './redux/states'

SessionController.propTypes = {
  children: PropTypes.node,
}

export function SessionController({ children }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const tripsStatus = useSelector((state) => state.trips.status)
  const user = useSelector((state) => state.users.user)
  const usersStatus = useSelector((state) => state.users.status)
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimumLoadingTimeMet, setIsMinimumLoadingTimeMet] = useState(false)

  useEffect(() => {
    if (usersStatus === REQUEST_STATE.LOGGINGOUT) {
      dispatch(resetTrips())
      dispatch(resetPreferences())
      dispatch(resetView())
      dispatch(resetMap())
      dispatch(resetModalPreferences())
      dispatch(updateStatus())
    }
  }, [dispatch, usersStatus])

  useEffect(() => {
    if (usersStatus === REQUEST_STATE.LOGGEDIN) {
      setTimeout(() => {
        navigate('/home')
        dispatch(setAppView(AppView.NEW_TRIP))
      }, 3000)
    }
  }, [dispatch, navigate, usersStatus])

  useEffect(() => {
    if (
      tripsStatus === REQUEST_STATE.IDLE &&
      usersStatus === REQUEST_STATE.LOGGEDIN
    ) {
      dispatch(fetchTripsAsync(user.id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
