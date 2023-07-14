import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../common'
import { toggleShowDrawer } from '../../redux/reducers/viewSlice'
import { getTailwindName } from '../../util/tailwindColors'

export function SeeMoreDrawer() {
  const stagesByDay = useSelector((state) => state.stages.stages)

  const dispatch = useDispatch()

  const showDrawer = useSelector((state) => state.view.showDrawer)

  const seeMoreCardContent = useMemo(() => {
    return stagesByDay.map((dayDetails, index) => {
      const dayNumber = index + 1
      const dayColor = dayDetails[0]['colorNumber']
      const colorName = getTailwindName(dayColor)

      return (
        <div
          key={`details-${dayNumber}`}
          className={`from-${colorName}-400/70 to-${colorName}-500/70 my-4 box-border w-full rounded-md bg-gradient-to-br p-4 shadow-xl`}
        >
          <h3 className='text-lg font-bold text-white'>Day {dayNumber}</h3>
          {dayDetails.map((stage, stageIndex) => {
            return (
              <div
                key={`details-${dayNumber}-${stageIndex}`}
                className='p-2 text-white'
              >
                <p className='font-semibold text-white'>
                  Stage {stage['stageIndex']}: {stage['locationName']}
                </p>
                <p className={'text-white'}>⤷ {stage['description']}</p>
              </div>
            )
          })}
        </div>
      )
    })
  }, [stagesByDay])

  const renderShowMoreLessButton = useMemo(() => {
    return (
      <Button
        className={`pointer-events-auto m-2 h-8 w-[calc(100%-1rem)] cursor-pointer rounded-md bg-white/5 py-1 font-bold text-white hover:bg-slate-500/20`}
        onClick={() => {
          dispatch(toggleShowDrawer())
        }}
      >
        See {showDrawer ? 'Less' : 'More'}
      </Button>
    )
  }, [showDrawer, dispatch])

  return (
    <>
      {renderShowMoreLessButton}
      <div
        className={`pointer-events-auto w-full overflow-y-auto bg-transparent transition-all duration-500 ease-in-out mac-scrollbar
          ${showDrawer ? 'max-h-[50vh] p-4 pt-0' : 'max-h-0'}`}
      >
        {seeMoreCardContent}
      </div>
    </>
  )
}
