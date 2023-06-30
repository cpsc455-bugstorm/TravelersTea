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

  useEffect(() => {
    if (
      tripsStatus === REQUEST_STATE.WRITING ||
      tripsStatus === REQUEST_STATE.IDLE
    ) {
      if (tripsStatus !== REQUEST_STATE.IDLE) setIsLoading(true)
      dispatch(fetchTripsAsync())
    }
  }, [dispatch, tripsStatus])

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false)
      }, 2500)
    }
  }, [isLoading])

  return (
    <>
      {isLoading && <Loader />}
      {children}
    </>
  )
}
