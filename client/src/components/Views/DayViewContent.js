import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../common'
import { setAppView } from '../../redux/reducers/viewSlice'
import { AppView } from '../../constants/enums'

export function DayViewContent() {
  const activeDayNumber = useSelector((state) => state.view.activeDayNumber)
  const stagesByDay = useSelector((state) => state.stages.stages)
  const dispatch = useDispatch()

  const [stages, setStages] = useState([])

  useEffect(() => {
    setStages(stagesByDay[activeDayNumber - 1])
  }, [activeDayNumber, stagesByDay])

  const generateStage = useCallback((stageInfo, index) => {
    return (
      <div className='grid grid-cols-5 py-2' key={`stage-${index}`}>
        <div className='z-[5] w-20 text-center text-5xl'>
          {stageInfo['emoji']}
        </div>
        <div className='col-span-4 box-border rounded-md border-2 border-slate-100 bg-slate-200/90 p-2 shadow-xl'>
          <p className='text-lg font-bold'>{stageInfo['stageLocation']}</p>
          <p className='text-base font-normal'>{stageInfo['description']}</p>
        </div>
      </div>
    )
  }, [])

  const renderStages = useMemo(() => {
    const stagesContent = stages?.map((stageInfo, index) => {
      return generateStage(stageInfo, index)
    })

    return (
      <div className='h-full overflow-y-auto p-4 mac-scrollbar'>
        {stagesContent}
      </div>
    )
  }, [stages, generateStage])

  const openTripView = useCallback(() => {
    dispatch(setAppView(AppView.TRIP_VIEW))
  }, [dispatch])

  const renderTimelineLine = useMemo(() => {
    return (
      <div
        className={`absolute left-0 top-0 h-full w-14 border-r-4 border-slate-600`}
      />
    )
  }, [])

  return (
    <>
      <Button
        className='absolute left-4 top-4 border-2 border-slate-950 bg-slate-800 px-4 text-slate-100 shadow-xl hover:bg-slate-700'
        onClick={openTripView}
      >
        ← Back
      </Button>
      <div className='pointer-events-auto absolute right-0 box-border h-full w-5/6 overflow-y-hidden lg:w-1/3'>
        {stages && renderStages}
        {renderTimelineLine}
      </div>
    </>
  )
}
