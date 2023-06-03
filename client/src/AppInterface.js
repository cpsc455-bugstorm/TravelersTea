import { useDispatch, useSelector } from 'react-redux'
import { Button, Pin } from './components/common'
import { SideBar } from './components/sideBar'
import {
  closeSidebar,
  toggleContentFullscreen,
  toggleSidebar,
} from './redux/reducers/viewSlice'
import { AppView } from './constants/enums'
import { MapElement } from './components/MapElement'
import { useEffect, useMemo, useState } from 'react'
import { TeaCup } from './components/Timeline'
import TripViewJson from './temp/tripViewData.json'

export function AppInterface() {
  const isSidebarOpen = useSelector((state) => state.view.isSidebarOpen)
  const activeTripId = useSelector((state) => state.view.activeTripId)
  const appView = useSelector((state) => state.view.appView)
  const isContentFullscreen = useSelector(
    (state) => state.view.fullscreenContent,
  )
  const dispatch = useDispatch()

  const [tripData, setTripData] = useState([])

  useEffect(() => {
    const endIndex = 1 + activeTripId * 3
    const data = TripViewJson.slice(0, endIndex)
    setTripData(data)
  }, [activeTripId])

  const cardContent = useMemo(() => {
    return tripData.map((item, index) => {
      const dayNumber = index + 1
      return (
        <div
          key={`details-${dayNumber}`}
          className={`${item['color']} my-2 box-border w-full rounded-md bg-opacity-40 p-4`}
        >
          <h3 className='text-lg font-bold'>Day {dayNumber}</h3>
          {item['stages'].map((stage, stageIndex) => {
            return (
              <div key={`details-${dayNumber}-${stageIndex}`} className='p-2'>
                <p className='font-semibold'>
                  {stage['stageName']}: {stage['locationName']}
                </p>
                <p>⤷ {stage['description']}</p>
              </div>
            )
          })}
        </div>
      )
    })
  }, [tripData])

  const tripViewContent = useMemo(() => {
    const teaCups = tripData.map((item, index) => {
      const displayNumber = index + 1
      return (
        <TeaCup
          key={`overview-pin-${index}`}
          tailwindBgColor={item.color}
          displayNumber={displayNumber}
          titleText={'Day ' + displayNumber}
          locationNames={item['stages'].map((stage) => stage['locationName'])}
        />
      )
    })

    return (
      <div className='flex h-full w-full flex-col justify-end'>
        <div
          className={`pointer-events-auto flex w-full items-end overflow-x-scroll p-8 pt-0 mac-scrollbar`}
        >
          {teaCups}
        </div>
        <Button
          className={`font-bolder pointer-events-auto h-8 w-full cursor-pointer rounded-none bg-gradient-to-r py-1 transition-all duration-300 hover:from-slate-300 hover:via-transparent hover:to-slate-300 
          ${isContentFullscreen ? '' : 'hover:h-9'}`}
          onClick={() => {
            dispatch(toggleContentFullscreen())
          }}
        >
          See {isContentFullscreen ? 'Less' : 'More'}
        </Button>
        <div
          className={`pointer-events-auto w-full overflow-y-auto bg-slate-100 
          ${isContentFullscreen ? 'h-1/2 p-2' : 'h-0'}`}
        >
          {cardContent}
        </div>
      </div>
    )
  }, [appView, tripData, isContentFullscreen])

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

  const renderSidebar = useMemo(() => {
    return (
      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-1/5 flex-row overflow-hidden transition-all
                       ${isSidebarOpen ? 'left-0' : 'left-[-20vw]'}`}
      >
        <SideBar />
      </div>
    )
  }, [isSidebarOpen])

  const renderSidebarToggleButton = useMemo(() => {
    return (
      <span
        className={`fixed top-0 z-50 flex h-full items-center rounded-none transition-all ${
          isSidebarOpen ? 'left-[20vw]' : 'left-0'
        }`}
      >
        <Button
          onClick={() => dispatch(toggleSidebar())}
          className='h-full w-10 rounded-none bg-slate-300 text-6xl hover:bg-slate-400'
        >
          {isSidebarOpen ? '‹' : '›'}
        </Button>
      </span>
    )
  }, [isSidebarOpen, dispatch])

  const renderSidebarShading = useMemo(() => {
    if (!isSidebarOpen) return <></>
    return (
      <div
        className={`fixed left-0 top-0 z-[45] h-full w-full bg-slate-800 opacity-30`}
        onClick={() => dispatch(closeSidebar())}
      />
    )
  }, [dispatch, isSidebarOpen])

  const renderMainContent = useMemo(() => {
    let content = <></>
    if (appView === AppView.TRIP_VIEW) content = tripViewContent
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
  }, [appView, tripViewContent, dayViewContent, isContentFullscreen])

  return (
    <div className='h-screen w-screen overflow-hidden'>
      <MapElement className={`relative left-10 h-full w-[calc(100%-2.5rem)]`} />
      {renderMainContent}
      {renderSidebar}
      {renderSidebarToggleButton}
      {renderSidebarShading}
    </div>
  )
}
