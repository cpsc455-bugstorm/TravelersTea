import { Alert, Snackbar } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Loader } from './components/common'
import { AppView } from './constants/enums'
import { resetMap } from './redux/reducers/mapSlice'
import { resetModalsDisplayed } from './redux/reducers/modalsSlice'
import { resetPreferences } from './redux/reducers/preferencesSlice'
import {
  clearStagesError,
  resetStages,
} from './redux/reducers/stage/stageSlice'
import { fetchStagesByTripIdAsync } from './redux/reducers/stage/thunks'
import { fetchTripsAsync } from './redux/reducers/trips/thunks'
import { clearTripsError, resetTrips } from './redux/reducers/trips/tripsSlice'
import {
  clearUserError,
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
  const tripsStates = useSelector((state) => state.trips)
  const stagesStates = useSelector((state) => state.stages)
  const userStates = useSelector((state) => state.users)
  const [isLoading, setIsLoading] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const delaySetLoadingFalse = () => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

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
    }
  }, [dispatch, navigate, userStates])

  useEffect(() => {
    if (
      ((tripsStates.status === REQUEST_STATE.WRITING ||
        stagesStates.status === REQUEST_STATE.WRITING) &&
        userStates.status === REQUEST_STATE.LOGGEDIN) ||
      userStates.status === REQUEST_STATE.READING
    ) {
      setIsLoading(true)
    }
  }, [tripsStates, userStates, stagesStates])

  useEffect(() => {
    if (
      tripsStates.status === REQUEST_STATE.IDLE &&
      userStates.status === REQUEST_STATE.LOGGEDIN
    ) {
      dispatch(fetchTripsAsync(userStates.user.id))
    }
  }, [dispatch, tripsStates.status, userStates])

  useEffect(() => {
    if (tripsStates.status === REQUEST_STATE.FULFILLED && activeTripId)
      dispatch(fetchStagesByTripIdAsync(activeTripId))
  }, [activeTripId, dispatch, tripsStates.status])

  useEffect(() => {
    if (
      (tripsStates.status === REQUEST_STATE.FULFILLED ||
        tripsStates.status === REQUEST_STATE.REJECTED) &&
      (stagesStates.status === REQUEST_STATE.FULFILLED ||
        stagesStates.status === REQUEST_STATE.REJECTED)
    ) {
      delaySetLoadingFalse()
    }
  }, [tripsStates.status, stagesStates.status])

  useEffect(() => {
    if (userStates.status === REQUEST_STATE.LOGGINGIN) {
      delaySetLoadingFalse()
      dispatch(updateAsLoggedIn())
    } else if (userStates.status === REQUEST_STATE.REJECTED) {
      delaySetLoadingFalse()
      dispatch(updateAsLoggedOut())
    }
  }, [userStates, dispatch])

  useEffect(() => {
    if (tripsStates.error) {
      setAlertMessage(tripsStates.error)
      setAlertOpen(true)
      dispatch(clearTripsError())
    }
  }, [dispatch, tripsStates.error])

  useEffect(() => {
    if (stagesStates.error) {
      setAlertMessage(stagesStates.error)
      setAlertOpen(true)
      dispatch(clearStagesError())
    }
  }, [dispatch, stagesStates.error])

  useEffect(() => {
    if (userStates.error) {
      setAlertMessage(userStates.error)
      setAlertOpen(true)
      dispatch(clearUserError())
    }
  }, [dispatch, userStates.error])

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setAlertOpen(false)
  }

  useEffect(() => {
    if (alertOpen) {
      const timer = setTimeout(() => {
        setAlertOpen(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [alertOpen])

  return (
    <>
      {isLoading && <Loader />}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={alertOpen}
        autoHideDuration={5000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity='error'
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      {children}
    </>
  )
}
