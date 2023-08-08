import { SeeMoreDrawer } from './SeeMoreDrawer'
import { useMemo } from 'react'
import { getTailwindName } from '../../util/tailwindColors'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveDayNumber, setAppView } from '../../redux/reducers/viewSlice'
import { AppView } from '../../constants/enums'
import { getSlate } from '../../util/lightMode'

export function CompactTripView() {
  const dispatch = useDispatch()
  const stagesByDay = useSelector((state) => state.stages.stages)
  const isLightMode = useSelector((state) => state.preferences.lightMode)

  const renderCards = useMemo(() => {
    return stagesByDay.map((dayDetails, index) => {
      const dayNumber = index + 1
      const dayColor = dayDetails[0]['colorNumber']
      const colorName = getTailwindName(dayColor)

      return (
        <div
          className={`z-[5] my-2 w-full cursor-pointer rounded-md bg-gradient-to-br p-4
          ${
            isLightMode
              ? `from-white to-slate-50/80 hover:to-${colorName}-100/80`
              : `from-black to-slate-950/80 hover:to-${colorName}-950/80`
          }`}
          key={`day-${dayNumber}`}
          onClick={() => {
            dispatch(setActiveDayNumber(dayNumber))
            dispatch(setAppView(AppView.DAY_VIEW))
          }}
        >
          <p
            className={`flex justify-center border-b-2 text-xl font-semibold border-${colorName}-500 mb-2 pb-1
            ${getSlate(isLightMode, 'text', 200)}`}
          >
            {`Day ${dayNumber}`}
          </p>
          {dayDetails.map((stage, index) => {
            return (
              <p
                className={`text-lg ${getSlate(isLightMode, 'text', 100)}`}
                key={`compact-${dayNumber}-${index}`}
              >
                {`${stage['emoji']} ${stage['stageLocation']}`}
              </p>
            )
          })}
        </div>
      )
    })
  }, [dispatch, isLightMode, stagesByDay])

  return (
    <div className='flex h-full w-full flex-col items-end justify-end'>
      <div
        className={`pointer-events-auto relative m-4 hidden h-full w-1/3 overflow-hidden rounded-md city-skyline md:block
          ${isLightMode ? 'city-skyline-light' : 'city-skyline'}`}
      >
        <div
          className={`h-full overflow-y-scroll rounded-md px-2 
            ${
              isLightMode
                ? 'bg-slate-100/10 mac-scrollbar-light'
                : 'bg-slate-950/10 mac-scrollbar'
            }`}
        >
          {renderCards}
        </div>
      </div>
      <div
        className={`w-full bg-gradient-to-t to-transparent ${
          isLightMode ? 'from-white' : 'from-black'
        }`}
      >
        <SeeMoreDrawer />
      </div>
    </div>
  )
}
