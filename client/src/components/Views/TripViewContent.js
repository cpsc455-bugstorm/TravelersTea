import { TeaCup } from './TeaCup'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SeeMoreDrawer } from './SeeMoreDrawer'
import { TripSidePanelSingle } from './TripSidePanelSingle'
import { fetchStagesByTripIdAsync } from '../../redux/reducers/stage/thunks'

export function TripViewContent() {
  const activeTripId = useSelector((state) => state.view.activeTripId)
  const stagesByDay = useSelector((state) => state.stages.stages)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchStagesByTripIdAsync(activeTripId))
  }, [activeTripId, dispatch])

  const teaCups = useMemo(() => {
    return stagesByDay.map((item, index) => {
      const displayNumber = index + 1
      return (
        <TeaCup
          key={`overview-pin-${index}`}
          colorNumber={item[0]['colorNumber']}
          displayNumber={displayNumber}
          titleText={'Day ' + displayNumber}
          stageLocations={item.map((stage) => stage['locationName'])}
        />
      )
    })
  }, [stagesByDay])

  const renderTeacupRow = useMemo(() => {
    return (
      <div
        className={`black-gradient pointer-events-auto z-[5] flex w-full shrink-0 items-end overflow-y-hidden overflow-x-scroll px-4 pt-8 mac-scrollbar`}
      >
        {teaCups}
      </div>
    )
  }, [teaCups])

  return (
    <div
      className={`black-gradient flex h-full w-full flex-col items-end justify-end`}
    >
      <TripSidePanelSingle />
      {renderTeacupRow}
      <SeeMoreDrawer />
    </div>
  )
}
