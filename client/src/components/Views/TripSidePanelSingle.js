import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppView } from '../../constants/enums'
import {
  setActiveDayNumber,
  setAppView,
  setShowSidePanel,
} from '../../redux/reducers/viewSlice'
import { getBg400, getTailwindName } from '../../util/tailwindColors'
import { Button } from '../common'
import MugRating from './MugRating'
import { TeaCup } from './TeaCup'

export function TripSidePanelSingle() {
  const activeDayNumber = useSelector((state) => state.view.activeDayNumber)
  const showDrawer = useSelector((state) => state.view.showDrawer)
  const showSidePanel = useSelector((state) => state.view.showSidePanel)
  const stagesByDay = useSelector((state) => state.stages.stages)
  const isLightMode = useSelector((state) => state.preferences.lightMode)
  const dispatch = useDispatch()
  const [dayDetails, setDayDetails] = useState()
  const visibilityTimer = useRef(null)

  useEffect(() => {
    setDayDetails(stagesByDay[activeDayNumber - 1])
  }, [activeDayNumber, stagesByDay])

  useEffect(() => {
    if (!showDrawer) {
      visibilityTimer.current = setTimeout(() => {
        dispatch(setShowSidePanel(true))
      }, 350)
    } else {
      clearTimeout(visibilityTimer.current)
      dispatch(setShowSidePanel(false))
    }
  }, [dispatch, showDrawer])

  const renderStages = useMemo(() => {
    if (!dayDetails) return <></>

    return dayDetails.map((stage, index) => {
      const dayColor = dayDetails[0]['colorNumber']
      const toColor = `to-${getTailwindName(dayColor)}-400/${Math.min(
        index * 10 + 10,
        100,
      )}`
      return (
        <div
          className={`bg-gradient-to-r from-transparent ${toColor} px-5 py-6`}
          key={`details-${activeDayNumber}-${index}`}
        >
          <div className={'text-xl font-semibold'}>
            {stage['stageLocation']}
            <MugRating rating={stage['stageRating']} />
          </div>
          <p className={'text-lg'}>{stage['description']}</p>
        </div>
      )
    })
  }, [activeDayNumber, dayDetails])

  return showSidePanel && dayDetails ? (
    <div
      className={`pointer-events-auto relative m-4 hidden w-1/3 flex-col items-center justify-center overflow-hidden rounded-md text-center drop-shadow-[10px_-10px_15px_rgba(150,150,150,0.25)] transition-all md:flex
        ${
          showSidePanel
            ? 'h-full scale-100 opacity-100'
            : 'h-0 scale-95 opacity-0'
        }
        ${isLightMode ? 'bg-slate-200' : 'bg-slate-900'}`}
    >
      <button
        onClick={() => {
          dispatch(setShowSidePanel(false))
          dispatch(setActiveDayNumber(-1))
        }}
        className={
          'absolute right-3 top-3 h-12 w-12 rounded-md text-slate-400 hover:bg-slate-200/10'
        }
      >
        <CloseIcon />
      </button>
      <div className='h-12 w-full shrink-0' />
      <TeaCup
        className='mb-4 flex w-full shrink-0 justify-center'
        colorNumber={dayDetails[0]['colorNumber']}
        displayNumber={activeDayNumber}
      />
      <div
        className={`w-full overflow-y-auto overflow-x-hidden px-8
        ${
          isLightMode
            ? 'text-slate-900 mac-scrollbar-light'
            : 'text-slate-100 mac-scrollbar'
        }`}
      >
        {renderStages}
      </div>
      <div className='h-[5.5rem] w-full shrink-0' />
      <Button
        className={`${getBg400(dayDetails[0]['colorNumber'])}
             absolute bottom-4 right-4 h-14 w-24 text-4xl font-semibold hover:scale-[101%]`}
        onClick={() => dispatch(setAppView(AppView.DAY_VIEW))}
      >
        Go
      </Button>
    </div>
  ) : (
    <></>
  )
}
