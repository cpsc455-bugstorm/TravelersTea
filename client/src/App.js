import { useDispatch, useSelector } from 'react-redux'
import { Button } from './components/common'
import { SideBar } from './components/sideBar'
import { toggleSidebar } from './reducers/sidebarSlice'

function App() {
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen)
  const dispatch = useDispatch()
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="relative h-1/2 w-full bg-slate-100">
        <h1 className="absolute top-1/2 w-full text-center text-5xl">
          Map (placeholder)
        </h1>
      </div>
      <div className="relative h-1/2 w-full">
        <h1 className="absolute top-1/3 w-full text-center text-5xl">
          Timeline (placeholder)
        </h1>
      </div>
      <div
        className={`fixed left-0 top-0 z-10 flex h-full flex-row overflow-hidden transition-all
                ${
                  isSidebarOpen
                    ? 'w-1/5 translate-x-0'
                    : 'w-0 -translate-x-full'
                } `}
      >
        {isSidebarOpen && <SideBar />}
      </div>
      <span
        className={`fixed top-0 z-10 flex h-full items-center rounded-none transition-all ${
          isSidebarOpen ? 'left-[20vw]' : 'left-0'
        }`}
      >
        <Button
          text={isSidebarOpen ? '‹' : '›'}
          onClick={() => dispatch(toggleSidebar())}
          className="h-full w-12 rounded-none bg-slate-300 text-6xl"
        />
      </span>
      {isSidebarOpen && (
        <div
          className={`fixed left-0 top-0 z-[5] h-full w-full bg-slate-800 opacity-30`}
          onClick={() => dispatch(toggleSidebar())}
        />
      )}
    </div>
  )
}

export default App
