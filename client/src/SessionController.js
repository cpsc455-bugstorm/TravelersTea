import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AlertSnackbar, Loader } from './components/common'
import { SideBar } from './components/sideBar'
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
import { openSidebar, resetView, setAppView } from './redux/reducers/viewSlice'
import { REQUEST_STATE } from './redux/states'

SessionController.propTypes = {
  children: PropTypes.node,
}

export function SessionController({ children }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const activeTripId = useSelector((state) => state.view.activeTripId)
  const newTripModalIsOpen = useSelector(
    (state) => state.modals.newTripModalIsOpen,
  )
  const editStageModalIsOpen = useSelector(
    (state) => state.modals.editStageModalIsOpen,
  )
  const appView = useSelector((state) => state.view.appView)
  const tripsStates = useSelector((state) => state.trips)
  const stagesStates = useSelector((state) => state.stages)
  const userStates = useSelector((state) => state.users)
  const [isLoading, setIsLoading] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [loadingAlertOpen, setLoadingAlertOpen] = useState(false)
  const storedTokenExists = localStorage.getItem('travelersTea_accessToken')
  const [severityType, setSeverityType] = useState('error')
  const delaySetLoadingFalse = (ms, callback = () => {}) => {
    setTimeout(() => {
      setIsLoading(false)
      callback()
    }, ms)
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
      userStates.status === REQUEST_STATE.IDLE ||
      userStates.status === REQUEST_STATE.REJECTED ||
      userStates.status === REQUEST_STATE.LOGGEDOUT
    ) {
      localStorage.removeItem('travelersTea_accessToken')
    }
  }, [userStates])

  useEffect(() => {
    if (
      tripsStates.status === REQUEST_STATE.IDLE &&
      userStates.status === REQUEST_STATE.LOGGEDIN &&
      storedTokenExists
    ) {
      dispatch(fetchTripsAsync())
    }
  }, [dispatch, tripsStates.status, userStates, storedTokenExists])

  useEffect(() => {
    if (tripsStates.status === REQUEST_STATE.FULFILLED && activeTripId)
      dispatch(fetchStagesByTripIdAsync(activeTripId))
  }, [activeTripId, dispatch, tripsStates.status])

  useEffect(() => {
    if (
      (tripsStates.status === REQUEST_STATE.FULFILLED ||
        tripsStates.status === REQUEST_STATE.REJECTED ||
        tripsStates.status === REQUEST_STATE.IDLE) &&
      (stagesStates.status === REQUEST_STATE.FULFILLED ||
        stagesStates.status === REQUEST_STATE.REJECTED ||
        stagesStates.status === REQUEST_STATE.IDLE)
    ) {
      delaySetLoadingFalse(1000)
    }
  }, [tripsStates.status, stagesStates.status])

  useEffect(() => {
    if (userStates.status === REQUEST_STATE.LOGGINGIN) {
      delaySetLoadingFalse(2500, () => dispatch(updateAsLoggedIn()))
    } else if (userStates.status === REQUEST_STATE.REJECTED) {
      delaySetLoadingFalse(2500, () => dispatch(updateAsLoggedOut()))
    }
  }, [userStates, dispatch])

  useEffect(() => {
    if (tripsStates.error) {
      setAlertMessage(tripsStates.error)
      setSeverityType('error')
      setAlertOpen(true)
      setIsLoading(false)
      dispatch(clearTripsError())
      dispatch(openSidebar())
    }
  }, [dispatch, tripsStates.error])

  useEffect(() => {
    if (stagesStates.error) {
      setAlertMessage(stagesStates.error)
      setSeverityType('error')
      setAlertOpen(true)
      setIsLoading(false)
      dispatch(clearStagesError())
      dispatch(openSidebar())
    }
  }, [dispatch, stagesStates.error])

  useEffect(() => {
    if (userStates.error) {
      setTimeout(() => {
        setAlertMessage('Error: Invalid Credentials')
        setSeverityType('error')
        setAlertOpen(true)
        dispatch(clearUserError())
        setIsLoading(false)
      }, 2500)
    }
  }, [dispatch, userStates.error])

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setAlertOpen(false)
  }

  useEffect(() => {
    if (
      userStates.status === REQUEST_STATE.LOGGEDIN &&
      ((appView === AppView.NEW_TRIP && newTripModalIsOpen) ||
        editStageModalIsOpen)
    ) {
      setAlertMessage(
        `You have ${userStates.attemptLeft} requests to create/update trips left today`,
      )
      setSeverityType('info')
      setAlertOpen(true)
    }
  }, [
    userStates.status,
    userStates.attemptLeft,
    newTripModalIsOpen,
    editStageModalIsOpen,
    appView,
  ])

  useEffect(() => {
    if (alertOpen) {
      const timer = setTimeout(() => {
        setAlertOpen(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [alertOpen])

  useEffect(() => {
    let timer
    if (isLoading) {
      timer = setTimeout(() => {
        setLoadingAlertOpen(true)
      }, 3000)
    } else {
      setLoadingAlertOpen(false)
    }
    return () => clearTimeout(timer)
  }, [isLoading])

  return (
    <>
      {isLoading && <Loader />}
      <SideBar
        shouldHide={userStates.status !== REQUEST_STATE.LOGGEDIN}
        isLoading={isLoading}
      />
      <AlertSnackbar
        open={alertOpen}
        handleClose={handleCloseAlert}
        message={alertMessage}
        severity={severityType}
      />
      <AlertSnackbar
        open={loadingAlertOpen}
        handleClose={() => setLoadingAlertOpen(false)}
        message='This may take a minute!'
        severity='info'
      />
      {children}
    </>
  )
}
