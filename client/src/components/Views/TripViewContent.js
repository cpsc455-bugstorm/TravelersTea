import { TeaCup } from './TeaCup'
import { Button } from '../common'
import { toggleContentFullscreen } from '../../redux/reducers/viewSlice'
import { useEffect, useMemo, useState } from 'react'
import TripViewJson from '../../temp/tripViewData.json'
import { useDispatch, useSelector } from 'react-redux'
import { getColorName } from '../../utils/translateTailwindColors'

export function TripViewContent() {
  const activeTripId = useSelector((state) => state.view.activeTripId)
  const isContentFullscreen = useSelector(
    (state) => state.view.fullscreenContent,
  )
  const dispatch = useDispatch()

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

  const cardContent = useMemo(() => {
    return tripData.map((item, index) => {
      const dayNumber = index + 1
      const colorName = getColorName(item['color'])

      return (
        <div
          key={`details-${dayNumber}`}
          className={`from-${colorName}-400/70 to-${colorName}-500/70 my-4 box-border w-full rounded-md bg-gradient-to-br p-4 shadow-xl`}
        >
          <h3 className='text-lg font-bold text-white'>Day {dayNumber}</h3>
          {item['stages'].map((stage, stageIndex) => {
            return (
              <div
                key={`details-${dayNumber}-${stageIndex}`}
                className='p-2 text-white'
              >
                <p className='font-semibold text-white'>
                  {stage['stageName']}: {stage['locationName']}
                </p>
                <p className={' text-white'}>⤷ {stage['description']}</p>
              </div>
            )
          })}
        </div>
      )
    })
  }, [tripData])

  const renderTeacupRow = useMemo(() => {
    return (
      <div
        className={`pointer-events-auto flex w-full items-end overflow-y-hidden overflow-x-scroll px-4 mac-scrollbar`}
      >
        {teaCups}
      </div>
    )
  }, [teaCups])

  const renderShowMoreLessButton = useMemo(() => {
    return (
      <Button
        className={`font-bolder pointer-events-auto h-8 w-full cursor-pointer rounded-none bg-gradient-to-r from-transparent to-transparent py-1 transition-all duration-300 hover:from-slate-300 hover:via-transparent hover:to-slate-300`}
        onClick={() => {
          dispatch(toggleContentFullscreen())
        }}
      >
        See {isContentFullscreen ? 'Less' : 'More'}
      </Button>
    )
  }, [isContentFullscreen, dispatch])

  const renderDetails = useMemo(() => {
    return (
      <div
        className={`pointer-events-auto w-full overflow-y-auto bg-slate-100 
          ${isContentFullscreen ? 'h-1/2 p-4' : 'h-0'}`}
      >
        {cardContent}
      </div>
    )
  }, [cardContent, isContentFullscreen])

  return (
    <div className='flex h-full w-full flex-col justify-end bg-gradient-to-b from-transparent to-slate-100'>
      {renderTeacupRow}
      {renderShowMoreLessButton}
      {renderDetails}
    </div>
  )
}
