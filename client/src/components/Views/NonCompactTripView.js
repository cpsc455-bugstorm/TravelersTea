import { TeaCup } from './TeaCup'
import { useMemo } from 'react'
import { SeeMoreDrawer } from './SeeMoreDrawer'
import { TripSidePanelSingle } from './TripSidePanelSingle'
import { useSelector } from 'react-redux'

export function NonCompactTripView() {
  const stagesByDay = useSelector((state) => state.stages.stages)

  const teaCups = useMemo(() => {
    return stagesByDay.map((item, index) => {
      const displayNumber = index + 1
      return (
        <TeaCup
          key={`overview-pin-${index}`}
          colorNumber={item[0]['colorNumber']}
          displayNumber={displayNumber}
          titleText={'Day ' + displayNumber}
          stageLocations={item.map((stage) => stage['stageLocation'])}
        />
      )
    })
  }, [stagesByDay])

  const renderTeacupRow = useMemo(() => {
    return (
      <div
        className={`black-gradient pointer-events-auto z-[5] flex w-full shrink-0 items-end overflow-y-hidden overflow-x-scroll px-4 pt-8 mac-scrollbar`}
      >
        <div className={'w-10'}></div>
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
