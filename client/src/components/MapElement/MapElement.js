import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { AppView } from '../../constants/enums'

MapElement.propTypes = {
  className: PropTypes.string,
}

export function MapElement({ className }) {
  const appView = useSelector((state) => state.view.appView)
  const activeTripId = useSelector((state) => state.view.activeTripId)

  const newTripForm = useMemo(() => {
    return (
      <div className="z-[5]">
        <span className="absolute top-1/2 inline-flex w-full flex-row justify-center">
          <h1 className="w-fit rounded-md bg-slate-100 bg-opacity-40 p-4 text-5xl">
            New Trip Form
          </h1>
        </span>
      </div>
    )
  }, [])

  const mapContent = useMemo(() => {
    if (appView === AppView.NEW_TRIP) {
      return newTripForm
    }
    return (
      <span className="absolute top-1/2 inline-flex w-full flex-row justify-center">
        <h1 className="w-fit rounded-md bg-slate-100 bg-opacity-40 p-4 text-5xl">
          Map (placeholder #{activeTripId})
        </h1>
      </span>
    )
  }, [appView, activeTripId])

  return (
    <div
      className={`bg-[url('../public/globe.png')] bg-cover bg-center ${className}`}
    >
      {mapContent}
    </div>
  )
}
