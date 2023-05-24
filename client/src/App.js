import { SideBar } from './components/sideBar'
import { Button } from './components/common'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSidebar } from './reducers/sidebarSlice'

function App() {
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen)
  const dispatch = useDispatch()
  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <div className="h-1/2 w-full bg-slate-100 relative">
        <h1 className="text-center absolute top-1/2 w-full text-5xl">
          Map (placeholder)
        </h1>
      </div>
      <div className="h-1/2 w-full relative">
        <h1 className="text-center absolute top-1/3 w-full text-5xl">
          Timeline (placeholder)
        </h1>
      </div>
      <div
        className={`fixed flex flex-row z-10 top-0 left-0 h-full overflow-hidden transition-all
                ${
                  isSidebarOpen
                    ? 'w-1/5 translate-x-0'
                    : 'w-0 -translate-x-full'
                } `}
      >
        {isSidebarOpen && <SideBar />}
      </div>
      <span
        className={`fixed top-0 z-10 h-full flex items-center rounded-none transition-all ${
          isSidebarOpen ? 'left-[20vw]' : 'left-0'
        }`}
      >
        <Button
          text={isSidebarOpen ? '‹' : '›'}
          onClick={() => dispatch(toggleSidebar())}
          className="text-6xl h-full rounded-none w-12 bg-slate-300"
        />
      </span>
      {isSidebarOpen && (
        <div
          className={`fixed top-0 left-0 z-[5] w-full h-full bg-slate-800 opacity-30`}
          onClick={() => dispatch(toggleSidebar())}
        />
      )}
    </div>
  )
}

export default App
