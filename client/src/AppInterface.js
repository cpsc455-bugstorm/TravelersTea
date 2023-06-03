import { useDispatch, useSelector } from 'react-redux'
import { Button, Pin } from './components/common'
import { SideBar } from './components/sideBar'
import { closeSidebar, toggleSidebar } from './redux/reducers/viewSlice'
import { AppView } from './constants/enums'
import { MapElement } from './components/MapElement'
import { useEffect, useMemo, useState } from 'react'
import { CoffeeCup } from './components/Timeline'
import TripViewJson from './temp/tripViewData.json'

export function AppInterface() {
  const isSidebarOpen = useSelector((state) => state.view.isSidebarOpen)
  const appView = useSelector((state) => state.view.appView)
  const dispatch = useDispatch()

  const [tripData, setTripData] = useState([])

  useEffect(() => {
    setTripData(TripViewJson)
  }, [])

  const detailsContent = useMemo(() => {
    if (appView === AppView.TRIP_VIEW) {
      return tripData.map((item, index) => {
        const displayNumber = index + 1
        return (
          <CoffeeCup
            key={`overview-pin-${index}`}
            tailwindBgColor={item.color}
            displayNumber={displayNumber}
            titleText={'Day ' + displayNumber}
            locationNames={item.stages.map((stage) => stage.locationName)}
          />
        )
      })
    }
    if (appView === AppView.DAY_VIEW) {
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
    }
    return <></>
  }, [appView])

  return (
    <div className='h-screen w-screen overflow-hidden'>
      <MapElement className={`relative left-10 h-full w-[calc(100%-2.5rem)]`} />
      <div
        className={`pointer-events-none fixed bottom-0 left-10 z-10 flex w-[calc(100%-2.5rem)] items-end overflow-x-hidden overflow-y-hidden bg-gradient-to-b from-transparent to-slate-100 transition-all ${
          appView === AppView.NEW_TRIP ? 'h-0' : 'h-1/2'
        }`}
      >
        <div
          className={`pointer-events-auto flex w-full items-end overflow-x-auto p-8 pt-0 mac-scrollbar`}
        >
          {detailsContent}
        </div>
      </div>
      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-1/5 flex-row overflow-hidden transition-all
                       ${isSidebarOpen ? 'left-0' : 'left-[-20vw]'}`}
      >
        <SideBar />
      </div>
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
      {isSidebarOpen && (
        <div
          className={`fixed left-0 top-0 z-[45] h-full w-full bg-slate-800 opacity-30`}
          onClick={() => dispatch(closeSidebar())}
        />
      )}
    </div>
  )
}
