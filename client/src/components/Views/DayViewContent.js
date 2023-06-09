import { useCallback, useEffect, useMemo, useState } from 'react'
import TripViewJson from '../../temp/tripViewData.json'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../common'
import { setAppView } from '../../redux/reducers/viewSlice'
import { AppView } from '../../constants/enums'

export function DayViewContent() {
  const activeDayNumber = useSelector((state) => state.view.activeDayNumber)
  const dispatch = useDispatch()

  const [stages, setStages] = useState([])

  useEffect(() => {
    // TODO edit this entire block to fetch from backend
    const mockData = TripViewJson[activeDayNumber - 1]
    setStages(mockData['stages'])
  }, [activeDayNumber])

  const generateStage = useCallback((stageInfo, index) => {
    return (
      <div className='grid grid-cols-5 py-2' key={`stage-${index}`}>
        <div className='z-[5] w-20 text-center text-5xl'>
          {stageInfo['emoji']}
        </div>
        <div className='col-span-4 box-border rounded-md bg-slate-200/90 p-2'>
          <p className='text-lg font-bold'>{stageInfo['locationName']}</p>
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
      <div className='absolute left-0 top-0 h-full w-14 border-r-4 border-slate-800' />
    )
  }, [])

  return (
    <>
      <Button
        className='absolute left-4 top-4 border-2 border-slate-400 bg-slate-200 px-4 hover:bg-slate-300'
        onClick={openTripView}
      >
        ← Back
      </Button>
      <div className='pointer-events-auto absolute right-0 box-border h-full w-1/3 overflow-y-hidden'>
        {stages && renderStages}
        {renderTimelineLine}
      </div>
    </>
  )
}
