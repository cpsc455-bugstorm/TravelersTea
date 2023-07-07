import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from './components/common'
import { fetchTripsAsync } from './redux/reducers/trip/thunks'
import { REQUEST_STATE } from './redux/states'

SessionController.propTypes = {
  children: PropTypes.node,
}

export function SessionController({ children }) {
  const dispatch = useDispatch()
  const tripsStatus = useSelector((state) => state.trip.status)
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimumLoadingTimeMet, setIsMinimumLoadingTimeMet] = useState(false)

  useEffect(() => {
    if (tripsStatus === REQUEST_STATE.IDLE) {
      dispatch(fetchTripsAsync())
    }
  }, [dispatch, tripsStatus])

  useEffect(() => {
    if (tripsStatus === REQUEST_STATE.WRITING) {
      setIsLoading(true)
      setIsMinimumLoadingTimeMet(false)
      setTimeout(() => {
        setIsMinimumLoadingTimeMet(true)
      }, 3000)
    }
  }, [tripsStatus])

  useEffect(() => {
    if (
      (tripsStatus === REQUEST_STATE.FULFILLED ||
        tripsStatus === REQUEST_STATE.REJECTED) &&
      isMinimumLoadingTimeMet
    ) {
      setIsLoading(false)
    }
  }, [tripsStatus, isMinimumLoadingTimeMet])

  return (
    <>
      {isLoading && <Loader />}
      {children}
    </>
  )
}
