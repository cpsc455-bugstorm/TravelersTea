import { useEffect, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'

// https://www.buzzfeed.com/ailbhemalone/15-weirdly-interesting-facts-about-tea
// https://www.irely.com/insights/ten-fun-facts-about-tea/

const funFacts = [
  'Tea is the second most consumed drink in the world, surpassed only by water.',
  'An estimated 3 billion cups of tea are consumed every day worldwide.',
  'Tea was discovered by the Chinese emperor Shen Nong around 2737 BC when a tea leaf fell into his boiling water.',
  'In 1773, American colonists dumped 342 chests of tea into the Boston Harbor to protest the Tea Act. This event is now known as the Boston Tea Party.',
  'Contrary to popular belief, it’s not just green tea that’s good for you. Black, white, and red tea also have health-giving flavonoids and polyphenols.',
  'The very best tea comes from high elevations and is hand-picked.',
  'In 1908, tea bags were developed by accident in New York as restuarants began brewing merchant’s tea directly in the silk bags to save time',
  'There are around 3,000 different types of tea.',
  'Tea has more caffeine than coffee – but it’s not as simple as that.',
  'You should never use boiling water for tea as you’ll burn the leaf.',
]

const getRandomFunFact = () => {
  const randomIndex = Math.floor(Math.random() * funFacts.length)
  return funFacts[randomIndex]
}

export function Loader() {
  const [fact, setFact] = useState(getRandomFunFact())
  const [key, setKey] = useState(Math.random())

  useEffect(() => {
    const timer = setInterval(() => {
      setFact(getRandomFunFact())
      setKey(Math.random())
    }, 7500)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className={`fixed left-0 top-0 z-[98] h-full w-full bg-slate-800/30`}>
      <div className='opacity-99 fadesIn fixed left-[50%] top-[50%] z-[99] flex h-[200px] w-[500px] -translate-x-1/2 -translate-y-[60%] transform flex-col items-center justify-center rounded-md bg-black'>
        <div className='mx-5 my-2 flex flex-row items-center'>
          <img
            src='/brewing.gif'
            alt='Loading...'
            className='mb-4 h-12 w-12 bg-black'
          />
          <p className='ml-4 text-white'>
            Brewing
            <span className='dot-1'>.</span>
            <span className='dot-2'>.</span>
            <span className='dot-3'>.</span>
          </p>
        </div>
        <p className='text-xs text-amber-500'>
          <b>DID YOU KNOW</b>
        </p>
        <div className='mx-16 inline-block h-16 text-center text-xs text-white'>
          <TypeAnimation
            key={key}
            sequence={[fact]}
            speed={90}
            repeat={1}
            wrapper='span'
            cursor={false}
          />
        </div>
      </div>
    </div>
  )
}
