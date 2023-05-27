import { useDispatch, useSelector } from 'react-redux'
import { Button, Pin } from './components/common'
import { SideBar } from './components/sideBar'
import {
  closeSidebar,
  setAppView,
  toggleSidebar,
} from './redux/reducers/viewSlice'
import { AppView } from './constants/enums'
import { MapElement } from './components/MapElement'
import { useMemo } from 'react'

function App() {
  const isSidebarOpen = useSelector((state) => state.view.isSidebarOpen)
  const appView = useSelector((state) => state.view.appView)
  const dispatch = useDispatch()

  const detailsContent = useMemo(() => {
    if (appView === AppView.TRIP_OVERVIEW) {
      return (
        <div className="flex h-full w-full flex-col justify-center overflow-y-auto p-4">
          <div
            onClick={() => {
              dispatch(setAppView(AppView.TRIP_DAY))
            }}
            className="my-2 box-border h-64 w-full cursor-pointer bg-red-200 p-4 transition-all hover:scale-[1.01]"
          >
            <h3 className="mb-2 text-2xl font-black text-red-900">DAY 1</h3>
            <p className="mt-2 text-lg font-bold">Stanley Park</p>
            <p className="w-64 text-base font-normal">
              A beautiful park full of bears, coyotes, bigfoot, and dracula.
            </p>
          </div>
          <div className="my-2 box-border h-64 w-full cursor-pointer bg-cyan-200 p-4 transition-all hover:scale-[1.01]">
            <h3 className="mb-2 text-2xl font-black text-cyan-900">DAY 2</h3>
            <p className="mt-2 text-lg font-bold">Insert Place with Rabbits</p>
            <p className="w-64 text-base font-normal">Yay bunnies are great</p>
            <p className="mt-2 text-lg font-bold">A Cafe</p>
            <p className="w-64 text-base font-normal">
              Then we had lunch somewhere.
            </p>
          </div>
          <div className="my-2 box-border h-64 w-full cursor-pointer bg-emerald-200 p-4 transition-all hover:scale-[1.01]"></div>
        </div>
      )
    }
    if (appView === AppView.TRIP_DAY) {
      return (
        <div className="w-full items-center overflow-y-auto bg-gradient-to-r from-indigo-950 to-black py-4">
          <Pin
            className={'ml-4 box-border border-l-4 py-8 pl-4'}
            emoji={'🏠'}
            titleText="Technically,"
            bodyText="this would show the emoji that represents your destination, but I am not coding that in tonight."
          />
          <Pin
            className={'ml-4 box-border border-l-4 py-8 pl-4'}
            emoji={'🏠'}
            titleText="Technically,"
            bodyText="this would show the emoji that represents your destination, but I am not coding that in tonight."
          />
          <Pin
            className={'ml-4 box-border border-l-4 py-8 pl-4'}
            emoji={'🏠'}
            titleText="Technically,"
            bodyText="this would show the emoji that represents your destination, but I am not coding that in tonight."
          />
        </div>
      )
    }
    return <></>
  }, [appView])

  return (
    <div className="relative flex h-screen w-screen flex-row justify-end overflow-hidden">
      <MapElement
        className={`relative left-0 top-0 h-full transition-all ${
          appView === AppView.NEW_TRIP ? 'w-full' : 'w-3/4'
        }`}
      />
      <div
        className={`relative top-0 flex h-full flex-col justify-center ${
          appView === AppView.NEW_TRIP ? 'w-0' : 'w-[calc(25%-2.5rem)]'
        }`}
      >
        {detailsContent}
      </div>
      <div
        className={`fixed left-0 top-0 z-10 flex h-full w-1/5 flex-row overflow-hidden transition-all
                ${isSidebarOpen ? 'left-0' : '-left-[20vw]'}`}
      >
        <SideBar />
      </div>
      <span
        className={`fixed top-0 z-10 flex h-full items-center rounded-none transition-all ${
          isSidebarOpen ? 'left-[20vw]' : 'left-0'
        }`}
      >
        <Button
          onClick={() => dispatch(toggleSidebar())}
          className="h-full w-10 rounded-none bg-slate-300 text-6xl hover:bg-slate-300"
        >
          {isSidebarOpen ? '‹' : '›'}
        </Button>
      </span>
      {isSidebarOpen && (
        <div
          className={`fixed left-0 top-0 z-[5] h-full w-full bg-slate-800 opacity-30`}
          onClick={() => dispatch(closeSidebar())}
        />
      )}
    </div>
  )
}

export default App
