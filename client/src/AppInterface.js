import { useSelector } from 'react-redux'
import { Pin } from './components/common'
import { SideBar } from './components/sideBar'
import { AppView } from './constants/enums'
import { MapElement } from './components/MapElement'
import { useMemo, useState, useEffect } from 'react'
import { changeCoordinatesAndZoom } from './redux/reducers/mapSlice'
import { ZOOM_CITY_LEVEL } from './constants/mapDefaultInfo'
import { TripViewContent } from './components/Timeline'

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
        className={`pointer-events-none fixed bottom-0 left-10 z-10 flex w-[calc(100%-2.5rem)] items-end overflow-x-hidden overflow-y-hidden bg-gradient-to-b from-transparent to-slate-100 transition-all ${contentHeight}`}
      >
        {content}
      </div>
    )
  }, [appView, dayViewContent, isContentFullscreen])

  return (
    <div className='h-screen w-screen overflow-hidden'>
      <MapElement className={`relative left-10 h-full w-[calc(100%-2.5rem)]`} />
      {renderMainContent}
      <SideBar />
    </div>
  )
}
