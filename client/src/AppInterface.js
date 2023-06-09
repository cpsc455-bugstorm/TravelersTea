import { useSelector } from 'react-redux'
import { SideBar } from './components/sideBar'
import { AppView } from './constants/enums'
import { MapElement } from './components/MapElement'
import { useMemo } from 'react'
import { DayViewContent, TripViewContent } from './components/Views'

export function AppInterface() {
  const appView = useSelector((state) => state.view.appView)

  const renderMainContent = useMemo(() => {
    let content = <></>
    if (appView === AppView.TRIP_VIEW) content = <TripViewContent />
    else if (appView === AppView.DAY_VIEW) content = <DayViewContent />

    return (
      <div
        className={`pointer-events-none absolute bottom-0 left-10 z-10 flex w-[calc(100%-2.5rem)] items-end overflow-x-hidden overflow-y-hidden transition-all ${
          appView === AppView.NEW_TRIP ? 'h-0' : 'h-full'
        }`}
      >
        {content}
      </div>
    )
  }, [appView])

  return (
    <div className='h-screen w-screen overflow-hidden'>
      <MapElement className={`relative h-full w-full`} />
      {renderMainContent}
      <SideBar />
    </div>
  )
}
