import { useSelector } from 'react-redux'
import { SideBar } from './components/sideBar'
import { AppView } from './constants/enums'
import { MapElement } from './components/MapElement'
import { useMemo } from 'react'
import { DayViewContent, TripViewContent } from './components/Views'

export function AppInterface() {
  const appView = useSelector((state) => state.view.appView)
  const isContentFullscreen = useSelector(
    (state) => state.view.fullscreenContent,
  )

  const renderMainContent = useMemo(() => {
    let content = <></>
    if (appView === AppView.TRIP_VIEW) content = <TripViewContent />
    else if (appView === AppView.DAY_VIEW) content = <DayViewContent />

    let contentHeight = 'h-1/2'
    if (appView === AppView.NEW_TRIP) contentHeight = 'h-0'
    if (isContentFullscreen) contentHeight = 'h-full'

    return (
      <div
        className={`pointer-events-none absolute bottom-0 left-10 z-10 flex w-[calc(100%-2.5rem)] items-end overflow-x-hidden overflow-y-hidden transition-all ${contentHeight}`}
      >
        {content}
      </div>
    )
  }, [appView, isContentFullscreen])

  return (
    <div className='h-screen w-screen overflow-hidden'>
      <MapElement className={`relative left-10 h-full w-[calc(100%-2.5rem)]`} />
      {renderMainContent}
      <SideBar />
    </div>
  )
}
