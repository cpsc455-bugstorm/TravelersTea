import { useSelector } from 'react-redux'
import { Pin } from './components/common'
import { SideBar } from './components/sideBar'
import { AppView } from './constants/enums'
import { MapElement } from './components/MapElement'
import { useMemo } from 'react'
import { TripViewContent } from './components/Timeline'
import blackGradient from './styles/blackGradient'

export function AppInterface() {
  const appView = useSelector((state) => state.view.appView)
  const isContentFullscreen = useSelector(
    (state) => state.view.fullscreenContent,
  )

  const dayViewContent = useMemo(() => {
    return (
      <div className='inline-flex w-full flex-row items-center justify-center border-b-4'>
        <Pin
          tailwindBgColor={'#ef4444'}
          emoji={'🏠'}
          titleText='Technically,'
          bodyText='this would show the emoji that represents your destination, but I am not coding that in tonight.'
        />
      </div>
    )
  }, [])

  const renderMainContent = useMemo(() => {
    let content = <></>
    if (appView === AppView.TRIP_VIEW) content = <TripViewContent />
    else if (appView === AppView.DAY_VIEW) content = dayViewContent

    let contentHeight = 'h-1/2'
    if (appView === AppView.NEW_TRIP) contentHeight = 'h-0'
    if (isContentFullscreen) contentHeight = 'h-full'

    return (
      <div
        className={`pointer-events-none fixed bottom-0 left-10 z-10 flex w-[calc(100%-2.5rem)] items-end overflow-x-hidden overflow-y-hidden ${blackGradient} ${contentHeight}`}
      >
        {content}
      </div>
    )
  }, [appView, dayViewContent, isContentFullscreen])

  return (
    <div className='h-screen w-screen overflow-hidden'>
      <MapElement className={`relative h-full w-full`} />
      {renderMainContent}
      <SideBar />
    </div>
  )
}
