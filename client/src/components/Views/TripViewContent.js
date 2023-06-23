import { TeaCup } from './TeaCup'
import { useEffect, useMemo, useState } from 'react'
import TripViewJson from '../../temp/tripViewData.json'
import { useSelector } from 'react-redux'
import { SeeMoreDrawer } from './SeeMoreDrawer'
import { TripSidePanelSingle } from './TripSidePanelSingle'

export function TripViewContent() {
  const activeTripId = useSelector((state) => state.view.activeTripId)
  const isCompactView = useSelector((state) => state.preferences.compactView)
  const isContentFullscreen = useSelector(
    (state) => state.view.fullscreenContent,
  )

  const [tripData, setTripData] = useState([])

  useEffect(() => {
    // TODO edit this entire block to fetch from backend
    const endIndex = 1 + activeTripId * 3
    const mockData = TripViewJson.slice(0, endIndex)
    setTripData(mockData)
  }, [activeTripId])

  const teaCups = useMemo(() => {
    return tripData.map((item, index) => {
      const displayNumber = index + 1
      return (
        <TeaCup
          key={`overview-pin-${index}`}
          tailwindBgColor={item.color}
          displayNumber={displayNumber}
          titleText={'Day ' + displayNumber}
          locationNames={item['stages'].map((stage) => stage['locationName'])}
        />
      )
    })
  }, [tripData])

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
      {!isCompactView && !isContentFullscreen && <TripSidePanelSingle />}
      {renderTeacupRow}
      <SeeMoreDrawer />
    </div>
  )
}
