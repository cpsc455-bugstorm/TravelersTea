import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Loader } from './components/common'
import { AppView } from './constants/enums'
import { resetMap } from './redux/reducers/mapSlice'
import { resetModalsDisplayed } from './redux/reducers/modalsSlice'
import { resetPreferences } from './redux/reducers/preferencesSlice'
import { fetchTripsAsync } from './redux/reducers/trips/thunks'
import { resetTrips } from './redux/reducers/trips/tripsSlice'
import { updateAsLoggedOut } from './redux/reducers/users/usersSlice'
import { resetView, setAppView } from './redux/reducers/viewSlice'
import { REQUEST_STATE } from './redux/states'

SessionController.propTypes = {
  children: PropTypes.node,
}

export function SessionController({ children }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const tripsStatus = useSelector((state) => state.trips.status)
  const userStates = useSelector((state) => state.users)
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimumLoadingTimeMet, setIsMinimumLoadingTimeMet] = useState(false)

  useEffect(() => {
    if (userStates.status === REQUEST_STATE.LOGGINGOUT) {
      dispatch(resetTrips())
      dispatch(resetPreferences())
      dispatch(resetView())
      dispatch(resetMap())
      dispatch(resetModalsDisplayed())
      dispatch(updateAsLoggedOut())
    }
  }, [dispatch, userStates])

  useEffect(() => {
    if (userStates.status === REQUEST_STATE.LOGGEDIN) {
      navigate('/home')
      if (userStates.isNewAccount) dispatch(setAppView(AppView.NEW_TRIP))
      setIsMinimumLoadingTimeMet(true)
    }
  }, [dispatch, navigate, userStates])

  useEffect(() => {
    if (
      tripsStatus === REQUEST_STATE.IDLE &&
      userStates.status === REQUEST_STATE.LOGGEDIN
    ) {
      dispatch(fetchTripsAsync(userStates.user.id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, tripsStatus, userStates])

  useEffect(() => {
    if (
      (tripsStatus === REQUEST_STATE.WRITING &&
        userStates.status === REQUEST_STATE.LOGGEDIN) ||
      userStates.status === REQUEST_STATE.READING
    ) {
      setIsLoading(true)
      setIsMinimumLoadingTimeMet(false)
      setTimeout(() => {
        setIsMinimumLoadingTimeMet(true)
      }, 3000)
    }
  }, [tripsStatus, userStates])

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
    if (
      userStates.status !== REQUEST_STATE.READING &&
      isMinimumLoadingTimeMet
    ) {
      setIsLoading(false)
      if (userStates.status === REQUEST_STATE.REJECTED)
        dispatch(updateAsLoggedOut())
    }
  }, [userStates, isMinimumLoadingTimeMet, dispatch])

  return (
    <>
      {isLoading && <Loader />}
      {children}
    </>
  )
}
