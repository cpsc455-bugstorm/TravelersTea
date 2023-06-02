import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { AppView } from '../../constants/enums'
import { Button } from '../common'

MapElement.propTypes = {
  className: PropTypes.string,
}

export function MapElement({ className }) {
  const appView = useSelector((state) => state.view.appView)
  const activeTripId = useSelector((state) => state.view.activeTripId)

  const newTripForm = useMemo(() => {
    return (
      <div className='z-[5] flex h-full w-full flex-row items-center justify-center'>
        <span className='inline-flex w-1/2 flex-col justify-center rounded-md bg-slate-100 bg-opacity-80 p-4'>
          <h1 className='pb-8 font-mono text-5xl'>Dear Traveler...</h1>
          <form className='flex w-full flex-col items-center'>
            <input
              placeholder='Tell me where you want to go...'
              className='mb-2 w-2/3 rounded-md border-4 border-indigo-950 p-2'
            />
            <input
              placeholder="Tell me how long you're going for..."
              className='mb-2 w-2/3 rounded-md border-4 border-indigo-950 p-2'
            />
          </form>
          <Button
            onClick={() => {}}
            className='font-bolder mt-4 bg-slate-300 hover:bg-slate-400'
          >
            Brew 🍵
          </Button>
        </span>
      </div>
    )
  }, [])

  const mapContent = useMemo(() => {
    if (appView === AppView.NEW_TRIP) {
      return newTripForm
    }
    return (
      <span className='mt-4 inline-flex w-full flex-row justify-center'>
        <h1 className='w-fit rounded-md bg-slate-900 bg-opacity-40 p-4 text-5xl'>
          Map (placeholder #{activeTripId})
        </h1>
      </span>
    )
  }, [appView, activeTripId])

  const bgUrl = useMemo(() => {
    if (appView === AppView.NEW_TRIP) return "bg-[url('../public/globe.png')]"
    return "bg-[url('https://assets.website-files.com/5e832e12eb7ca02ee9064d42/5f7db426b676b95755fb2844_Group%20805.jpg')]"
  }, [appView])

  return (
    <div className={`${bgUrl} bg-cover bg-center ${className}`}>
      {mapContent}
    </div>
  )
}
