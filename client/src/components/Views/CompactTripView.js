import { SeeMoreDrawer } from './SeeMoreDrawer'
import { useMemo } from 'react'

export function CompactTripView() {
  const renderCards = useMemo(() => {
    return (
      <>
        <div className='relative h-1/5 w-full bg-red-400'>
          <div className='dot-matrix' aria-hidden={true} />
        </div>
        <div className='relative h-1/5 w-full before:paper-background '>
          <div className='torn-paper' />
          <div className='h-full bg-orange-400'></div>
        </div>
      </>
    )
  }, [])
  return (
    <div className='flex h-full w-full flex-col items-end justify-end'>
      <div className={'relative m-4 h-full w-1/3 rounded-md bg-slate-900 p-2'}>
        {renderCards}
      </div>
      <SeeMoreDrawer />
    </div>
  )
}
