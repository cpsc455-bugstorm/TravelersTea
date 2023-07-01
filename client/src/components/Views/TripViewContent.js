import { TeaCup } from './TeaCup'
import { useEffect, useMemo, useState } from 'react'
import TripViewJson from '../../temp/tripViewData.json'
import { useSelector } from 'react-redux'
import { SeeMoreDrawer } from './SeeMoreDrawer'
import { TripSidePanelSingle } from './TripSidePanelSingle'

export function TripViewContent() {
  const activeTripId = useSelector((state) => state.view.activeTripId)

  const [tripData, setTripData] = useState([])

  useEffect(() => {
    // TODO edit this entire block to fetch from backend
    // id is uuid, can't use activeTripId here
    const endIndex = 1 + (Math.floor(Math.random() * 3) + 1) * 3
    const mockData = TripViewJson.slice(0, endIndex)
    setTripData(mockData)
  }, [activeTripId])

  const teaCups = useMemo(() => {
    return tripData.map((item, index) => {
      const displayNumber = index + 1
      return (
        <TeaCup
          key={`overview-pin-${index}`}
          colorNumber={item[0]['colorNumber']}
          displayNumber={displayNumber}
          titleText={'Day ' + displayNumber}
          locationNames={item['stages'].map((stage) => stage['stageLocation'])}
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
      <TripSidePanelSingle />
      {renderTeacupRow}
      <SeeMoreDrawer />
    </div>
  )
}
