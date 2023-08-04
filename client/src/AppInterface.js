import { useSelector } from 'react-redux'
import { AppView } from './constants/enums'
import { MapElement } from './components/MapElement'
import { useMemo } from 'react'
import {
  CompactTripView,
  DayViewContent,
  NonCompactTripView,
} from './components/Views'

export function AppInterface() {
  const appView = useSelector((state) => state.view.appView)
  const isCompactView = useSelector((state) => state.preferences.compactView)

  const renderMainContent = useMemo(() => {
    let content = <></>
    if (appView === AppView.TRIP_VIEW)
      content = isCompactView ? <CompactTripView /> : <NonCompactTripView />
    else if (appView === AppView.DAY_VIEW) content = <DayViewContent />

    return (
      <div
        className={`pointer-events-none absolute bottom-0 z-10 flex w-full items-end overflow-x-hidden overflow-y-hidden transition-all ${
          appView === AppView.NEW_TRIP ? 'h-0' : 'h-full'
        }`}
      >
        {content}
      </div>
    )
  }, [appView, isCompactView])

  return (
    <div className='h-screen w-screen overflow-hidden'>
      <MapElement className={`relative h-full w-full`} />
      {renderMainContent}
    </div>
  )
}
