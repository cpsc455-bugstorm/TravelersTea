import { TeaCup } from './TeaCup'
import { Button } from '../common'
import { toggleContentFullscreen } from '../../redux/reducers/viewSlice'
import { useEffect, useMemo, useState } from 'react'
import TripViewJson from '../../temp/tripViewData.json'
import { useDispatch, useSelector } from 'react-redux'

export function TripViewContent() {
  const activeTripId = useSelector((state) => state.view.activeTripId)
  const isContentFullscreen = useSelector(
    (state) => state.view.fullscreenContent,
  )
  const dispatch = useDispatch()

  const [tripData, setTripData] = useState([])

  useEffect(() => {
    const endIndex = 1 + activeTripId * 3
    const data = TripViewJson.slice(0, endIndex)
    setTripData(data)
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
      return (
        <div
          key={`details-${dayNumber}`}
          className={`${item['color']} my-2 box-border w-full rounded-md bg-opacity-40 p-4`}
        >
          <h3 className='text-lg font-bold'>Day {dayNumber}</h3>
          {item['stages'].map((stage, stageIndex) => {
            return (
              <div key={`details-${dayNumber}-${stageIndex}`} className='p-2'>
                <p className='font-semibold'>
                  {stage['stageName']}: {stage['locationName']}
                </p>
                <p>⤷ {stage['description']}</p>
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
        className={`pointer-events-auto flex w-full items-end overflow-x-scroll p-8 pt-0 mac-scrollbar`}
      >
        {teaCups}
      </div>
    )
  }, [teaCups])

  const renderShowMoreLessButton = useMemo(() => {
    return (
      <Button
        className={`font-bolder pointer-events-auto h-8 w-full cursor-pointer rounded-none bg-gradient-to-r py-1 transition-all duration-300 hover:from-slate-300 hover:via-transparent hover:to-slate-300 
          ${isContentFullscreen ? '' : 'hover:h-9'}`}
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
          ${isContentFullscreen ? 'h-1/2 p-2' : 'h-0'}`}
      >
        {cardContent}
      </div>
    )
  }, [cardContent, isContentFullscreen])

  return (
    <div className='flex h-full w-full flex-col justify-end'>
      {renderTeacupRow}
      {renderShowMoreLessButton}
      {renderDetails}
    </div>
  )
}
