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

export function AppInterface() {
  const isSidebarOpen = useSelector((state) => state.view.isSidebarOpen)
  const appView = useSelector((state) => state.view.appView)
  const dispatch = useDispatch()

  const data = [
    {
      stages: [
        {
          stageName: 'breakfast',
          locationName: 'Medina Cafe',
          description: 'A favourite breakfast spot for gourmet foodies.',
        },
        {
          stageName: '1-1',
          locationName: 'Stanley Park',
          description: 'A park with many trees... or maybe not?',
        },
      ],
    },
  ]

  const detailsContent = useMemo(() => {
    if (appView === AppView.TRIP_VIEW) {
      return data.map((item, index) => {
        return (
          <div
            key={`trip-day-${index + 1}`}
            onClick={() => {
              dispatch(setAppView(AppView.DAY_VIEW))
            }}
            className='mx-2 box-border h-4/5 w-64 cursor-pointer bg-red-200 p-4 transition-all hover:scale-[1.01]'
          >
            <h3 className='mb-2 text-2xl font-black text-red-900'>
              DAY {index + 1}
            </h3>
            {item.stages.map((stage, stageIndex) => {
              return (
                <div key={`stage-${index + 1}-${stageIndex}`}>
                  <p className='mt-2 w-full text-lg font-bold'>
                    {stage.stageName}: {stage.locationName}
                  </p>
                  <p className='w-64 w-full text-base font-normal'>
                    {stage.description}
                  </p>
                </div>
              )
            })}
          </div>
        )
      })
    }
    if (appView === AppView.DAY_VIEW) {
      return (
        <div className='inline-flex w-full flex-row items-center justify-center border-b-4'>
          <Pin
            color={'#ef4444'}
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
        className={`fixed bottom-0 left-10 z-10 flex w-[calc(100%-2.5rem)] overflow-x-auto overflow-y-hidden bg-gradient-to-b from-transparent to-slate-100 px-4 transition-all ${
          appView === AppView.NEW_TRIP ? 'h-0' : 'h-1/2'
        }`}
      >
        {detailsContent}
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
