import { SeeMoreDrawer } from './SeeMoreDrawer'
import { useMemo } from 'react'
import { getTailwindName } from '../../util/tailwindColors'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveDayNumber, setAppView } from '../../redux/reducers/viewSlice'
import { AppView } from '../../constants/enums'

export function CompactTripView() {
  const dispatch = useDispatch()
  const stagesByDay = useSelector((state) => state.stages.stages)

  const renderCards = useMemo(() => {
    return stagesByDay.map((dayDetails, index) => {
      const dayNumber = index + 1
      const dayColor = dayDetails[0]['colorNumber']
      const colorName = getTailwindName(dayColor)

      return (
        <div
          className={`z-[5] my-2 w-full rounded-md bg-gradient-to-br from-black to-slate-950/80 hover:to-${colorName}-950/80 cursor-pointer p-4`}
          key={`day-${dayNumber}`}
          onClick={() => {
            dispatch(setActiveDayNumber(dayNumber))
            dispatch(setAppView(AppView.DAY_VIEW))
          }}
        >
          <p
            className={`flex justify-center border-b-2 text-xl font-semibold text-slate-200 border-${colorName}-500 mb-2 pb-1`}
          >
            {`Day ${dayNumber}`}
          </p>
          {dayDetails.map((stage, index) => {
            return (
              <p
                className={'text-lg text-slate-100'}
                key={`compact-${dayNumber}-${index}`}
              >
                {`${stage['emoji']} ${stage['stageLocation']}`}
              </p>
            )
          })}
        </div>
      )
    })
  }, [dispatch, stagesByDay])

  return (
    <div className='flex h-full w-full flex-col items-end justify-end'>
      <div
        className={
          'pointer-events-auto relative m-4 hidden h-full w-1/3 overflow-hidden rounded-md city-skyline md:block'
        }
      >
        <div
          className={
            'h-full overflow-y-scroll rounded-md bg-slate-950/10 px-2 mac-scrollbar'
          }
        >
          {renderCards}
        </div>
      </div>
      <div className={'w-full bg-gradient-to-t from-black to-transparent'}>
        <SeeMoreDrawer />
      </div>
    </div>
  )
}
