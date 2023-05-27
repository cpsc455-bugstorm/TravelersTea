import { useDispatch, useSelector } from 'react-redux'
import { Button } from './components/common'
import { SideBar } from './components/sideBar'
import { closeSidebar, toggleSidebar } from './redux/reducers/viewSlice'
import { AppView } from './constants/enums'
import { MapElement } from './components/MapElement'

function App() {
  const isSidebarOpen = useSelector((state) => state.view.isSidebarOpen)
  const appView = useSelector((state) => state.view.appView)
  const dispatch = useDispatch()
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <MapElement
        className={`relative left-10 w-[calc(100%-2.5rem)] transition-all ${
          appView === AppView.NEW_TRIP ? 'h-full' : 'h-1/2'
        }`}
      />
      <div
        className={`relative w-full ${
          appView === AppView.NEW_TRIP ? 'h-0' : 'h-1/2'
        }`}
      >
        <h1 className="absolute top-1/3 w-full text-center text-5xl">
          Timeline (placeholder)
        </h1>
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
