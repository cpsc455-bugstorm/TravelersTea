import { useEffect, useMemo, useState } from 'react'
import { getColorName } from '../../utils/translateTailwindColors'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../common'
import { toggleContentFullscreen } from '../../redux/reducers/viewSlice'
import TripViewJson from '../../temp/tripViewData.json'

export function SeeMoreDrawer() {
  const activeTripId = useSelector((state) => state.view.activeTripId)

  const dispatch = useDispatch()
  const [tripData, setTripData] = useState([])

  useEffect(() => {
    // TODO edit this entire block to fetch from backend
    // id is uuid, can't use activeTripId here
    const endIndex = 1 + (Math.floor(Math.random() * 3) + 1) * 3
    const mockData = TripViewJson.slice(0, endIndex)
    setTripData(mockData)
  }, [activeTripId])

  const isContentFullscreen = useSelector(
    (state) => state.view.fullscreenContent,
  )

  const seeMoreCardContent = useMemo(() => {
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
                <p className={'text-white'}>⤷ {stage['description']}</p>
              </div>
            )
          })}
        </div>
      )
    })
  }, [tripData])

  const renderShowMoreLessButton = useMemo(() => {
    return (
      <Button
        className={`pointer-events-auto m-2 h-8 w-[calc(100%-1rem)] cursor-pointer rounded-md bg-white/5 py-1 font-bold text-white hover:bg-slate-500/20`}
        onClick={() => {
          dispatch(toggleContentFullscreen())
        }}
      >
        See {isContentFullscreen ? 'Less' : 'More'}
      </Button>
    )
  }, [isContentFullscreen, dispatch])

  return (
    <>
      {renderShowMoreLessButton}
      <div
        className={`pointer-events-auto w-full overflow-y-auto bg-transparent 
          ${
            isContentFullscreen ? 'max-h-[50vh] p-4 pt-0' : 'max-h-0'
          } transition-all duration-500 ease-in-out`}
      >
        {seeMoreCardContent}
      </div>
    </>
  )
}
