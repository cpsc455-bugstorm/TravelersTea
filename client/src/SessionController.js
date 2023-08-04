import { useSnackbar } from 'notistack'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Loader } from './components/common'
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
import { fetchLimitLeftAsync } from './redux/reducers/users/thunks'

SessionController.propTypes = {
  children: PropTypes.node,
}

export function SessionController({ children }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const activeTripId = useSelector((state) => state.view.activeTripId)
  const modalStates = useSelector((state) => state.modals)
  const tripsStates = useSelector((state) => state.trips)
  const stagesStates = useSelector((state) => state.stages)
  const userStates = useSelector((state) => state.users)
  const [isLoading, setIsLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const storedTokenExists = localStorage.getItem('travelersTea_accessToken')
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
      dispatch(fetchLimitLeftAsync())
      delaySetLoadingFalse(2500, () => dispatch(updateAsLoggedIn()))
    } else if (userStates.status === REQUEST_STATE.REJECTED) {
      delaySetLoadingFalse(2500, () => dispatch(updateAsLoggedOut()))
    }
  }, [userStates.status, dispatch])

  useEffect(() => {
    if (tripsStates.error) {
      enqueueSnackbar(tripsStates.error, { variant: 'error' })
      dispatch(clearTripsError())
      dispatch(openSidebar())
    }
  }, [dispatch, enqueueSnackbar, tripsStates.error])

  useEffect(() => {
    if (stagesStates.error) {
      enqueueSnackbar(stagesStates.error, { variant: 'error' })
      dispatch(clearStagesError())
      dispatch(openSidebar())
    }
  }, [dispatch, enqueueSnackbar, stagesStates.error])

  useEffect(() => {
    if (userStates.error) {
      setTimeout(() => {
        enqueueSnackbar('Error: Invalid Credentials', { variant: 'error' })
        dispatch(clearUserError())
      }, 2500)
    }
  }, [dispatch, enqueueSnackbar, userStates.error])

  useEffect(() => {
    if (
      modalStates.newTripModalIsOpen ||
      modalStates.editStageModalIsOpen ||
      modalStates.editTripModalIsOpen
    ) {
      enqueueSnackbar(
        `You have ${userStates.attemptLeft} trip creation/update requests left today`,
        { variant: userStates.attemptLeft > 3 ? 'info' : 'warning' },
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalStates, enqueueSnackbar])

  useEffect(() => {
    if (userStates.status === REQUEST_STATE.LOGGEDIN) {
      enqueueSnackbar(
        `You have ${userStates.attemptLeft} trip creation/update requests left today`,
        { variant: userStates.attemptLeft > 3 ? 'info' : 'warning' },
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enqueueSnackbar, userStates.status])

  useEffect(() => {
    let timer
    if (isLoading) {
      timer = setTimeout(() => {
        enqueueSnackbar('This may take a minute', { variant: 'info' })
      }, 3000)
    }
    return () => clearTimeout(timer)
  }, [enqueueSnackbar, isLoading])

  return (
    <>
      {isLoading && <Loader />}
      <SideBar
        shouldHide={userStates.status !== REQUEST_STATE.LOGGEDIN}
        isLoading={isLoading}
      />
      {children}
    </>
  )
}
