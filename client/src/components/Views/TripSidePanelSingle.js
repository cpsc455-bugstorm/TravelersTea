import { useEffect, useMemo, useState } from 'react'
import { TeaCup } from './TeaCup'
import { Button } from '../common'
import { setAppView } from '../../redux/reducers/viewSlice'
import { AppView } from '../../constants/enums'
import { useDispatch, useSelector } from 'react-redux'
import TripViewJson from '../../temp/tripViewData.json'
import { getColorName } from '../../utils/translateTailwindColors'

export function TripSidePanelSingle() {
  const activeDayNumber = useSelector((state) => state.view.activeDayNumber)
  const dispatch = useDispatch()
  const [dayDetails, setDayDetails] = useState()

  useEffect(() => {
    // TODO this logic needs to fetch the right trip ID when we have real data
    setDayDetails(TripViewJson[activeDayNumber - 1])
  }, [activeDayNumber])

  const renderStages = useMemo(() => {
    if (!dayDetails) return <></>

    return dayDetails['stages'].map((stage, index) => {
      const toColor = `to-${getColorName(dayDetails['color'])}-400/${
        index * 10 + 10
      }`
      return (
        <div
          className={`bg-gradient-to-r from-transparent ${toColor} pb-6  pt-6`}
          key={`details-${activeDayNumber}-${index}`}
        >
          <p className={'text-xl font-semibold text-slate-100'}>
            {stage['locationName']}
          </p>
          <p className={'text-lg text-slate-100'}>{stage['description']}</p>
        </div>
      )
    })
  }, [activeDayNumber, dayDetails])

  return (
    <div
      className={
        'pointer-events-auto relative m-4 flex h-full w-1/3 flex-col items-center justify-center overflow-hidden rounded-md bg-slate-900 text-center'
      }
    >
      {dayDetails && (
        <>
          <TeaCup
            className='my-4 flex w-full shrink-0 justify-center'
            tailwindBgColor={dayDetails['color']}
            displayNumber={activeDayNumber}
          />
          <div className='w-full overflow-y-auto overflow-x-hidden px-8 mac-scrollbar'>
            {renderStages}
          </div>
          <div className='h-20 w-full shrink-0' />
          <Button
            className={`${dayDetails['color']} absolute bottom-4 right-4 h-14 w-24 text-4xl font-semibold hover:scale-[101%]`}
            onClick={() => dispatch(setAppView(AppView.DAY_VIEW))}
          >
            Go
          </Button>
        </>
      )}
    </div>
  )
}
