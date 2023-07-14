import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Loader } from './components/common'
import { AppView } from './constants/enums'
import { resetMap } from './redux/reducers/mapSlice'
import { resetModalsDisplayed } from './redux/reducers/modalsSlice'
import { resetPreferences } from './redux/reducers/preferencesSlice'
import { resetStages } from './redux/reducers/stage/stageSlice'
import { fetchStagesByTripIdAsync } from './redux/reducers/stage/thunks'
import { fetchTripsAsync } from './redux/reducers/trips/thunks'
import { resetTrips } from './redux/reducers/trips/tripsSlice'
import {
  updateAsLoggedIn,
  updateAsLoggedOut,
} from './redux/reducers/users/usersSlice'
import { resetView, setAppView } from './redux/reducers/viewSlice'
import { REQUEST_STATE } from './redux/states'

SessionController.propTypes = {
  children: PropTypes.node,
}

export function SessionController({ children }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const activeTripId = useSelector((state) => state.view.activeTripId)
  const tripsStatus = useSelector((state) => state.trips.status)
  const stagesStatus = useSelector((state) => state.stages.status)
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
      dispatch(resetStages())
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
    if (tripsStatus === REQUEST_STATE.FULFILLED && activeTripId)
      dispatch(fetchStagesByTripIdAsync(activeTripId))
  }, [activeTripId, dispatch, tripsStatus])

  useEffect(() => {
    if (
      ((tripsStatus === REQUEST_STATE.WRITING ||
        stagesStatus === REQUEST_STATE.WRITING) &&
        userStates.status === REQUEST_STATE.LOGGEDIN) ||
      userStates.status === REQUEST_STATE.READING
    ) {
      setIsLoading(true)
      setIsMinimumLoadingTimeMet(false)
      setTimeout(() => {
        setIsMinimumLoadingTimeMet(true)
      }, 3000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripsStatus, userStates, stagesStatus])

  useEffect(() => {
    if (
      (tripsStatus === REQUEST_STATE.FULFILLED ||
        tripsStatus === REQUEST_STATE.REJECTED) &&
      (stagesStatus === REQUEST_STATE.FULFILLED ||
        stagesStatus === REQUEST_STATE.REJECTED) &&
      isMinimumLoadingTimeMet
    ) {
      setIsLoading(false)
    }
  }, [tripsStatus, isMinimumLoadingTimeMet, stagesStatus])

  useEffect(() => {
    if (
      userStates.status === REQUEST_STATE.LOGGINGIN &&
      isMinimumLoadingTimeMet
    ) {
      setIsLoading(false)
      dispatch(updateAsLoggedIn())
    } else if (
      userStates.status === REQUEST_STATE.REJECTED &&
      isMinimumLoadingTimeMet
    ) {
      setIsLoading(false)
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
